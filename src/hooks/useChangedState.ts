import { CODE_STORE } from './useCodeState copy';
import { parseEmbedLink } from '../services/embedLinkService';
import makeObservable from '../utils/makeObservable';
import useObservableState from './utils/useObservableState';

export const CHANGED_STORE = makeObservable(false);

CODE_STORE.addListener(() => CHANGED_STORE.set(true));

export default () => {
  return useObservableState(CHANGED_STORE);
};
