const TAB = '  ';
const LINE_COMMENT = '//';
const ANNOTATION = '@';

// const prelude =
//   `
// import {debugPrint = print} "mo:⛔";
// ();
// `.trim() + '\n';

export interface Attribute {
  key: string;
  value: string | undefined;
}

export interface PreprocessResult {
  code: string;
  attributes: Attribute[];
}

export default function preprocessMotoko(code): PreprocessResult {
  code = code.replace(/\t/g, TAB);

  // code = `${prelude}${code}`;

  const attributes: Attribute[] = [];

  // infer semicolons

  let nextIndent = 0;
  const reversedLines = code.split('\n').reverse();
  code = reversedLines
    .map((line: string, i: number) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        return line;
      }
      if (trimmedLine.startsWith(LINE_COMMENT)) {
        const comment = trimmedLine.substring(LINE_COMMENT.length).trim();
        if (comment.startsWith(ANNOTATION)) {
          const [key, ...valueParts] = comment
            .substring(ANNOTATION.length)
            .trim()
            .split(' ')
            .map((s) => s.trim());
          if (key) {
            attributes.push({
              key,
              value: valueParts.join(' ').trim() || undefined,
            });
          }
        }
        return line;
      }

      let indent = 0;
      while (indent < line.length && line.charAt(indent) === ' ') {
        indent++;
      }

      const nextTrimmedLine = (reversedLines[i - 1] || '').trim();
      // const previousTrimmedLine = (lines[i + 1] || '').trim();

      if (
        indent === nextIndent &&
        !(
          trimmedLine.endsWith(';') ||
          trimmedLine.endsWith(',') ||
          trimmedLine.endsWith('{') ||
          trimmedLine.endsWith('(') ||
          trimmedLine.endsWith('[') ||
          ((trimmedLine.startsWith('/*') || !trimmedLine.includes('/*')) &&
            trimmedLine.endsWith('*/')) ||
          /^(else|catch)([^a-zA-Z0-9_]|$)/.test(nextTrimmedLine)
        )
      ) {
        line += ';';
      }

      nextIndent = indent;
      return line;
    })
    .reverse()
    .join('\n');

  return {
    code,
    attributes,
  };
}
