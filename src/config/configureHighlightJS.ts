import { configure } from 'motoko/contrib/hljs';

export default function configureHighlightJS(hljs: any) {
  configure(hljs);
  hljs.configure({
    ignoreUnescapedHTML: true,
    languages: ['motoko', 'candid'],
  });
}
