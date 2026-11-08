import { useEffect, useRef, useState } from 'react';
import { Controls } from './components/Controls';
import { SignPreview } from './components/SignPreview';
import { DEFAULT_CONFIG, decodeConfig, encodeConfig, type SignConfig } from './lib/config';
import { downloadBlob, renderPng } from './lib/exportPng';

const HASH_PREFIX = '#s=';

function configFromUrl(): SignConfig {
  return window.location.hash.startsWith(HASH_PREFIX)
    ? decodeConfig(window.location.hash.slice(HASH_PREFIX.length))
    : DEFAULT_CONFIG;
}

type Notice = { kind: 'ok' | 'error'; text: string } | null;

export default function App() {
  const [config, setConfig] = useState<SignConfig>(configFromUrl);
  const [notice, setNotice] = useState<Notice>(null);
  const [exporting, setExporting] = useState(false);
  const timer = useRef<number>(undefined);

  // Keep the design in the URL so the address bar is always a share link.
  useEffect(() => {
    window.history.replaceState(null, '', `${HASH_PREFIX}${encodeConfig(config)}`);
  }, [config]);

  const flash = (n: NonNullable<Notice>) => {
    setNotice(n);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(null), 2600);
  };

  const exportPng = async () => {
    setExporting(true);
    try {
      const blob = await renderPng(config);
      const name = `${(config.line1 + '-' + config.line2).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'sign'}.png`;
      downloadBlob(blob, name);
      flash({ kind: 'ok', text: `Saved ${name}` });
    } catch {
      flash({ kind: 'error', text: 'Could not create the PNG' });
    } finally {
      setExporting(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash({ kind: 'ok', text: 'Link copied' });
    } catch {
      flash({ kind: 'error', text: 'Copy failed — copy the address bar instead' });
    }
  };

  return (
    <main className="app">
      <header className="hero">
        <h1>WallSign Studio</h1>
        <p>Design a 3D metallic wall sign: pick fonts, metals and depth, then download it as a PNG or share the link.</p>
      </header>

      <div className="layout">
        <section className="stage" aria-label="Preview">
          <SignPreview config={config} />
          <div className="actions">
            <button type="button" className="primary" onClick={exportPng} disabled={exporting}>
              {exporting ? 'Rendering…' : 'Download PNG'}
            </button>
            <button type="button" onClick={copyLink}>Copy share link</button>
            <button type="button" onClick={() => setConfig(DEFAULT_CONFIG)}>Reset</button>
            <span className={`notice${notice ? ` notice--${notice.kind}` : ''}`} role="status" aria-live="polite">
              {notice?.text}
            </span>
          </div>
        </section>

        <aside className="panel">
          <Controls config={config} onChange={setConfig} />
        </aside>
      </div>

      <footer>Pure CSS gradients, clipped to the letters, plus layered drop-shadows. No images.</footer>
    </main>
  );
}
