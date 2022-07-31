import { INITIAL_CODE } from './../hooks/useCodeState';
import pako from 'pako';

const EMBED_LINK_BASE = window.location.origin;

const GZIP_FORMAT = 'g'; // TODO: refactor

export interface EmbedData {
  language: string;
  code: string;
}

export function parseEmbedLink(path: string): EmbedData {
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  const parts = path.split('/');
  const [language = 'motoko', payload = ''] = parts;
  if (!payload) {
    // return { language, code: INITIAL_CODE_MAP.get(language) || '' };
    return { language: 'motoko', code: INITIAL_CODE };
  }
  if (payload.startsWith(GZIP_FORMAT)) {
    let code: string;
    try {
      code = pako.inflate(
        new Uint8Array(
          atob(payload.substring(GZIP_FORMAT.length))
            .split('')
            .map((c) => c.charCodeAt(0)),
        ),
        {
          to: 'string',
        },
      );
    } catch (err) {
      console.error(err);
      //   if (language === 'motoko') {
      code = '// Unable to parse embed link';
      //   }
    }
    return { language, code };
  }
  return {
    language,
    code: '// Unknown embed link format',
  };
}

export function getEmbedLink({ language, code }: EmbedData): string {
  const format = GZIP_FORMAT;
  const payload = btoa(String.fromCharCode.apply(null, pako.deflate(code)));
  return `${EMBED_LINK_BASE}/${language}/${format}${payload}`;
}
