import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import './ImageLightbox.css';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  /** Index to show, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Fades the image in once it has loaded; keyed by index so each image starts hidden. */
function LightboxImg({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return <img src={src} alt={alt} className={loaded ? 'is-loaded' : undefined} onLoad={() => setLoaded(true)} />;
}

/**
 * Full-size image viewer built on the native <dialog>, which provides focus
 * trapping, Escape to close and a backdrop. Arrow keys move between images.
 */
export function ImageLightbox({ images, index, onChange }: ImageLightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal?.();
    if (index === null && dialog.open) dialog.close?.();
  }, [index]);

  const image = index !== null ? images[index] : null;
  const many = images.length > 1;
  const step = (delta: number) => index !== null && onChange((index + delta + images.length) % images.length);

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (!many) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={image ? `Image: ${image.alt}` : 'Image viewer'}
      onClose={() => onChange(null)}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) onChange(null);
      }}
    >
      {image && (
        <figure className="lightbox__figure">
          <LightboxImg key={index} src={image.src} alt={image.alt} />
          <figcaption className="lightbox__bar">
            <span>
              {image.caption ?? image.alt}
              {many && (
                <span className="lightbox__count">
                  {' '}
                  · {index! + 1} of {images.length}
                </span>
              )}
            </span>
            <span className="lightbox__controls">
              {many && (
                <>
                  <button type="button" className="lightbox__btn" onClick={() => step(-1)} aria-label="Previous image">
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button type="button" className="lightbox__btn" onClick={() => step(1)} aria-label="Next image">
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </>
              )}
              <button type="button" className="lightbox__btn" onClick={() => onChange(null)} aria-label="Close image viewer">
                <X size={20} aria-hidden="true" />
              </button>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
