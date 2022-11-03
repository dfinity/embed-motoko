export function getEmbedHeight(lines: number | undefined): number {
  const defaultHeight = 500;
  return lines || lines === 0
    ? Math.min(getOutputHeight() + 20 + lines * 24, defaultHeight)
    : defaultHeight;
}

export function getOutputHeight(): number {
  return 100;
}
