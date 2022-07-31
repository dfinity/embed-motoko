import { parseEmbedLink } from '../services/embedLinkService';
import makeObservable from '../utils/makeObservable';
import useObservableState from './utils/useObservableState';

export const INITIAL_CODE =
  `
// A simple Motoko smart contract.

actor Main {
  public func hello() : async Text {
    "Hello, world!"
  };
};

// await Main.hello();
`.trim() + '\n';

const initial = parseEmbedLink(window.location.pathname);

export const CODE_STORE = makeObservable(initial.code);

export default () => {
  return useObservableState(CODE_STORE);
};