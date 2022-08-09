window.global = window;
const { parse } = await import('kusanagi');

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
  return `<UNKNOWN ${JSON.stringify(node)} >`;
};

export default function transpileKusanagi(input) {
  const node = parse(input);
  return generate(node);
}
