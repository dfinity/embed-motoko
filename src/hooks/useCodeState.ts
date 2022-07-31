import { parseEmbedLink } from '../services/embedLinkService';
import makeObservable from '../utils/makeObservable';
import useObservableState from './utils/useObservableState';

const initial = parseEmbedLink(window.location.pathname);

export const CODE_STORE = makeObservable(initial.code);

export default function useCodeState() {
  return useObservableState(CODE_STORE);
}
