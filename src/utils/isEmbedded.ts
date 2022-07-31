let embedded = true;
try {
  embedded = window.self !== window.top;
} catch (e) {}

export default function isEmbedded(): boolean {
  return embedded;
}
