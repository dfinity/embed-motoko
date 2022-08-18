import makeObservable from '../utils/makeObservable';
import { CODE_STORE } from './useCodeInfoState';
import useObservableState from './utils/useObservableState';

export const CHANGED_STORE = makeObservable(false);

CODE_STORE.subscribe(() => CHANGED_STORE.set(true));

export default function useChangedState() {
  return useObservableState(CHANGED_STORE);
}
