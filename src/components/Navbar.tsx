import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ContactLink, NavItem } from '../data/types';
import { useActiveSection } from '../hooks/useActiveSection';
import { useHideOnScroll } from '../hooks/useHideOnScroll';
import { BrandIcon, type Brand } from './BrandIcon';
import { Container } from './Container';
import './Navbar.css';

interface NavbarProps {
  items: NavItem[];
  brand: string;
  initials: string;
  /** LinkedIn / GitHub profile links, shown as logo buttons. */
  socials?: ContactLink[];
}

const DESKTOP_QUERY = '(min-width: 48rem)';

export function Navbar({ items, brand, initials, socials = [] }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { scrolled, hidden } = useHideOnScroll();
  const active = useActiveSection(items.map((item) => item.id));
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape (returning focus to the toggle), outside click, or growing to desktop width.
  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const media = window.matchMedia(DESKTOP_QUERY);
    const onMediaChange = () => media.matches && setOpen(false);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    media.addEventListener('change', onMediaChange);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      media.removeEventListener('change', onMediaChange);
    };
  }, [open]);

  const classes = ['site-header', scrolled && 'is-scrolled', hidden && !open && 'is-hidden'].filter(Boolean).join(' ');

  return (
    <header ref={headerRef} className={classes}>
      <Container className="site-header__inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            {initials}
          </span>
          <span className="brand__name">{brand}</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>

        <nav id="primary-nav" className="nav" aria-label="Primary" data-open={open}>
          <ul className="nav__list" role="list">
            {items.map((item, i) => (
              <li key={item.id}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  className="nav__link"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {socials.length > 0 && (
            <ul className="nav__social" role="list" aria-label="Profiles">
              {socials.map((link) => (
                <li key={link.kind}>
                  <a
                    className="nav__social-link"
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                    title={link.label}
                  >
                    <BrandIcon brand={link.kind as Brand} size={17} />
                    <span className="nav__social-text" aria-hidden="true">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </Container>
    </header>
  );
}
