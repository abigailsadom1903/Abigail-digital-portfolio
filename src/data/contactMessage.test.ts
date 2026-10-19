import { describe, expect, it } from 'vitest';
import { buildMailto, MESSAGE_MAX_LENGTH, validateContact, type ContactDraft } from './contactMessage';

const draft: ContactDraft = {
  topic: 'internship',
  name: 'Siti Recruiter',
  email: 'siti@example.com',
  message: 'We have a QA internship for 2027.',
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(draft)).toEqual({});
  });

  it('requires every field and a valid email', () => {
    expect(validateContact({ ...draft, name: ' ', email: '', message: '' })).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    });
    expect(validateContact({ ...draft, email: 'not-an-email' }).email).toMatch(/valid email/);
  });

  it('limits the message length', () => {
    expect(validateContact({ ...draft, message: 'x'.repeat(MESSAGE_MAX_LENGTH + 1) }).message).toMatch(/under/);
  });
});

describe('buildMailto', () => {
  it('addresses the owner with the topic, message and sender details encoded', () => {
    const url = buildMailto('abigailsadom1903@gmail.com', { ...draft, message: 'Hi & hello?\nThanks' });
    expect(url.startsWith('mailto:abigailsadom1903@gmail.com?subject=')).toBe(true);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toBe('Job or internship: message from Siti Recruiter');
    expect(params.get('body')).toBe('Hi & hello?\nThanks\n\nSiti Recruiter\nsiti@example.com');
  });
});
