const TAB = '  ';

export default function preprocessMotoko(code) {
  code = code.replace(/\t/g, TAB);

  const annotations = [];

  // infer semicolons

  let nextIndent = 0;
  code = code
    .split('\n')
    .reverse()
    .map((line: string) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        return line;
      }

      let indent = 0;
      while (indent < line.length && line.charAt(indent) === ' ') {
        indent++;
      }

      if (
        indent === nextIndent &&
        !trimmedLine.endsWith(';') &&
        !(trimmedLine.startsWith('/*') && trimmedLine.endsWith('*/'))
      ) {
        line += ';';
      }

      nextIndent = indent;
      return line;
    })
    .reverse()
    .join('\n');

  return {
    annotations,
    code,
  };
}
