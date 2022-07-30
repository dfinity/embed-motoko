import theme from 'monaco-themes/themes/GitHub.json';
import { configure } from 'motoko/contrib/monaco';

export const configureMonaco = (monaco) => {
  monaco.editor.defineTheme('custom-theme', theme);
  configure(monaco);
};
