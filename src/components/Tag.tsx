import './Tag.css';

interface TagListProps {
  items: string[];
  label: string;
}

/** A labelled, wrapping list of short tags (e.g. a tech stack). */
export function TagList({ items, label }: TagListProps) {
  return (
    <ul className="tag-list" role="list" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="tag">
          {item}
        </li>
      ))}
    </ul>
  );
}
