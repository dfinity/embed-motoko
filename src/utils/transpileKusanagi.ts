import './ensureNodeGlobal';
import { parse } from 'kusanagi';

const generate = (node) => {
  const gen = (item) => generate(item);
  if (typeof node === 'string') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(gen).join('');
  }
  if (node === undefined || node === null) {
    return '';
  }
  if (node.$loc) {
    return generate(node.token);
  }
  console.log('Unknown Kusanagi output:', node);
  return `<UNKNOWN ${JSON.stringify(node)} >`;
};

export default function transpileKusanagi(input: string): string {
  const node = parse(input);
  return generate(node);
}
