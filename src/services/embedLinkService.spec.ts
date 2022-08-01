import { describe, expect, it } from 'vitest';
import { parseEmbedLink, getEmbedLink } from './embedLinkService';
import initialCode from '../config/initialCode';

describe('embedLinkService', () => {
  it('parses a link', () => {
    expect(parseEmbedLink('/motoko/g/Ftqc6mAnLA8fhVT6knkjrY')).toStrictEqual({
      language: 'motoko',
      code: '// TEST\n',
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
  it('generates a link', () => {
    expect(
      getEmbedLink({
        language: 'motoko',
        code: '// TEST',
      }),
    ).toBe('http://localhost:3000/motoko/g/Ftqc6mAnLA8fhVT6knkjrY');
  });
});
