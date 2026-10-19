import { ImageIcon } from 'lucide-react';
import './Placeholder.css';

interface PlaceholderProps {
  /** What belongs here, written as an instruction, e.g. "Add a summary of your role". */
  label: string;
  variant?: 'text' | 'media';
  /** Media only: CSS aspect-ratio, e.g. "16 / 10". */
  aspectRatio?: string;
}

/**
 * Marks content that has not been supplied yet. Deliberately styled so it can
 * never be mistaken for real content.
 */
export function Placeholder({ label, variant = 'text', aspectRatio = '16 / 10' }: PlaceholderProps) {
  if (variant === 'media') {
    return (
      <div className="placeholder placeholder--media" style={{ aspectRatio }} role="img" aria-label={`Placeholder: ${label}`}>
        <ImageIcon size={28} strokeWidth={1.25} aria-hidden="true" />
        <span className="placeholder__tag">Placeholder</span>
        <span className="placeholder__label">{label}</span>
      </div>
    );
  }

  return (
    <p className="placeholder placeholder--text">
      <span className="placeholder__tag">Placeholder</span>
      <span className="placeholder__label">{label}</span>
    </p>
  );
}
