import MonacoEditor from '@monaco-editor/react';
import { configureMonaco } from '../config/configureMonaco';

export default function CodeEditor({
  value,
  onChange,
  readOnly,
  options,
  ...others
}) {
  return (
    <MonacoEditor
      theme="custom-theme"
      defaultLanguage="motoko"
      beforeMount={configureMonaco}
      value={value}
      onChange={(newValue) => onChange?.(newValue)}
      options={{
        tabSize: 2,
        minimap: { enabled: false },
        wordWrap: 'off',
        // wrappingIndent: 'indent',
        scrollBeyondLastLine: false,
        fontSize: 16,
        readOnly,
        ...options,
      }}
      {...others}
    />
  );
}
