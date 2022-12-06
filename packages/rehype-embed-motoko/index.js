const { visit } = require('unist-util-visit');

module.exports = (options = {}) => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!node.properties.className?.includes('language-motoko')) {
        return;
      }

      console.log('NODE:', node);

      // let { lang, data } = node;

      // if (!lang || lang === motokoLang) {
      //   return;
      // }

      // if (!data) {
      //   data = {};
      //   node.data = data;
      // }
      // console.log('NODE:', node); /////
      // console.log('DATA:', data); /////
      // // const props = data.hProperties || (data.hProperties = {});

      // // data.hChildren = lowlight.highlight(lang, node.value, {
      // //   prefix,
      // // }).children;

      // // props.className = [
      // //   'hljs',
      // //   ...(Array.isArray(props.className) ? props.className : []),
      // //   'language-' + lang,
      // // ];
    });
  };
};

exports.default = exports;
