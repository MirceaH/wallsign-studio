import {
  FONTS,
  FONT_IDS,
  MAX_TEXT,
  PRESETS,
  WALLS,
  WALL_IDS,
  applyPreset,
  type Align,
  type FontId,
  type SignConfig,
  type WallId,
} from '../lib/config';
import { MATERIALS, MATERIAL_IDS, cssGradient, type MaterialId } from '../lib/materials';

interface ControlsProps {
  config: SignConfig;
  onChange: (next: SignConfig) => void;
}

function MaterialPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MaterialId;
  onChange: (id: MaterialId) => void;
}) {
  return (
    <div className="field" role="group" aria-label={label}>
      <span className="field__label">
        {label} · <strong>{MATERIALS[value].label}</strong>
      </span>
      <div className="swatches">
        {MATERIAL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className="swatch"
            style={{ background: cssGradient(MATERIALS[id].stops, 160) }}
            aria-label={MATERIALS[id].label}
            aria-pressed={id === value}
            title={MATERIALS[id].label}
            onClick={() => onChange(id)}
          />
        ))}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="field">
      <span className="field__label">
        {label} · <strong>{value}{suffix}</strong>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Controls({ config, onChange }: ControlsProps) {
  const set = <K extends keyof SignConfig>(key: K, value: SignConfig[K]) => onChange({ ...config, [key]: value });

  return (
    <div className="controls">
      <section aria-labelledby="h-presets">
        <h2 id="h-presets">Presets</h2>
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="chip" onClick={() => onChange(applyPreset(p))}>
              {p.name}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="h-text">
        <h2 id="h-text">Text</h2>
        <label className="field">
          <span className="field__label">Line 1 (big)</span>
          <input type="text" value={config.line1} maxLength={MAX_TEXT} onChange={(e) => set('line1', e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Line 2</span>
          <input type="text" value={config.line2} maxLength={MAX_TEXT} onChange={(e) => set('line2', e.target.value)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={config.uppercase2} onChange={(e) => set('uppercase2', e.target.checked)} />
          Uppercase line 2
        </label>
        <div className="field" role="group" aria-label="Alignment">
          <span className="field__label">Alignment</span>
          <div className="segmented">
            {(['left', 'center', 'right'] as Align[]).map((a) => (
              <button key={a} type="button" aria-pressed={config.align === a} onClick={() => set('align', a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="h-style">
        <h2 id="h-style">Letters</h2>
        <div className="two-col">
          <label className="field">
            <span className="field__label">Line 1 font</span>
            <select value={config.font1} onChange={(e) => set('font1', e.target.value as FontId)}>
              {FONT_IDS.map((id) => (
                <option key={id} value={id}>{FONTS[id].label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Line 2 font</span>
            <select value={config.font2} onChange={(e) => set('font2', e.target.value as FontId)}>
              {FONT_IDS.map((id) => (
                <option key={id} value={id}>{FONTS[id].label}</option>
              ))}
            </select>
          </label>
        </div>
        <MaterialPicker label="Line 1 material" value={config.mat1} onChange={(v) => set('mat1', v)} />
        <MaterialPicker label="Line 2 material" value={config.mat2} onChange={(v) => set('mat2', v)} />
        <Slider label="Line 1 size" value={config.size1} min={50} max={160} suffix="%" onChange={(v) => set('size1', v)} />
        <Slider label="Line 2 size" value={config.size2} min={50} max={160} suffix="%" onChange={(v) => set('size2', v)} />
        <Slider label="Line 2 letter spacing" value={config.spacing} min={0} max={120} onChange={(v) => set('spacing', v)} />
        <Slider label="Shadow depth" value={config.depth} min={0} max={100} onChange={(v) => set('depth', v)} />
      </section>

      <section aria-labelledby="h-wall">
        <h2 id="h-wall">Wall</h2>
        <label className="field">
          <span className="field__label">Background</span>
          <select value={config.wall} onChange={(e) => set('wall', e.target.value as WallId)}>
            {WALL_IDS.map((id) => (
              <option key={id} value={id}>{WALLS[id].label}</option>
            ))}
          </select>
        </label>
      </section>
    </div>
  );
}
