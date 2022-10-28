import './ensureNodeGlobal';
import { parse, generate } from 'kusanagi';

export default function transpileKusanagi(input: string): string {
  const node = parse(input);
  return generate(node);
}
