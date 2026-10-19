import { useState } from 'react';
import type { Architecture } from '../../data/lab/types';
import './ArchitectureExplorer.css';

interface ArchitectureExplorerProps {
  architecture: Architecture;
}

/**
 * Clickable component diagram. Selecting a component shows its details;
 * selecting a flow numbers the components it passes through, in order.
 */
export function ArchitectureExplorer({ architecture }: ArchitectureExplorerProps) {
  const { layers, nodes, flows } = architecture;
  const [selectedId, setSelectedId] = useState(nodes[0]?.id ?? '');
  const [flowId, setFlowId] = useState<string | null>(null);

  const selected = nodes.find((n) => n.id === selectedId) ?? nodes[0];
  const flow = flows.find((f) => f.id === flowId) ?? null;

  /** Step numbers (1-based) at which the active flow visits each node. */
  const stepsByNode = new Map<string, number[]>();
  flow?.steps.forEach((step, i) => stepsByNode.set(step.node, [...(stepsByNode.get(step.node) ?? []), i + 1]));

  const titleOf = (id: string) => nodes.find((n) => n.id === id)?.title ?? id;

  return (
    <div className="arch">
      <div className="arch__flows" role="group" aria-label="Show a request flow">
        <span className="arch__flows-label">Trace a flow</span>
        <button type="button" className="chip" aria-pressed={flow === null} onClick={() => setFlowId(null)}>
          None
        </button>
        {flows.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            aria-pressed={flowId === f.id}
            onClick={() => setFlowId(flowId === f.id ? null : f.id)}
          >
            {f.title}
          </button>
        ))}
      </div>

      <div className="arch__layout">
        <div className={`arch__diagram${flow ? ' arch__diagram--tracing' : ''}`}>
          {layers.map((layer) => (
            <div key={layer.id} className="arch__layer" role="group" aria-labelledby={`arch-layer-${layer.id}`}>
              <h4 id={`arch-layer-${layer.id}`} className="arch__layer-title">
                {layer.label}
              </h4>
              {nodes
                .filter((n) => n.layer === layer.id)
                .map((node) => {
                  const steps = stepsByNode.get(node.id);
                  return (
                    <button
                      key={node.id}
                      type="button"
                      className={`arch__node${steps ? ' arch__node--in-flow' : ''}`}
                      aria-pressed={node.id === selected.id}
                      onClick={() => setSelectedId(node.id)}
                    >
                      {steps && (
                        <span className="arch__steps">
                          <span aria-hidden="true">{steps.join(' · ')}</span>
                          <span className="visually-hidden">Flow step {steps.join(' and ')}: </span>
                        </span>
                      )}
                      <span className="arch__node-title">{node.title}</span>
                      <span className="arch__node-tech">{node.tech.join(', ')}</span>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        <div className="arch__detail" aria-live="polite">
          {flow && (
            <div className="arch__flow">
              <h4 className="lab-subheading">{flow.title}</h4>
              <ol className="arch__flow-steps">
                {flow.steps.map((step, i) => (
                  <li key={i}>
                    <button type="button" className="arch__flow-node" onClick={() => setSelectedId(step.node)}>
                      {titleOf(step.node)}
                    </button>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <article className="arch__card" aria-labelledby="arch-selected-title">
            <p className="lab-kicker">Component</p>
            <h4 id="arch-selected-title" className="arch__card-title">
              {selected.title}
            </h4>
            <p className="arch__summary">{selected.summary}</p>
            {selected.details.length > 0 && (
              <ul className="lab-list">
                {selected.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            <dl className="lab-facts">
              <div>
                <dt>Technology</dt>
                <dd>{selected.tech.join(', ')}</dd>
              </div>
              {selected.files.length > 0 && (
                <div>
                  <dt>Where</dt>
                  <dd>
                    {selected.files.map((f) => (
                      <code key={f} className="lab-code">
                        {f}
                      </code>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </article>
        </div>
      </div>

      <p className="lab-note">{architecture.note}</p>
    </div>
  );
}
