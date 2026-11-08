import { MATERIAL_IDS, type MaterialId } from './materials';

export type FontId =
  | 'montserrat'
  | 'bebas'
  | 'orbitron'
  | 'rajdhani'
  | 'blackops'
  | 'chakra'
  | 'bungee'
  | 'stencil'
  | 'russo';

export interface FontOption {
  label: string;
  family: string;
  weight: number;
}

export const FONTS: Record<FontId, FontOption> = {
  montserrat: { label: 'Montserrat Black', family: 'Montserrat', weight: 900 },
  bebas: { label: 'Bebas Neue', family: 'Bebas Neue', weight: 400 },
  orbitron: { label: 'Orbitron', family: 'Orbitron', weight: 900 },
  rajdhani: { label: 'Rajdhani', family: 'Rajdhani', weight: 700 },
  blackops: { label: 'Black Ops One', family: 'Black Ops One', weight: 400 },
  chakra: { label: 'Chakra Petch', family: 'Chakra Petch', weight: 700 },
  bungee: { label: 'Bungee', family: 'Bungee', weight: 400 },
  stencil: { label: 'Saira Stencil One', family: 'Saira Stencil One', weight: 400 },
  russo: { label: 'Russo One', family: 'Russo One', weight: 400 },
};
export const FONT_IDS = Object.keys(FONTS) as FontId[];

export type WallId = 'concrete' | 'charcoal' | 'midnight' | 'black';

export interface Wall {
  label: string;
  /** CSS background for the live preview. */
  css: string;
  /** Two colours used for the exported PNG (top-left → bottom-right). */
  canvas: readonly [string, string];
}

export const WALLS: Record<WallId, Wall> = {
  concrete: {
    label: 'Concrete',
    css: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 30%, #333 60%, #2e2e2e 100%)',
    canvas: ['#3a3a3a', '#2e2e2e'],
  },
  charcoal: {
    label: 'Charcoal',
    css: 'linear-gradient(135deg, #2c2c2c 0%, #3a3a3a 30%, #2e2e2e 60%, #333 100%)',
    canvas: ['#2c2c2c', '#333333'],
  },
  midnight: {
    label: 'Midnight blue',
    css: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
    canvas: ['#0d1117', '#0d1117'],
  },
  black: {
    label: 'Black',
    css: 'linear-gradient(135deg, #1a1a1a 0%, #111 50%, #1a1a1a 100%)',
    canvas: ['#1a1a1a', '#1a1a1a'],
  },
};
export const WALL_IDS = Object.keys(WALLS) as WallId[];

export type Align = 'left' | 'center' | 'right';
const ALIGNS: readonly Align[] = ['left', 'center', 'right'];

export interface SignConfig {
  line1: string;
  line2: string;
  font1: FontId;
  font2: FontId;
  mat1: MaterialId;
  mat2: MaterialId;
  wall: WallId;
  align: Align;
  /** Percent of the default size. */
  size1: number;
  size2: number;
  /** Extra letter spacing for line 2, in 1/100 em. */
  spacing: number;
  /** Shadow depth, 0–100. */
  depth: number;
  uppercase2: boolean;
}

export const MAX_TEXT = 24;

export const DEFAULT_CONFIG: SignConfig = {
  line1: 'D.T.H',
  line2: 'Autoservice',
  font1: 'montserrat',
  font2: 'montserrat',
  mat1: 'gold',
  mat2: 'silver',
  wall: 'concrete',
  align: 'center',
  size1: 100,
  size2: 100,
  spacing: 30,
  depth: 50,
  uppercase2: true,
};

export interface Preset {
  name: string;
  config: Partial<SignConfig>;
}

export const PRESETS: Preset[] = [
  { name: 'Gold & Silver', config: {} },
  { name: 'Classic Gold', config: { font1: 'bebas', font2: 'bebas', mat1: 'gold', mat2: 'silver', wall: 'charcoal', size1: 108, spacing: 40 } },
  { name: 'Futuristic', config: { font1: 'orbitron', font2: 'rajdhani', mat1: 'neon', mat2: 'ice', wall: 'midnight', size1: 92, spacing: 55 } },
  { name: 'Red & Black', config: { font1: 'montserrat', font2: 'montserrat', mat1: 'red', mat2: 'silver', wall: 'black' } },
  { name: 'Copper', config: { font1: 'montserrat', font2: 'montserrat', mat1: 'copper', mat2: 'silver', wall: 'charcoal' } },
  { name: 'Sport Garage', config: { font1: 'russo', font2: 'russo', mat1: 'yellow', mat2: 'silver', wall: 'charcoal', spacing: 35 } },
  { name: 'Military', config: { font1: 'blackops', font2: 'chakra', mat1: 'military', mat2: 'silver', wall: 'black', size1: 88, spacing: 35 } },
];

export function applyPreset(preset: Preset): SignConfig {
  return { ...DEFAULT_CONFIG, ...preset.config };
}

const clamp = (n: unknown, min: number, max: number, fallback: number): number =>
  typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

const text = (value: unknown, fallback: string): string =>
  typeof value === 'string' ? value.slice(0, MAX_TEXT) : fallback;

/** Turn untrusted input (URL hash, JSON) into a valid config, falling back per field. */
export function sanitize(input: unknown): SignConfig {
  const o = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const d = DEFAULT_CONFIG;
  return {
    line1: text(o.line1, d.line1),
    line2: text(o.line2, d.line2),
    font1: pick(o.font1, FONT_IDS, d.font1),
    font2: pick(o.font2, FONT_IDS, d.font2),
    mat1: pick(o.mat1, MATERIAL_IDS, d.mat1),
    mat2: pick(o.mat2, MATERIAL_IDS, d.mat2),
    wall: pick(o.wall, WALL_IDS, d.wall),
    align: pick(o.align, ALIGNS, d.align),
    size1: clamp(o.size1, 50, 160, d.size1),
    size2: clamp(o.size2, 50, 160, d.size2),
    spacing: clamp(o.spacing, 0, 120, d.spacing),
    depth: clamp(o.depth, 0, 100, d.depth),
    uppercase2: typeof o.uppercase2 === 'boolean' ? o.uppercase2 : d.uppercase2,
  };
}

/** Compact, URL-safe encoding for share links. */
export function encodeConfig(config: SignConfig): string {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeConfig(encoded: string): SignConfig {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return sanitize(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Characters like "." or "-" are drawn smaller and centred, like the dots in "D.T.H". */
export function isPunctuation(char: string): boolean {
  return !/[\p{L}\p{N}]/u.test(char);
}
