import { Check, Copy, Download, Send } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ButtonLink } from '../components/Button';
import { Section } from '../components/Section';
import {
  buildMailto,
  CONTACT_TOPICS,
  MESSAGE_MAX_LENGTH,
  validateContact,
  type ContactDraft,
  type ContactErrors,
} from '../data/contactMessage';
import type { Profile } from '../data/types';
import './Contact.css';

interface ContactProps {
  profile: Profile;
  /** Opens the composed mailto: link. Replaced in tests. */
  openMailto?: (url: string) => void;
}

type CopyState = 'idle' | 'copied' | 'failed';

const EMPTY: ContactDraft = { topic: 'internship', name: '', email: '', message: '' };

const openInEmailApp = (url: string) => window.location.assign(url);

export function Contact({ profile, openMailto = openInEmailApp }: ContactProps) {
  const email = profile.contact.find((c) => c.kind === 'email' && c.href)?.display ?? null;
  const links = profile.contact.filter((c) => c.kind !== 'email' && c.href);

  const [draft, setDraft] = useState<ContactDraft>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [copy, setCopy] = useState<CopyState>('idle');
  const copyTimer = useRef<number | undefined>(undefined);
  const ids = { name: useId(), email: useId(), message: useId(), count: useId() };
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  if (!email) return null;

  const update = <K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopy('idle'), 2500);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(draft);
    setErrors(found);
    const firstInvalid = (['name', 'email', 'message'] as const).find((k) => found[k]);
    if (firstInvalid) {
      setStatus(null);
      ({ name: nameRef, email: emailRef, message: messageRef })[firstInvalid].current?.focus();
      return;
    }
    openMailto(buildMailto(email, draft));
    setStatus(`Your email app should now open with this message ready to send. If it didn’t, email me at ${email}.`);
  };

  const describedBy = (field: keyof ContactErrors, extra?: string) =>
    [errors[field] ? `${ids[field]}-error` : null, extra].filter(Boolean).join(' ') || undefined;

  return (
    <Section id="contact" index="06" title="Contact">
      <div className="contact">
        <div className="contact__info" data-reveal>
          <p className="contact__intro">
            Hiring interns, working on a project, or curious about something I built? Send a message or email me
            directly.
          </p>

          <div className="contact__email">
            <a href={`mailto:${email}`} className="contact__email-link">
              {email}
            </a>
            <button type="button" className="contact__copy" onClick={copyEmail} aria-label="Copy email address">
              {copy === 'copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copy === 'copied' ? 'Copied' : 'Copy'}
            </button>
            <span className="visually-hidden" aria-live="polite">
              {copy === 'copied' ? 'Email address copied.' : copy === 'failed' ? 'Could not copy. Please select the address.' : ''}
            </span>
          </div>
          {copy === 'failed' && <p className="contact__hint">Couldn’t copy automatically. Please select the address instead.</p>}

          {profile.lookingFor && (
            <p className="contact__lead">Open to {profile.lookingFor.charAt(0).toLowerCase() + profile.lookingFor.slice(1)}.</p>
          )}

          <div className="contact__actions">
            <ButtonLink href={profile.cvUrl} variant="secondary" icon={Download} download unavailableNote="CV coming soon">
              Resume (PDF)
            </ButtonLink>
          </div>

          {links.length > 0 && (
            <ul className="contact__links" role="list">
              {links.map((link) => (
                <li key={link.kind}>
                  <a href={link.href!} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="contact__form" onSubmit={onSubmit} noValidate aria-label="Send a message" data-reveal>
          <fieldset className="contact__topics">
            <legend className="contact__label">What’s this about?</legend>
            <div className="contact__topic-options">
              {CONTACT_TOPICS.map((t) => (
                <label key={t.id} className="contact__topic">
                  <input
                    type="radio"
                    name="topic"
                    value={t.id}
                    checked={draft.topic === t.id}
                    onChange={() => update('topic', t.id)}
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor={ids.name} className="contact__label">
                Name
              </label>
              <input
                ref={nameRef}
                id={ids.name}
                type="text"
                autoComplete="name"
                value={draft.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                onChange={(e) => update('name', e.target.value)}
              />
              {errors.name && (
                <p id={`${ids.name}-error`} className="contact__error">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="contact__field">
              <label htmlFor={ids.email} className="contact__label">
                Email
              </label>
              <input
                ref={emailRef}
                id={ids.email}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={draft.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('email')}
                onChange={(e) => update('email', e.target.value)}
              />
              {errors.email && (
                <p id={`${ids.email}-error`} className="contact__error">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="contact__field">
            <div className="contact__label-row">
              <label htmlFor={ids.message} className="contact__label">
                Message
              </label>
              <span id={ids.count} className="contact__count">
                {draft.message.length}/{MESSAGE_MAX_LENGTH}
              </span>
            </div>
            <textarea
              ref={messageRef}
              id={ids.message}
              rows={7}
              maxLength={MESSAGE_MAX_LENGTH}
              placeholder="What role or project is this about, and how can I help?"
              value={draft.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy('message', ids.count)}
              onChange={(e) => update('message', e.target.value)}
            />
            {errors.message && (
              <p id={`${ids.message}-error`} className="contact__error">
                {errors.message}
              </p>
            )}
          </div>

          <div className="contact__submit">
            <button type="submit" className="contact__send">
              <Send size={16} aria-hidden="true" />
              Send message
            </button>
            <p className="contact__note">Opens your email app with this message ready. Nothing is stored on this site.</p>
          </div>

          <p className="contact__status" role="status">
            {status}
          </p>
        </form>
      </div>
    </Section>
  );
}
