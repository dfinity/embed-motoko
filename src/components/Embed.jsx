import React, { useState, useMemo } from 'react';
import { FaCode } from 'react-icons/fa';
import { Motoko } from 'motoko';
import copy from 'copy-to-clipboard';
import CodeEditor from './CodeEditor';
import useCodeState from '../hooks/useCodeState';
import { getEmbedLink } from '../services/embedLinkService';
import useChangedState from '../hooks/useChangedState';
import classNames from 'classnames';

const language = 'motoko'; // TODO: refactor

export default function Embed() {
  const [code, setCode] = useCodeState();
  const [changed] = useChangedState();
  const [message, setMessage] = useState('');

  const output = useMemo(() => {
    try {
      setMessage('');
      Motoko.saveFile('Main.mo', code || '');
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
        '> Copied link to clipboard.\n\nPaste into a Medium post to embed this code snippet!',
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
        height={`calc(100vh - ${outputHeight}px)`}
      />
      <div className="flex-grow p-3 absolute right-0 top-0">
        <div
          className={classNames(
            'button-wrapper flex justify-center items-center',
            changed && 'emphasized',
          )}
        >
          <div
            className="button flex justify-center items-center"
            onClick={copyEmbedLink}
            data-tip="Embed this code snippet"
            data-place="left"
          >
            <FaCode />
          </div>
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
                  color: '#29E249',
                }}
              >
                {output.stdout}
              </pre>
            )}
            {!!output?.stderr && (
              <pre
                style={{
                  color: '#F15A24',
                  opacity: 0.8,
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
