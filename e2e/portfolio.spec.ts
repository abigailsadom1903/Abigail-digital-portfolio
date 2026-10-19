import { expect, test, type Page } from '@playwright/test';

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 768;

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('loads the home page with its key content and no errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.reload();

  await expect(page).toHaveTitle(/Abigail Sadom/);
  await expect(page.getByRole('heading', { level: 1, name: /Abigail Alau R\. Sadom/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /View projects/ })).toBeVisible();

  const photo = page.getByRole('img', { name: /Portrait of Abigail/ });
  await expect(photo).toBeVisible();
  expect(await photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(errors).toEqual([]);
});

test('has no horizontal scrolling', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('CV, email, GitHub and LinkedIn links work', async ({ page, request }) => {
  const cv = page.getByRole('link', { name: /Download CV/ }).first();
  const href = await cv.getAttribute('href');
  expect(href).toMatch(/^\/Abigail-digital-portfolio\/cv\/.+\.pdf$/);
  const response = await request.get(new URL(href!, page.url()).toString());
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('pdf');

  const contact = page.locator('#contact');
  await expect(contact.getByRole('link', { name: /abigailsadom1903@gmail\.com/ })).toHaveAttribute(
    'href',
    'mailto:abigailsadom1903@gmail.com',
  );
  await expect(contact.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/abigailsadom1903');
  const linkedin = contact.getByRole('link', { name: /^LinkedIn/ });
  await expect(linkedin).toHaveAttribute('href', /^https:\/\/www\.linkedin\.com\/in\/[^?#]+$/);
  await expect(contact.getByRole('link', { name: /Resume \(PDF\)/ })).toHaveAttribute('href', href!);
});

test('contact form validates before opening the email app', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Send a message' });
  await form.getByRole('button', { name: /Send message/ }).click();
  await expect(form.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByLabel('Name')).toBeFocused();

  await form.getByRole('radio', { name: 'Something else' }).check();
  await form.getByLabel('Message').fill('Hello');
  await expect(form.getByText('5/1500')).toBeVisible();
});

test('navigation reaches the Engineering Lab', async ({ page }) => {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Lab' }).click();
  await expect(page).toHaveURL(/#lab$/);
  await expect(page.getByRole('heading', { name: /Engineering Lab/ })).toBeInViewport();
});

test('Engineering Lab: keyboard tabs and Run all', async ({ page }) => {
  const lab = page.locator('#lab');
  const architecture = lab.getByRole('tab', { name: /Architecture/ });
  await architecture.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const testing = lab.getByRole('tab', { name: /Testing/ });
  await expect(testing).toHaveAttribute('aria-selected', 'true');
  await expect(testing).toBeFocused();

  await lab.getByRole('button', { name: 'Run all', exact: true }).click();
  await expect(lab.getByText(/^13 passed$/)).toBeVisible();
  await expect(lab.getByText(/^0 failed$/)).toBeVisible();

  await lab.getByRole('switch', { name: /Simulate a regression/ }).check();
  await lab.getByRole('button', { name: 'Run all', exact: true }).click();
  await expect(lab.getByText(/^0 failed$/)).toBeHidden();

  await lab.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(lab.getByText(/^13 not run$/)).toBeVisible();
});

test('Engineering Lab: data model search and relationships', async ({ page }) => {
  const lab = page.locator('#lab');
  await lab.getByRole('tab', { name: /Data model/ }).click();
  await lab.getByLabel(/Search tables and columns/).fill('receipt');
  await expect(lab.getByText('1 of 22 tables')).toBeVisible();
  await expect(lab.getByRole('heading', { name: 'donations' })).toBeVisible();
  await lab.getByRole('button', { name: 'church_info', exact: true }).first().click();
  await expect(lab.getByRole('heading', { name: 'church_info' })).toBeVisible();
});

test('project links open the Lab on the matching project', async ({ page }) => {
  await page.locator('#schoolfam summary').click();
  await page.locator('#schoolfam').getByRole('link', { name: /Explore it in the Engineering Lab/ }).click();
  await expect(page).toHaveURL(/#lab-schoolfam$/);
  const lab = page.locator('#lab');
  await expect(lab.getByRole('group', { name: 'Choose a project' }).getByRole('button', { name: /SchoolFam/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(lab.getByRole('button', { name: /Role-based navigation/ })).toBeVisible();
});

test('projects: a case study opens and the pager moves on', async ({ page }) => {
  const church = page.locator('#web-based-church-management-system details');
  if ((await church.getAttribute('open')) === null) await church.locator('summary').click();
  await expect(church).toHaveAttribute('open', '');
  await page.locator('#web-based-church-management-system').getByRole('button', { name: /Next/ }).click();
  await expect(page.locator('#schoolfam details')).toHaveAttribute('open', '');
});

test('mobile menu opens and closes with Escape', async ({ page }) => {
  test.skip(!isMobile(page), 'Mobile only');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
