import React, { useState, useMemo } from 'react';
import { FaCode } from 'react-icons/fa';
import { Motoko } from 'motoko';
import copy from 'copy-to-clipboard';
import CodeEditor, { EDITOR_FONT_SIZE } from './CodeEditor';
import useCodeState from '../hooks/useCodeState';
import { getEmbedLink, parseEmbedLink } from '../services/embedLinkService';
import useChangedState from '../hooks/useChangedState';
import classNames from 'classnames';
import isMobile from '../utils/isMobile';
import preprocessMotoko from '../utils/preprocessMotoko';

const language = 'motoko'; // TODO: refactor

export default function Embed() {
  const [code, setCode] = useCodeState();
  const [changed] = useChangedState();
  const [message, setMessage] = useState('');

  const output = useMemo(() => {
    try {
      let result = preprocessMotoko(code || '');

      console.log(result.code); ///

      setMessage('');
      Motoko.saveFile('__embed__.mo', result.code);
      return Motoko.run([], '__embed__.mo');
    } catch (err) {
      console.error(err);
      return { stderr: err.message || String(err) };
    }
  }, [code]);

  const copyEmbedLink = () => {
    try {
      const link = getEmbedLink({ language, code });
      if (link.length >= 2000) {
        setMessage('Your code is too long to fit into a URL!');
      } else {
        copy(link);
        if (link !== window.location.href) {
          window.history.pushState?.({}, null, link);
        }
        const result = parseEmbedLink(link);
        setCode(result.code);
        setMessage(
          'Copied link to clipboard.\n\nPaste into a Medium post to embed this code snippet!',
        );
      }
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message || err}`);
    }
  };

  const outputHeight = 100;

  return (
    <div className="relative w-full h-full">
      <div
        className="h-full overflow-auto"
        style={{ height: `calc(100% - ${outputHeight}px)` }}
      >
        <CodeEditor value={code} onChange={setCode} />
      </div>
      {!isMobile() && (
        <>
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
        </>
      )}
      <div
        className="output"
        style={{
          fontSize: EDITOR_FONT_SIZE,
          padding: '15px 15px',
          textAlign: 'left',
          maxWidth: '100vw',
          height: outputHeight,
          overflowY: 'auto',
        }}
      >
        {message ? (
          <pre style={{ color: 'white' }}>&gt; {message}</pre>
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
    </div>
  );
}
