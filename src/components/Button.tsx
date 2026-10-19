import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { SHOW_PLACEHOLDERS } from './Placeholder';
import './Button.css';

type Variant = 'primary' | 'secondary' | 'text';

interface ButtonLinkProps {
  children: ReactNode;
  /** Destination. When `null`, the control renders as a non-interactive "not yet available" label. */
  href: string | null;
  variant?: Variant;
  icon?: LucideIcon;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  /** Suggested filename for downloads, or `true` to keep the original name. */
  download?: boolean | string;
  /** Shown beside the label when `href` is `null`. */
  unavailableNote?: string;
  className?: string;
}

/**
 * All call-to-action buttons on the site navigate somewhere, so they are links.
 * A missing destination never produces a dead link: it becomes a visibly
 * unavailable label instead.
 */
export function ButtonLink({
  children,
  href,
  variant = 'primary',
  icon: Icon,
  external = false,
  download,
  unavailableNote = 'Coming soon',
  className,
}: ButtonLinkProps) {
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ');

  if (href === null) {
    if (!SHOW_PLACEHOLDERS) return null;
    return (
      <span className={`${classes} btn--unavailable`} aria-disabled="true">
        {Icon && <Icon className="btn__icon" size={18} aria-hidden="true" />}
        <span>{children}</span>
        <span className="btn__note">({unavailableNote})</span>
      </span>
    );
  }

  return (
    <a
      className={classes}
      href={href}
      download={download === true ? '' : download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {Icon && <Icon className="btn__icon" size={18} aria-hidden="true" />}
      <span>{children}</span>
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  );
}
