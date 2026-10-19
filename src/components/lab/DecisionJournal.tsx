import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Decision } from '../../data/lab/types';
import { Placeholder } from '../Placeholder';
import './DecisionJournal.css';

interface DecisionJournalProps {
  decisions: Decision[];
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="lab-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Expandable engineering case studies, filterable by project. */
export function DecisionJournal({ decisions }: DecisionJournalProps) {
  const projects = [...new Set(decisions.map((d) => d.project))];
  const [project, setProject] = useState<string | null>(null);
  const visible = decisions.filter((d) => project === null || d.project === project);

  return (
    <div className="dj">
      <div className="dj__filters" role="group" aria-label="Filter decisions by project">
        <button type="button" className="chip" aria-pressed={project === null} onClick={() => setProject(null)}>
          All ({decisions.length})
        </button>
        {projects.map((p) => (
          <button key={p} type="button" className="chip" aria-pressed={project === p} onClick={() => setProject(p)}>
            {p} ({decisions.filter((d) => d.project === p).length})
          </button>
        ))}
      </div>

      <ol className="dj__list" role="list">
        {visible.map((d, i) => (
          <li key={d.id} className="dj__item">
            <details>
              <summary className="dj__summary">
                <span className="dj__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="dj__heading">
                  <span className="dj__title">{d.title}</span>
                  <span className="dj__project">{d.project}</span>
                </span>
                <Plus className="dj__toggle" size={18} aria-hidden="true" />
              </summary>

              <div className="dj__body">
                <div className="dj__block dj__block--wide">
                  <h5 className="lab-subheading">Problem</h5>
                  <p>{d.problem}</p>
                </div>
                <div className="dj__block">
                  <h5 className="lab-subheading">Alternatives</h5>
                  <List items={d.alternatives} />
                </div>
                <div className="dj__block">
                  <h5 className="lab-subheading">Decision</h5>
                  <p>{d.decision}</p>
                </div>
                <div className="dj__block">
                  <h5 className="lab-subheading">Trade-offs</h5>
                  <List items={d.tradeoffs} />
                </div>
                <div className="dj__block">
                  <h5 className="lab-subheading">Evidence</h5>
                  <List items={d.evidence} />
                </div>
                {d.lessons.trim() ? (
                  <div className="dj__block dj__block--wide">
                    <h5 className="lab-subheading">Lessons learned</h5>
                    <p>{d.lessons}</p>
                  </div>
                ) : (
                  <div className="dj__block dj__block--wide">
                    <Placeholder label="TODO: add what you learned from this decision" />
                  </div>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
