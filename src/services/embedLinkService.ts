import pako from 'pako';
import bs58 from 'bs58';
import initialCode from '../config/initialCode';

const EMBED_LINK_BASE = window.location.origin;

const GZIP_FORMAT = 'g'; // TODO: refactor

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
  const [language = 'motoko', format = '', payload = ''] = path.split('/');
  if (!format) {
    // return { language, code: initialCodeMap.get(language) || '' };
    return { language: 'motoko', code: preprocessCode(initialCode) };
  } else if (format === GZIP_FORMAT) {
    let code: string;
    try {
      const data = bs58.decode(payload);
      code = pako.inflate(data, { to: 'string' }) || '';
    } catch (err) {
      console.error(err);
      //   if (language === 'motoko') {
      code = '// Unable to parse embed link';
      //   }
    }
    return { language, code: preprocessCode(code) };
  }
  return {
    language,
    code: preprocessCode('// Unknown embed link format'),
  };
}

export function getEmbedLink({ language, code }: EmbedData): string {
  const format = GZIP_FORMAT;
  const payload = bs58.encode(pako.deflate(preprocessCode(code)));
  return `${EMBED_LINK_BASE}/${language}/${format}/${payload}`;
}
