/*
 * Contact form logic. The site has no backend, so a message is handed to the
 * visitor's own email app as a pre-filled mailto: link. Nothing is stored or
 * sent by the site itself.
 */

export const CONTACT_TOPICS = [
  { id: 'internship', label: 'Job or internship' },
  { id: 'project', label: 'Project or collaboration' },
  { id: 'other', label: 'Something else' },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['id'];

/** Kept well under the ~2,000-character limit some email apps place on mailto: links. */
export const MESSAGE_MAX_LENGTH = 1500;

export interface ContactDraft {
  topic: ContactTopic;
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {};
  if (!draft.name.trim()) errors.name = 'Please enter your name.';
  if (!draft.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Please enter a valid email address, like name@example.com.';
  if (!draft.message.trim()) errors.message = 'Please write a short message.';
  else if (draft.message.length > MESSAGE_MAX_LENGTH)
    errors.message = `Please keep your message under ${MESSAGE_MAX_LENGTH.toLocaleString()} characters.`;
  return errors;
}

/** A mailto: link addressed to `to`, with the topic in the subject and the sender's details in the body. */
export function buildMailto(to: string, draft: ContactDraft): string {
  const topic = CONTACT_TOPICS.find((t) => t.id === draft.topic)?.label ?? 'Message';
  const name = draft.name.trim();
  const subject = `${topic}: message from ${name}`;
  const body = `${draft.message.trim()}\n\n${name}\n${draft.email.trim()}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
