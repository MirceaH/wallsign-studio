import type { CSSProperties } from 'react';
import { FONTS, WALLS, isPunctuation, type SignConfig } from '../lib/config';
import { LINE1_CQW, LINE2_CQW, PADDING_CQW, PUNCT_SCALE } from '../lib/layout';
import { MATERIALS, cssGradient, type MaterialId } from '../lib/materials';

/** Three stacked drop-shadows give the letters depth, plus a soft halo in the material's colour. */
function shadowFilter(material: MaterialId, depth: number): string {
  const k = depth / 50;
  const n = (v: number) => (v * k).toFixed(3);
  return [
    `drop-shadow(${n(0.15)}cqw ${n(0.25)}cqw ${n(0.1)}cqw rgba(0,0,0,0.75))`,
    `drop-shadow(${n(0.4)}cqw ${n(0.6)}cqw ${n(0.5)}cqw rgba(0,0,0,0.4))`,
    `drop-shadow(0 0 1.6cqw ${MATERIALS[material].glow})`,
  ].join(' ');
}

function metalStyle(material: MaterialId, depth: number): CSSProperties {
  return {
    // backgroundImage, not the `background` shorthand: React would reset background-clip when only the gradient changes
    backgroundImage: cssGradient(MATERIALS[material].stops),
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    filter: shadowFilter(material, depth),
  };
}

const ALIGN_ITEMS = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

export function SignPreview({ config }: { config: SignConfig }) {
  const wall = WALLS[config.wall];
  const f1 = FONTS[config.font1];
  const f2 = FONTS[config.font2];
  const label = `${config.line1} ${config.line2}`.trim();
  const size1 = (LINE1_CQW * config.size1) / 100;
  const size2 = (LINE2_CQW * config.size2) / 100;
  const spacing = config.spacing / 100;

  return (
    <div className="wall" style={{ background: wall.css }} role="img" aria-label={`Preview of the sign: ${label}`}>
      <div className="wall__texture" aria-hidden="true" />
      <div
        className="sign"
        aria-hidden="true"
        style={{ alignItems: ALIGN_ITEMS[config.align], padding: `0 ${PADDING_CQW}cqw` }}
      >
        <div
          className="line1"
          style={{ fontFamily: `"${f1.family}", sans-serif`, fontWeight: f1.weight, fontSize: `${size1}cqw` }}
        >
          {[...config.line1].map((char, i) => {
            const punct = isPunctuation(char);
            return (
              <span
                key={i}
                className={punct ? 'char char--punct' : 'char'}
                style={{
                  ...metalStyle(config.mat1, config.depth),
                  ...(punct ? { fontSize: `${PUNCT_SCALE}em` } : null),
                }}
              >
                {char === ' ' ? ' ' : char}
              </span>
            );
          })}
        </div>
        <div
          className="line2"
          style={{
            ...metalStyle(config.mat2, config.depth),
            fontFamily: `"${f2.family}", sans-serif`,
            fontWeight: f2.weight,
            fontSize: `${size2}cqw`,
            letterSpacing: `${spacing}em`,
            textTransform: config.uppercase2 ? 'uppercase' : 'none',
            // letter-spacing also adds a gap after the last letter; pull it back so the edge lines up
            marginRight: config.align === 'right' ? `${-spacing}em` : undefined,
          }}
        >
          {config.line2}
        </div>
      </div>
    </div>
  );
}
