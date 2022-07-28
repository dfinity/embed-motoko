import { useState, useMemo } from 'react';
import { FaCode } from 'react-icons/fa';
import { Motoko } from 'motoko';
import ReactTooltip from 'react-tooltip';
import copy from 'copy-to-clipboard';
import CodeEditor from './CodeEditor';

const initialCode = `
// A simple Motoko smart contract.

actor Main {
  public func hello() : async Text {
    "Hello, world!"
  };
};

await Main.hello()
`;

const EMBED_LINK_BASE = 'https://embed.smartcontracts.org/';

const UNCOMPRESSED_FORMAT = 'c';

let defaultCode;
const shareData = window.location.pathname.substring(1);
if (shareData) {
  if (shareData.startsWith(UNCOMPRESSED_FORMAT)) {
    try {
      defaultCode = atob(shareData.substring(UNCOMPRESSED_FORMAT.length));
    } catch (err) {
      defaultCode = '// Unable to parse share link';
    }
  }
} else {
  defaultCode = initialCode.trim() + '\n';
}

export default function App() {
  const [value, setValue] = useState(defaultCode);
  const [message, setMessage] = useState(null);

  const output = useMemo(() => {
    try {
      Motoko.saveFile('Main.mo', value);
      return Motoko.run([], 'Main.mo');
    } catch (err) {
      return { stderr: err.message || String(err) };
    }
  }, [value]);

  const copyEmbedLink = () => {
    const format = UNCOMPRESSED_FORMAT;
    const link = `${EMBED_LINK_BASE}${format}${btoa(value)}`;
    if (link.length >= 2048) {
      setMessage('> Your code is too long to fit into a URL!');
    } else {
      copy(link);
      setMessage(
        `> Copied embed link to clipboard.\n\nPaste into a Medium post .`,
      );
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const outputHeight = 100;

  return (
    <div className="App">
      <ReactTooltip />
      <CodeEditor
        value={value}
        onChange={setValue}
        height={`calc(100vh - ${outputHeight}px)`}
      />
      <div className="button-menu">
        <div className="button" onClick={copyEmbedLink} title="Copy embed link">
          <FaCode />
        </div>
      </div>
      <div
        style={{
          fontSize: 16,
          padding: '5px 20px',
          textAlign: 'left',
          maxWidth: '100vw',
          maxHeight: outputHeight,
          overflowY: 'auto',
        }}
      >
        {message ? (
          <pre style={{ color: 'white', overflow: 'auto' }}>{message}</pre>
        ) : (
          <>
            {!!output?.stdout && (
              <pre
                style={{
                  color: 'lightgreen',
                  overflow: 'auto',
                }}
              >
                {output.stdout}
              </pre>
            )}
            {!!output?.stderr && (
              <pre
                style={{
                  color: 'pink',
                  opacity: 0.8,
                  overflow: 'auto',
                }}
              >
                {output.stderr}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
