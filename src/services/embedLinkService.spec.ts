import { describe, expect, it } from 'vitest';
import { parseEmbedLink, getEmbedLink } from './embedLinkService';
import initialCode from '../config/initialCode';

describe('embedLinkService', () => {
  it('parses a text link', () => {
    expect(parseEmbedLink('/motoko/t/8tkCLb2vFUV')).toStrictEqual({
      language: 'motoko',
      code: '// TEST\n',
    });
  });
  it('parses a gzip link', () => {
    expect(
      parseEmbedLink('/motoko/g/RAiRxx8net2ByM3QCJ9XXhrjaGZEn7Uv9JsTH1Ln7'),
    ).toStrictEqual({
      language: 'motoko',
      code: 'import Prim "mo:⛔";\n',
    });
  });
  it('parses an empty gzip payload', () => {
    expect(parseEmbedLink('motoko/g/')).toStrictEqual({
      language: 'motoko',
      code: '',
    });
  });
  it('parses an invalid link', () => {
    expect(parseEmbedLink('')).toStrictEqual({
      language: 'motoko',
      code: `${initialCode.trim()}\n`,
    });
  });
  it('generates a text link', () => {
    expect(
      getEmbedLink({
        language: 'motoko',
        code: '// TEST',
      }),
    ).toBe('http://localhost:3000/motoko/t/8tkCLb2vFUV?lines=2');
  });
  it('generates a gzip link', () => {
    expect(
      getEmbedLink({
        language: 'motoko',
        code: '// TEST\n'.repeat(20),
      }),
    ).toBe(
      'http://localhost:3000/motoko/g/P5gNeDqSDZ68NgTNboVTayQJXz?lines=21',
    );
  });
});
