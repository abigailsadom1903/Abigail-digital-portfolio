import { ArrowUp } from 'lucide-react';
import { Container } from '../components/Container';
import './Footer.css';

const YEAR = new Date().getFullYear();

interface FooterProps {
  name: string;
}

export function Footer({ name }: FooterProps) {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <p>
          © {YEAR} {name}
        </p>
        <a className="site-footer__top" href="#top">
          Back to top
          <ArrowUp size={16} aria-hidden="true" />
        </a>
      </Container>
    </footer>
  );
}
