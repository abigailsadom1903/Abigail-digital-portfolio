import { describe, expect, it } from 'vitest';
import { cleanProfileUrl, profile } from './profile';

describe('profile', () => {
  it('removes tracking parameters from profile links', () => {
    expect(
      cleanProfileUrl('https://www.linkedin.com/in/abigail-s-4a44a1157?utm_source=share_via&utm_medium=member_ios'),
    ).toBe('https://www.linkedin.com/in/abigail-s-4a44a1157');
    expect(cleanProfileUrl(null)).toBeNull();
  });

  it('exposes clean contact links', () => {
    const linkedin = profile.contact.find((c) => c.kind === 'linkedin');
    expect(linkedin?.href ?? '').not.toContain('?');
    expect(linkedin?.display ?? '').not.toContain('utm');
    const email = profile.contact.find((c) => c.kind === 'email');
    expect(email?.href).toMatch(/^mailto:/);
  });

  it('points the CV link inside the site', () => {
    expect(profile.cvUrl).toMatch(/\/cv\/.+\.pdf$/);
  });
});
