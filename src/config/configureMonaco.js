import motokoTheme from 'monaco-themes/themes/GitHub.json';
import { configure } from 'motoko/contrib/monaco';

export const configureMonaco = (monaco) => {
  monaco.editor.defineTheme('motoko-theme', motokoTheme);
  configure(monaco);
};
