import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArchitectureExplorer } from '../components/lab/ArchitectureExplorer';
import { DataModelExplorer } from '../components/lab/DataModelExplorer';
import { DecisionJournal } from '../components/lab/DecisionJournal';
import { TestingPlayground } from '../components/lab/TestingPlayground';
import { Section } from '../components/Section';
import { labProjects } from '../data/lab';
import type { LabProject } from '../data/lab/types';
import './Lab.css';

const MODULES = [
  { id: 'architecture', label: 'Architecture', description: 'How the system’s parts fit together' },
  { id: 'data-model', label: 'Data model', description: 'Entities, fields and relationships' },
  { id: 'testing', label: 'Testing', description: 'Run test scenarios against real rules' },
  { id: 'decisions', label: 'Decisions', description: 'Problems, trade-offs and evidence' },
] as const;

type ModuleId = (typeof MODULES)[number]['id'];

interface LabProps {
  projects?: LabProject[];
  /** Simulated test run time; tests pass 0. */
  testRunDelay?: number;
}

/**
 * Engineering Lab: interactive views of real projects.
 * Module tabs follow the WAI-ARIA tabs pattern (arrow keys, Home, End). Inactive
 * panels stay mounted so each module keeps its state while switching tabs;
 * switching project remounts the modules with that project's data.
 */
export function Lab({ projects = labProjects, testRunDelay }: LabProps) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [active, setActive] = useState<ModuleId>('architecture');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  // Links such as #lab-schoolfam open the Lab on that project.
  useEffect(() => {
    const applyHash = () => {
      const match = window.location.hash.match(/^#lab-([\w-]+)$/);
      if (!match || !projects.some((p) => p.id === match[1])) return;
      setProjectId(match[1]);
      document.getElementById('lab')?.scrollIntoView();
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [projects]);

  const project = projects.find((p) => p.id === projectId) ?? projects[0];
  if (!project) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = MODULES.length;
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % count
        : event.key === 'ArrowLeft'
          ? (index - 1 + count) % count
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? count - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(MODULES[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="lab" index="02" title="Engineering Lab" aside="Interactive" tone="tinted">
      <div className="lab__head" data-reveal>
        <p className="lab__intro">
          A closer look at how my projects are built: their structure, data, rules and the decisions behind them. Choose
          a project, then explore each module.
        </p>
        <div className="lab__projects" role="group" aria-label="Choose a project">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className="lab__project"
              aria-pressed={p.id === project.id}
              onClick={() => setProjectId(p.id)}
            >
              <span className="lab__project-name">{p.name}</span>
              <span className="lab__project-blurb">{p.blurb}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lab" data-reveal>
        <div className="lab__tabs" role="tablist" aria-label={`${project.name}: Engineering Lab modules`}>
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
            {m.id === 'architecture' && <ArchitectureExplorer key={project.id} architecture={project.architecture} />}
            {m.id === 'data-model' && <DataModelExplorer key={project.id} schema={project.schema} />}
            {m.id === 'testing' && (
              <TestingPlayground key={project.id} suite={project.testSuite} schema={project.schema} runDelay={testRunDelay} />
            )}
            {m.id === 'decisions' && <DecisionJournal key={project.id} decisions={project.decisions} />}
          </div>
        ))}
      </div>
    </Section>
  );
}
