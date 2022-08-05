import React from 'react';
import Editor from './utils/Editor';
import hljs from 'highlight.js/lib/core';
// import 'highlight.js/styles/github.css';
import configureHighlightJS from '../config/configureHighlightJS';
import isMobile from '../utils/isMobile';

configureHighlightJS(hljs);

export const EDITOR_FONT_SIZE = isMobile() ? 14 : 16;

const hightlightWithLineNumbers = (input, language) => {
  return hljs
    .highlight(input, { language })
    .value.split('\n')
    .map((line, i) => `<span class='line-number'>${i + 1}</span>${line}`)
    .join('\n');
};

export default function CodeEditor({
  value,
  onChange,
  readOnly,
  options,
  style,
  ...others
}) {
  const editorRef = (ref) => {
    if (!ref) {
      return;
    }
    const el = ref._input;
    el.style.width = `${el.parentElement.scrollWidth}px`;
  };

  return (
    <Editor
      ref={editorRef}
      placeholder="Write some Motoko..."
      value={value}
      onValueChange={(value) => onChange?.(value)}
      highlight={(code) => hightlightWithLineNumbers(code, 'motoko')}
      padding={10}
      textareaClassName="code-area"
      className="code-editor font-mono bg-white"
      style={{
        fontSize: EDITOR_FONT_SIZE,
        minHeight: '100%',
        minWidth: '100%',
        ...style,
      }}
      {...others}
    />
  );
}
