import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArchitectureExplorer } from '../components/lab/ArchitectureExplorer';
import { DataModelExplorer } from '../components/lab/DataModelExplorer';
import { DecisionJournal } from '../components/lab/DecisionJournal';
import { TestingPlayground } from '../components/lab/TestingPlayground';
import { Section } from '../components/Section';
import { architecture, decisions, schema, testSuite } from '../data/lab';
import './Lab.css';

const MODULES = [
  { id: 'architecture', label: 'Architecture', description: 'How the system’s parts fit together' },
  { id: 'data-model', label: 'Data model', description: 'Tables, fields and relationships' },
  { id: 'testing', label: 'Testing', description: 'Run test scenarios against the schema rules' },
  { id: 'decisions', label: 'Decisions', description: 'Problems, trade-offs and evidence' },
] as const;

type ModuleId = (typeof MODULES)[number]['id'];

interface LabProps {
  /** Simulated test run time; tests pass 0. */
  testRunDelay?: number;
}

/**
 * Engineering Lab: interactive views of the Church Management System.
 * Tabs follow the WAI-ARIA tabs pattern (arrow keys, Home, End). Inactive
 * panels stay mounted so each module keeps its state when switching.
 */
export function Lab({ testRunDelay }: LabProps) {
  const [active, setActive] = useState<ModuleId>('architecture');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = MODULES.length - 1;
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % MODULES.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + MODULES.length) % MODULES.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(MODULES[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="lab" index="02" title="Engineering Lab" aside="Interactive" tone="tinted">
      <p className="lab__intro" data-reveal>
        A closer look at my Final Year Project, the <strong>{architecture.system}</strong>: how it is structured, how its
        data is modelled, how its rules can be tested, and the engineering decisions behind it.
      </p>

      <div className="lab" data-reveal>
        <div className="lab__tabs" role="tablist" aria-label="Engineering Lab modules">
          {MODULES.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${m.id}`}
              type="button"
              role="tab"
              aria-selected={active === m.id}
              aria-controls={`${baseId}-panel-${m.id}`}
              tabIndex={active === m.id ? 0 : -1}
              className="lab__tab"
              onClick={() => setActive(m.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="lab__tab-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lab__tab-text">
                <span className="lab__tab-label">{m.label}</span>
                <span className="lab__tab-desc">{m.description}</span>
              </span>
            </button>
          ))}
        </div>

        {MODULES.map((m) => (
          <div
            key={m.id}
            id={`${baseId}-panel-${m.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${m.id}`}
            hidden={active !== m.id}
            tabIndex={0}
            className="lab__panel"
          >
            {m.id === 'architecture' && <ArchitectureExplorer architecture={architecture} />}
            {m.id === 'data-model' && <DataModelExplorer schema={schema} />}
            {m.id === 'testing' && <TestingPlayground suite={testSuite} schema={schema} runDelay={testRunDelay} />}
            {m.id === 'decisions' && <DecisionJournal decisions={decisions} />}
          </div>
        ))}
      </div>
    </Section>
  );
}
