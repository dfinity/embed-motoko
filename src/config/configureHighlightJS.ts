import defineMotoko from 'highlightjs-motoko';

export default function configureHighlightJS(hljs: any) {
  defineMotoko(hljs);
  hljs.configure({
    languages: ['motoko', 'candid'],
  });
}
