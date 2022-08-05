import { configure } from 'motoko/contrib/hljs';

export default function configureHighlightJS(hljs) {
  configure(hljs);
  hljs.configure({
    ignoreUnescapedHTML: true,
    languages: ['motoko', 'candid'],
  });
}
