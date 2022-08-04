import pako from 'pako';
import bs58 from 'bs58';
import initialCode from '../config/initialCode';

const EMBED_LINK_BASE = window.location.origin;

interface Format {
  name: string;
  symbol: string;
  shouldClaim(string): boolean;
  encode(string): Uint8Array;
  decode(Uint8Array): string;
}

const formats: Format[] = [
  {
    name: 'text',
    symbol: 't',
    shouldClaim: () => false,
    encode: (text) => new TextEncoder().encode(text),
    decode: (data) => new TextDecoder().decode(data),
  },
  {
    name: 'gzip',
    symbol: 'g',
    shouldClaim: (text) => text.length > 20,
    encode: (text) => pako.deflate(text),
    decode: (data) => pako.inflate(data, { to: 'string' }),
  },
];

export interface EmbedData {
  language: string;
  code: string;
}

function preprocessCode(s: string) {
  s = s.trim();
  return s ? s + '\n' : s;
}

export function parseEmbedLink(path: string): EmbedData {
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  const [language = 'motoko', symbol = '', payload = ''] = path.split('/');
  if (!symbol) {
    // return { language, code: initialCodeMap.get(language) || '' };
    return { language: 'motoko', code: preprocessCode(initialCode) };
  } else if (!payload) {
    return { language: 'motoko', code: '' };
  } else {
    const format = formats.find((format) => format.symbol === symbol);
    if (format) {
      let code: string;
      try {
        const data = bs58.decode(payload);
        code = format.decode(data) || '';
      } catch (err) {
        console.error(err);
        //   if (language === 'motoko') {
        code = '// Unable to parse embed link';
        //   }
      }
      return { language, code: preprocessCode(code) };
    } else {
      return {
        language,
        code: preprocessCode('// Unknown embed link format'),
      };
    }
  }
}

export function getEmbedLink({ language, code }: EmbedData): string {
  code = preprocessCode(code);

  const format =
    formats.find((format) => format.shouldClaim(code)) || formats[0];
  const data = format.encode(code);
  const payload = bs58.encode(data);
  return `${EMBED_LINK_BASE}/${language}/${format.symbol}/${payload}`;
}
