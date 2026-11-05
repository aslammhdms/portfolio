import Terminal from './Terminal';

/** The terminal, as a compact band right after Work: the work comes first. */
export default function PromptBand() {
  return (
    <section id="prompt" className="prompt-band" aria-labelledby="prompt-title">
      <div className="shell prompt-grid">
        <div className="prompt-rail">
          <h2 id="prompt-title" className="mono-label">
            Prompt
          </h2>
          <p>Prefer a terminal? Everything on this page is also a command.</p>
        </div>
        <div className="prompt-terminal">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
