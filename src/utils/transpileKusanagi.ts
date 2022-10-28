import './ensureNodeGlobal';
import { compile } from 'kusanagi';

export default function transpileKusanagi(input: string): string {
  return compile(input);
}
