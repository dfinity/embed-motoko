import { parseEmbedLink } from '../services/embedLinkService';
import makeObservable from '../utils/makeObservable';
import useObservableState from './utils/useObservableState';

const initial = parseEmbedLink(window.location.pathname);

export const CODE_STORE = makeObservable(initial);

window.addEventListener('popstate', () => {
  const next = parseEmbedLink(window.location.pathname);
  CODE_STORE.set(next);
});

export default function useCodeInfoState() {
  return useObservableState(CODE_STORE);
}
