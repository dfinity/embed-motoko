import React, { useState, useMemo } from 'react';
import { FaCode } from 'react-icons/fa';
import { Motoko } from 'motoko';
import copy from 'copy-to-clipboard';
import CodeEditor from './CodeEditor';
import useCodeState from '../hooks/useCodeState';
import { getEmbedLink } from '../services/embedLinkService';

const language = 'motoko'; // TODO: refactor

export default function Embed() {
  const [code, setCode] = useCodeState();
  const [message, setMessage] = useState('');

  const output = useMemo(() => {
    try {
      setMessage('');
      Motoko.saveFile('Main.mo', code);
      return Motoko.run([], 'Main.mo');
    } catch (err) {
      console.error(err);
      return { stderr: err.message || String(err) };
    }
  }, [code]);

  const copyEmbedLink = () => {
    const link = getEmbedLink({ language, code });
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
        value={code}
        onChange={setCode}
        className="flex flex-col"
        // height={`calc(100vh - ${outputHeight}px)`}
      />
      <div className="button-menu flex-1">
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
