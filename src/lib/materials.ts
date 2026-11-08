export type MaterialId =
  | 'gold'
  | 'silver'
  | 'chrome'
  | 'copper'
  | 'red'
  | 'neon'
  | 'ice'
  | 'graphite'
  | 'yellow'
  | 'military'
  | 'violet';

export interface Material {
  label: string;
  /** Gradient stops from top to bottom: [offset 0–100, colour]. */
  stops: readonly (readonly [number, string])[];
  /** Soft halo colour drawn behind the letters. */
  glow: string;
}

/** Metallic looks. Multi-stop gradients with a bright band in the middle fake a reflection. */
export const MATERIALS: Record<MaterialId, Material> = {
  gold: {
    label: 'Gold',
    stops: [[0, '#f7e8a0'], [18, '#d4a843'], [30, '#c49632'], [45, '#e8c95a'], [50, '#f5e291'], [55, '#d9b44a'], [70, '#b8912a'], [82, '#c9a03e'], [100, '#e2c460']],
    glow: 'rgba(200,164,78,0.15)',
  },
  silver: {
    label: 'Silver',
    stops: [[0, '#ffffff'], [15, '#e8e8e8'], [35, '#b0b0b0'], [48, '#d8d8d8'], [52, '#f0f0f0'], [65, '#c0c0c0'], [80, '#a0a0a0'], [95, '#d0d0d0'], [100, '#e8e8e8']],
    glow: 'rgba(180,180,180,0.08)',
  },
  chrome: {
    label: 'Chrome',
    stops: [[0, '#ffffff'], [20, '#cccccc'], [40, '#888888'], [50, '#dddddd'], [55, '#ffffff'], [70, '#aaaaaa'], [85, '#999999'], [100, '#cccccc']],
    glow: 'rgba(200,200,255,0.1)',
  },
  copper: {
    label: 'Copper',
    stops: [[0, '#e8b88a'], [20, '#c47a40'], [38, '#a05520'], [48, '#d49560'], [53, '#ecc8a0'], [65, '#c07838'], [80, '#8a4010'], [100, '#b86830']],
    glow: 'rgba(200,120,56,0.12)',
  },
  red: {
    label: 'Red',
    stops: [[0, '#ff4444'], [25, '#cc0000'], [45, '#ff2222'], [52, '#ff6666'], [65, '#cc0000'], [80, '#990000'], [100, '#cc2222']],
    glow: 'rgba(255,0,0,0.15)',
  },
  neon: {
    label: 'Neon blue',
    stops: [[0, '#00d4ff'], [40, '#0088cc'], [60, '#00aaee'], [100, '#66e0ff']],
    glow: 'rgba(0,180,255,0.4)',
  },
  ice: {
    label: 'Ice',
    stops: [[0, '#ffffff'], [50, '#88aacc'], [100, '#556688']],
    glow: 'rgba(136,170,204,0.1)',
  },
  graphite: {
    label: 'Graphite',
    stops: [[0, '#2a2a2a'], [30, '#444444'], [50, '#222222'], [70, '#3a3a3a'], [100, '#1a1a1a']],
    glow: 'rgba(0,0,0,0)',
  },
  yellow: {
    label: 'Sport yellow',
    stops: [[0, '#ffe866'], [18, '#ffcc00'], [35, '#e6a800'], [48, '#ffd633'], [53, '#ffee88'], [65, '#e6b800'], [80, '#cc9900'], [100, '#e6b800']],
    glow: 'rgba(255,200,0,0.1)',
  },
  military: {
    label: 'Army green',
    stops: [[0, '#b8c46a'], [25, '#8a9a30'], [45, '#a4b44e'], [52, '#d0dd80'], [65, '#8a9a30'], [85, '#6a7820'], [100, '#98a840']],
    glow: 'rgba(138,154,48,0.1)',
  },
  violet: {
    label: 'Violet',
    stops: [[0, '#e0d0ff'], [22, '#a080dd'], [40, '#8060bb'], [50, '#c0a8f0'], [54, '#e0d0ff'], [68, '#9070cc'], [82, '#7050aa'], [100, '#a888dd']],
    glow: 'rgba(140,100,220,0.15)',
  },
};

export const MATERIAL_IDS = Object.keys(MATERIALS) as MaterialId[];

/** CSS value for `background`, e.g. `linear-gradient(172deg, #fff 0%, …)`. */
export function cssGradient(stops: Material['stops'], angle = 172): string {
  return `linear-gradient(${angle}deg, ${stops.map(([at, color]) => `${color} ${at}%`).join(', ')})`;
}
