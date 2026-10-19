import { ChevronDown, FlaskConical, Play, RotateCcw, Search } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { describeOutcome, runScenario, type TestResult } from '../../data/lab/testEngine';
import type { Schema, TestRule, TestSuite } from '../../data/lab/types';
import './TestingPlayground.css';

type Status = 'not-run' | 'running' | 'passed' | 'failed';
type Filter = 'all' | 'passed' | 'failed' | 'not-run';

interface TestingPlaygroundProps {
  suite: TestSuite;
  schema: Schema;
  /** Simulated run time per batch, in ms. Tests pass 0. */
  runDelay?: number;
}

interface RunState {
  status: Status;
  result?: TestResult;
}

/** Short description of what a scenario inspects, e.g. "donations.status" or "Layout: homework". */
function checkTarget(rule: TestRule): string[] {
  switch (rule.kind) {
    case 'navAccess':
      return [rule.table, `${rule.role} → ${rule.view}`];
    case 'registration':
      return ['App.tsx sign-up', rule.role];
    case 'unique':
      return [rule.table];
    case 'availability':
      return ['isRoomAvailable', `${rule.request.date} ${rule.request.startTime}–${rule.request.endTime}`];
    default:
      return [rule.table, rule.column];
  }
}

const STATUS_LABEL: Record<Status, string> = {
  'not-run': 'Not run',
  running: 'Running…',
  passed: 'Passed',
  failed: 'Failed',
};

export function TestingPlayground({ suite, schema, runDelay = 400 }: TestingPlaygroundProps) {
  const [runs, setRuns] = useState<Record<string, RunState>>({});
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [regression, setRegression] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const timers = useRef<number[]>([]);
  const searchId = useId();
  const filterId = useId();

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const statusOf = (id: string): Status => runs[id]?.status ?? 'not-run';

  const run = (ids: string[]) => {
    setRuns((prev) => ({ ...prev, ...Object.fromEntries(ids.map((id) => [id, { status: 'running' as Status }])) }));
    const finish = () =>
      setRuns((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          const scenario = suite.scenarios.find((s) => s.id === id);
          if (!scenario) continue;
          const result = runScenario({ schema, navigation: suite.navigation }, scenario, { regression });
          next[id] = { status: result.status, result };
        }
        return next;
      });
    if (runDelay > 0) timers.current.push(window.setTimeout(finish, runDelay));
    else finish();
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRuns({});
  };

  const toggleRegression = () => {
    setRegression((r) => !r);
    reset(); // Earlier results no longer describe the current system.
  };

  const toggleDetails = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suite.scenarios.filter((s) => {
      const matchesQuery =
        q === '' || [s.id, s.title, s.area, s.type].some((field) => field.toLowerCase().includes(q));
      const status = runs[s.id]?.status ?? 'not-run';
      const matchesFilter = filter === 'all' || status === filter || (filter === 'not-run' && status === 'running');
      return matchesQuery && matchesFilter;
    });
  }, [suite.scenarios, query, filter, runs]);

  const counts = suite.scenarios.reduce(
    (acc, s) => {
      const status = statusOf(s.id);
      if (status === 'passed') acc.passed++;
      else if (status === 'failed') acc.failed++;
      else acc.notRun++;
      return acc;
    },
    { passed: 0, failed: 0, notRun: 0 },
  );
  const anyRunning = suite.scenarios.some((s) => statusOf(s.id) === 'running');

  return (
    <div className="tp">
      <p className="tp__notice">
        <FlaskConical size={18} aria-hidden="true" />
        <span>
          <strong>Simulation.</strong> {suite.note}
        </span>
      </p>

      <div className="tp__toolbar">
        <div className="lab-field tp__search">
          <label htmlFor={searchId}>Search scenarios</label>
          <div className="lab-input-wrap">
            <Search size={16} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              value={query}
              placeholder="e.g. donation, DEL-01, security"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="lab-field">
          <label htmlFor={filterId}>Status</label>
          <select id={filterId} value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="not-run">Not run</option>
          </select>
        </div>
        <div className="tp__actions">
          <button
            type="button"
            className="lab-button lab-button--primary"
            onClick={() => run(suite.scenarios.map((s) => s.id))}
            disabled={anyRunning}
          >
            <Play size={16} aria-hidden="true" />
            Run all
          </button>
          <button type="button" className="lab-button" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="tp__status-row">
        <p className="tp__summary" aria-live="polite">
          <span className="tp__count tp__count--passed">{counts.passed} passed</span>
          <span className="tp__count tp__count--failed">{counts.failed} failed</span>
          <span className="tp__count">{counts.notRun} not run</span>
        </p>
        <label className="tp__switch">
          <input type="checkbox" role="switch" checked={regression} onChange={toggleRegression} />
          <span className="tp__switch-track" aria-hidden="true" />
          Simulate a regression
          <span className="tp__switch-hint">(removes the rules being tested)</span>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="lab-empty">
          <p>No scenarios match your search and filter.</p>
          <button
            type="button"
            className="lab-button"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
          >
            Show all scenarios
          </button>
        </div>
      ) : (
        <ul className="tp__list" role="list">
          {visible.map((s) => {
            const state = runs[s.id];
            const status = state?.status ?? 'not-run';
            const open = expanded.has(s.id);
            const detailsId = `tp-details-${s.id}`;
            return (
              <li key={s.id} className={`tp__item tp__item--${status}`}>
                <div className="tp__row">
                  <span className={`tp__badge tp__badge--${status}`}>{STATUS_LABEL[status]}</span>
                  <div className="tp__heading">
                    <span className="tp__title">{s.title}</span>
                    <span className="tp__meta">
                      <code>{s.id}</code> · {s.area} · {s.type}
                    </span>
                  </div>
                  <div className="tp__row-actions">
                    <button
                      type="button"
                      className="lab-button lab-button--small"
                      onClick={() => run([s.id])}
                      disabled={status === 'running'}
                      aria-label={`Run test ${s.id}: ${s.title}`}
                    >
                      <Play size={14} aria-hidden="true" />
                      Run test
                    </button>
                    <button
                      type="button"
                      className="tp__toggle"
                      aria-expanded={open}
                      aria-controls={detailsId}
                      onClick={() => toggleDetails(s.id)}
                    >
                      <span className="visually-hidden">Details for {s.id}</span>
                      <ChevronDown size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div id={detailsId} className="tp__details" hidden={!open}>
                  <div>
                    <h5 className="lab-subheading">Steps</h5>
                    <ol className="tp__steps">
                      {s.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <dl className="lab-facts">
                    <div>
                      <dt>Expected</dt>
                      <dd>{describeOutcome(s.rule, s.expect)}</dd>
                    </div>
                    <div>
                      <dt>Actual</dt>
                      <dd className={status === 'failed' ? 'tp__actual--failed' : undefined}>
                        {state?.result ? state.result.actual.text : status === 'running' ? 'Running…' : 'Not run yet'}
                      </dd>
                    </div>
                    <div>
                      <dt>Checks</dt>
                      <dd>
                        {checkTarget(s.rule).map((t) => (
                          <code key={t} className="lab-code">
                            {t}
                          </code>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
