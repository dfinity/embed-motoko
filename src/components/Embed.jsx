import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FaCode, FaPlay } from 'react-icons/fa';
import mo, { Motoko } from 'motoko';
import copy from 'copy-to-clipboard';
import CodeEditor, { EDITOR_FONT_SIZE } from './CodeEditor';
import useCodeState from '../hooks/useCodeState';
import { getEmbedLink, parseEmbedLink } from '../services/embedLinkService';
import useChangedState from '../hooks/useChangedState';
import classNames from 'classnames';
import isMobile from '../utils/isMobile';
import preprocessMotoko from '../utils/preprocessMotoko';
import Button from './Button';

const language = 'motoko'; // TODO: refactor

export default function Embed() {
  const [inputCode, setInputCode] = useCodeState();
  const [changed] = useChangedState();
  const [message, setMessage] = useState('');
  const [autoRun, setAutoRun] = useState(false);
  const [loading, setLoading] = useState(false);

  const { code, attributes } = useMemo(() => {
    return preprocessMotoko(inputCode || '');
  }, [inputCode]);

  // Attribute data for comparison
  const attributeData = JSON.stringify(attributes);

  useMemo(() => {
    if (autoRun && attributes.length) {
      setAutoRun(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributeData]);

  const output = useMemo(() => {
    if (!autoRun) {
      return {};
    }
    try {
      setMessage('');
      const path = 'Embed.mo';
      Motoko.saveFile(path, code);
      return Motoko.run([], path);
    } catch (err) {
      console.error(err);
      return { stderr: err.message || String(err) };
    }
  }, [code, autoRun]);

  const updatePackages = useCallback(() => {
    if (loading) {
      return;
    }

    const packages = Object.fromEntries(
      attributes
        .filter((a) => a.key === 'package' && a.value?.includes(' '))
        .map((a) =>
          a.value
            .split(' ')
            .map((s) => s.trim())
            .filter((s) => s),
        ),
    );
    console.log('Loading packages:', packages);
    mo.clearPackages();
    setLoading(true);
    mo.loadPackages(packages)
      .then(() => setAutoRun(true))
      .catch((err) => {
        // setUpdated(false);
        console.error(err);
        setMessage(`Error: ${err.message || err}`);
      })
      .finally(() => setLoading(false));
  }, [attributes, loading]);

  const copyEmbedLink = useCallback(() => {
    try {
      const link = getEmbedLink({ language, code: inputCode });
      if (link.length >= 2000) {
        setMessage('Your code is too long to fit into a URL!');
      } else {
        copy(link);
        if (link !== window.location.href) {
          window.history.pushState?.({}, null, link);
        }
        const result = parseEmbedLink(link);
        setInputCode(result.code);
        setMessage(
          'Copied link to clipboard.\n\nPaste into a Medium post to embed this code snippet!',
        );
      }
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message || err}`);
    }
  }, [inputCode, setInputCode]);

  useEffect(() => {
    if (!autoRun) {
      if (!changed || attributes.length === 0) {
        updatePackages();
      }
    }
  }, [changed, autoRun, attributes.length, updatePackages]);

  const outputHeight = 100;

  return (
    <div className="relative w-full h-full">
      <div
        className="h-full overflow-auto"
        style={{ height: `calc(100% - ${outputHeight}px)` }}
      >
        <CodeEditor value={inputCode} onChange={setInputCode} />
      </div>
      {!isMobile() && (
        <>
          <div className="flex-grow p-3 absolute right-0 top-0">
            <Button
              tooltip="Embed this code snippet"
              className={classNames(changed && 'emphasized')}
              onClick={copyEmbedLink}
            >
              <FaCode />
            </Button>
            <Button
              tooltip="Load packages"
              className={classNames('mt-2', (autoRun || !changed) && 'hidden')}
              onClick={updatePackages}
            >
              <FaPlay className="translate-x-[2px]" />
            </Button>
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
