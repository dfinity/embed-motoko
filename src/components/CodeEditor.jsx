import MonacoEditor from '@monaco-editor/react';
import React from 'react';
import { configureMonaco } from '../config/configureMonaco';
import { isMobile } from 'react-device-detect';

export const EDITOR_FONT_SIZE = isMobile ? 14 : 16;

// export interface CodeEditorProps {
//   /*  extends EditorProps */
//   value: string;
//   onChange: (value: string) => void;
//   readOnly: boolean;
//   options: any;
// }

export default function CodeEditor({
  value,
  onChange,
  readOnly,
  options,
  ...others
}) {
  return (
    <MonacoEditor
      theme="motoko-theme"
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
        fontSize: EDITOR_FONT_SIZE,
        readOnly: readOnly || isMobile,
        ...options,
      }}
      {...others}
    />
  );
}
