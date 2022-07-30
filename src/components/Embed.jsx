import { useState, useMemo } from 'react';
import { FaCode } from 'react-icons/fa';
import { Motoko } from 'motoko';
import pako from 'pako';
import copy from 'copy-to-clipboard';
import CodeEditor from './CodeEditor';

const initialCode = `
// A simple Motoko smart contract.

actor Main {
  public func hello() : async Text {
    "Hello, world!"
  };
};

// await Main.hello();
`;

const RELATIVE_PATH = '/motoko/';
const EMBED_LINK_BASE = window.location.origin + RELATIVE_PATH;

const GZIP_FORMAT = 'g'; // TODO: refactor

let defaultCode;
const shareData = window.location.pathname.substring(RELATIVE_PATH.length);
if (shareData) {
  if (shareData.startsWith(GZIP_FORMAT)) {
    try {
      defaultCode = pako.inflate(
        new Uint8Array(
          atob(shareData.substring(GZIP_FORMAT.length))
            .split('')
            .map((c) => c.charCodeAt(0)),
        ),
        {
          to: 'string',
        },
      );
    } catch (err) {
      defaultCode = '// Unable to parse share link';
      console.error(err);
    }
  }
} else {
  defaultCode = initialCode.trim() + '\n';
}

export default function Embed() {
  const [value, setValue] = useState(defaultCode);
  const [message, setMessage] = useState(null);

  const output = useMemo(() => {
    try {
      setMessage(null);
      Motoko.saveFile('Main.mo', value);
      return Motoko.run([], 'Main.mo');
    } catch (err) {
      console.error(err);
      return { stderr: err.message || String(err) };
    }
  }, [value]);

  const copyEmbedLink = () => {
    const format = GZIP_FORMAT;
    const payload = btoa(String.fromCharCode.apply(null, pako.deflate(value)));
    const link = `${EMBED_LINK_BASE}${format}${payload}`;
    if (link.length >= 2048) {
      setMessage('> Your code is too long to fit into a URL!');
    } else {
      copy(link);
      setMessage(
        `> Copied link to clipboard.\n\nPaste into a Medium post to embed this code snippet!`,
      );
    }
    // setTimeout(() => setMessage(null), 3000);
  };

  const outputHeight = 100;

  return (
    <>
      <CodeEditor
        value={value}
        onChange={setValue}
        height={`calc(100vh - ${outputHeight}px)`}
      />
      <div className="button-menu">
        <div
          className="button"
          onClick={copyEmbedLink}
          data-tip="Embed this code snippet"
          data-place="left"
        >
          <FaCode />
        </div>
      </div>
      <div
        className="output"
        style={{
          fontSize: window.innerWidth < 600 ? 14 : 16,
          padding: '15px 15px',
          textAlign: 'left',
          maxWidth: '100vw',
          height: outputHeight,
          overflowY: 'auto',
        }}
      >
        {message ? (
          <pre style={{ color: 'white' }}>{message}</pre>
        ) : (
          <>
            {!!output?.stdout && (
              <pre
                style={{
                  color: 'lightgreen',
                }}
              >
                {output.stdout}
              </pre>
            )}
            {!!output?.stderr && (
              <pre
                style={{
                  color: 'pink',
                  opacity: 0.75,
                }}
              >
                {output.stderr}
              </pre>
            )}
          </>
        )}
      </div>
    </>
  );
}
