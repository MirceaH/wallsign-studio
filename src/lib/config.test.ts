import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CONFIG,
  MAX_TEXT,
  PRESETS,
  applyPreset,
  decodeConfig,
  encodeConfig,
  isPunctuation,
  sanitize,
} from './config';
import { MATERIALS, cssGradient } from './materials';

describe('share-link encoding', () => {
  it('round-trips every preset', () => {
    for (const preset of PRESETS) {
      const config = applyPreset(preset);
      expect(decodeConfig(encodeConfig(config))).toEqual(config);
    }
  });

  it('round-trips non-ASCII text', () => {
    const config = { ...DEFAULT_CONFIG, line1: 'Ștefan', line2: 'Vaslui ✓' };
    expect(decodeConfig(encodeConfig(config))).toEqual(config);
  });

  it('produces URL-safe output', () => {
    expect(encodeConfig({ ...DEFAULT_CONFIG, line2: '???>>>' })).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('falls back to the default on garbage', () => {
    expect(decodeConfig('not base64 at all!!')).toEqual(DEFAULT_CONFIG);
    expect(decodeConfig('')).toEqual(DEFAULT_CONFIG);
  });
});

describe('sanitize', () => {
  it('keeps valid values', () => {
    expect(sanitize({ ...DEFAULT_CONFIG, mat1: 'copper', align: 'left' })).toMatchObject({
      mat1: 'copper',
      align: 'left',
    });
  });

  it('replaces unknown ids and clamps numbers', () => {
    const result = sanitize({ font1: 'comic-sans', mat1: 'rainbow', wall: 5, size1: 9999, depth: -4, spacing: 'x' });
    expect(result.font1).toBe(DEFAULT_CONFIG.font1);
    expect(result.mat1).toBe(DEFAULT_CONFIG.mat1);
    expect(result.wall).toBe(DEFAULT_CONFIG.wall);
    expect(result.size1).toBe(160);
    expect(result.depth).toBe(0);
    expect(result.spacing).toBe(DEFAULT_CONFIG.spacing);
  });

  it('limits text length', () => {
    expect(sanitize({ line1: 'x'.repeat(500) }).line1).toHaveLength(MAX_TEXT);
  });

  it('survives non-object input', () => {
    expect(sanitize(null)).toEqual(DEFAULT_CONFIG);
    expect(sanitize('hello')).toEqual(DEFAULT_CONFIG);
  });
});

describe('helpers', () => {
  it('treats dots and dashes as punctuation but not letters or digits', () => {
    expect(isPunctuation('.')).toBe(true);
    expect(isPunctuation('-')).toBe(true);
    expect(isPunctuation('D')).toBe(false);
    expect(isPunctuation('7')).toBe(false);
    expect(isPunctuation('Ș')).toBe(false);
  });

  it('builds a CSS gradient from material stops', () => {
    expect(cssGradient([[0, '#fff'], [100, '#000']], 90)).toBe('linear-gradient(90deg, #fff 0%, #000 100%)');
  });

  it('has stops sorted from 0 to 100 for every material', () => {
    for (const material of Object.values(MATERIALS)) {
      const offsets = material.stops.map(([at]) => at);
      expect(offsets[0]).toBe(0);
      expect(offsets.at(-1)).toBe(100);
      expect([...offsets].sort((a, b) => a - b)).toEqual(offsets);
    }
  });
});
