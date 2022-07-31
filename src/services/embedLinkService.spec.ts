import { parseEmbedLink, getEmbedLink } from './embedLinkService';
import { INITIAL_CODE } from './../hooks/useCodeState';

describe('embedLinkService', () => {
  it('parses a link', () => {
    expect(parseEmbedLink('/motoko/gFtqc6mAnLA8fhVT6knkjrY')).toBe({
      language: 'motoko',
      code: '// TEST\n',
    });
  });
  it('parses an empty payload', () => {
    expect(parseEmbedLink('motoko/g')).toBe({
      language: 'motoko',
      code: '',
    });
  });
  it('parses an invalid link', () => {
    expect(parseEmbedLink('')).toBe({
      language: 'motoko',
      code: `${INITIAL_CODE.trim()}\n`,
    });
  });
  it('generates a link', () => {
    expect(
      getEmbedLink({
        language: 'motoko',
        code: '// TEST',
      }),
    ).toBe('/motoko/gFtqc6mAnLA8fhVT6knkjrY');
  });
});
