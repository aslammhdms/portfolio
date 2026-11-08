import { lazy, Suspense, useEffect, useState } from 'react';
import { arm, openDrawer, submit, useTerm } from '../terminal/store';

const TerminalBody = lazy(() => import('../terminal/TerminalBody'));

const SUGGESTIONS = ['help', 'work', 'now', 'resume', 'sudo hire-me'];

/**
 * The Prompt band after Work: a static frame with the height reserved, so nothing
 * shifts. The interactive terminal is a separate chunk, fetched when the band nears
 * the viewport (or a shortcut or a button is used). The chips and Expand work before
 * it arrives: they load it and run.
 */
export default function PromptBand() {
  const term = useTerm();
  const [band, setBand] = useState<HTMLElement | null>(null);

  // Fetch the terminal a screen before the band comes into view.
  useEffect(() => {
    if (!band || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          arm();
          observer.disconnect();
        }
      },
      { rootMargin: '700px 0px' }
    );
    observer.observe(band);
    return () => observer.disconnect();
  }, [band]);

  return (
    <section id="prompt" ref={setBand} className="prompt-band" aria-labelledby="prompt-title">
      <div className="shell prompt-grid">
        <div className="prompt-rail">
          <h2 id="prompt-title" className="mono-label">
            Prompt
          </h2>
          <p>Prefer a terminal? Everything on this page is also a command.</p>
        </div>

        <div className="prompt-terminal">
          <div className="term term-band" data-skin={term.skin} role="group" aria-label="Interactive terminal. Type help for commands.">
            <div className="term-head">
              <span>{term.skin === 'v1' ? 'HEAD detached at a46821c' : 'aslam@auh ~'}</span>
              <span className="term-head-right">
                <span className="term-hint">
                  help · <kbd className="keycap-inline" data-keycap="terminal">Ctrl `</kbd> opens it anywhere
                </span>
                <button type="button" className="term-btn" onClick={openDrawer} aria-controls={term.drawerMounted ? 'term-drawer' : undefined} aria-label="Expand the terminal into a drawer">
                  Expand
                </button>
              </span>
            </div>

            {term.armed ? (
              <Suspense fallback={<StaticBody />}>
                <TerminalBody placement="band" introTarget={band} />
              </Suspense>
            ) : (
              <StaticBody />
            )}

            <div className="term-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="term-chip" onClick={() => void submit(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The prerendered frame: an empty log and a prompt, the same size as the live one. */
function StaticBody() {
  return (
    <div className="t-body">
      <div className="t-log" aria-hidden="true">
        <p className="t-line t-cmd">
          <span className="t-prompt">$ </span>
          <span className="t-caret t-caret-idle" />
        </p>
      </div>
    </div>
  );
}
