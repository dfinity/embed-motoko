import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FaCode, FaLink, FaPause, FaPlay } from 'react-icons/fa';
import mo from 'motoko/interpreter';
import copy from 'copy-to-clipboard';
import CodeEditor, { EDITOR_FONT_SIZE } from './CodeEditor';
import useCodeState from '../hooks/useCodeState';
import { getEmbedLink, parseEmbedLink } from '../services/embedLinkService';
import useChangedState from '../hooks/useChangedState';
import classNames from 'classnames';
import preprocessMotoko from '../utils/preprocessMotoko';
import Button from './Button';

const defaultLanguage = 'motoko'; // TODO: refactor

const motokoBasePackage = ['base', 'dfinity/motoko-base/master/src'];

export const getEmbedSnippet = (src) =>
  `
<iframe
  src="${src || 'https://embed.smartcontracts.org'}"
  width="100%"
  height="500"
  style="border:0"
  title="Code snippet"
/>
`.trim();

export default function Embed() {
  const [inputCode, setInputCode] = useCodeState();
  const [changed] = useChangedState();
  const [message, setMessage] = useState('');
  const [autoRun, setAutoRun] = useState(false);
  const [loading, setLoading] = useState(false);

  const { code, attributes } = useMemo(() => {
    return preprocessMotoko(inputCode || '');
  }, [inputCode]);

  const packages = useMemo(() => {
    const packages = attributes
      .filter((a) => a.key === 'package' && a.value?.includes(' '))
      .map((a) =>
        a.value
          .split(' ')
          .map((s) => s.trim())
          .filter((s) => s),
      )
      .filter((kv) => kv.length === 2);

    if (code.includes('"mo:base/')) {
      packages.unshift(motokoBasePackage);
    }
    return packages;
  }, [attributes, code]);

  // Package string for memoization
  const packageData = JSON.stringify(packages);

  const updatePackages = useCallback(() => {
    if (loading) {
      return;
    }

    console.log('Loading packages:', packages);
    setLoading(true);
    mo.clearPackages();
    mo.installPackages(Object.fromEntries(packages))
      .then(() => {
        setAutoRun(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage(`Error: ${err.message || err}`);
      });
  }, [packages, loading]);

  useMemo(() => {
    if (autoRun && packages.length) {
      setAutoRun(false);
      if (packages.length === 1 && packages[0] === motokoBasePackage) {
        updatePackages();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageData]);

  const output = useMemo(() => {
    if (!autoRun) {
      return {};
    }
    try {
      setMessage('');
      const file = mo.file('Embed.mo');
      file.write(code);
      return file.run();
    } catch (err) {
      console.error(err);
      return { stderr: err.message || String(err) };
    }
  }, [code, autoRun]);

  const handleCopy = useCallback(
    (fn) => {
      try {
        const link = getEmbedLink({
          language: defaultLanguage,
          code: inputCode,
        });
        if (link.length >= 2000) {
          setMessage('Your code is too long to fit into a URL!');
        } else {
          const message = fn(link);
          if (link !== window.location.href) {
            window.history.pushState?.({}, null, link);
          }
          const result = parseEmbedLink(link);
          setInputCode(result.code);
          setMessage(message);
        }
      } catch (err) {
        console.error(err);
        setMessage(`Error: ${err.message || err}`);
      }
    },
    [inputCode, setInputCode],
  );

  const copyEmbedLink = useCallback(() => {
    handleCopy((link) => {
      copy(link);
      return 'Copied link to clipboard. Paste into a Medium post to embed this code snippet!';
    });
  }, [handleCopy]);

  const copyFrameSnippet = useCallback(() => {
    handleCopy((link) => {
      copy(getEmbedSnippet(link).replace(/\s+/g, ' '));
      return 'Copied iframe embed tag to clipboard.';
    });
  }, [handleCopy]);

  useEffect(() => {
    if (!autoRun) {
      if (!changed || packages.length === 0) {
        updatePackages();
      }
    }
  }, [changed, autoRun, packages.length, updatePackages]);

  const handleChange = useCallback(
    (value) => {
      setInputCode(value);
      setLoading(false);
    },
    [setInputCode],
  );

  const outputHeight = 100;

  return (
    <div className="relative w-full h-full">
      <div
        className="h-full overflow-auto"
        style={{ height: `calc(100% - ${outputHeight}px)` }}
      >
        <CodeEditor value={inputCode} onChange={handleChange} />
      </div>
      <div className="flex-grow flex flex-col space-y-2 p-3 absolute right-0 bottom-[100px] sm:top-0 opacity-50 sm:opacity-100 pointer-events-none [&>*]:pointer-events-auto">
        <Button
          tooltip="Copy permalink"
          className={classNames(changed && 'emphasized')}
          onClick={copyEmbedLink}
        >
          <FaLink />
        </Button>
        <Button
          // tooltip="Embed this code snippet"
          tooltip="Copy embed snippet"
          className={classNames(changed && 'emphasized')}
          onClick={copyFrameSnippet}
        >
          <FaCode />
        </Button>
        <Button
          tooltip={autoRun ? 'Pause' : 'Load packages and evaluate'}
          className={classNames(
            (packages.length === 0 || !changed) && 'hidden',
            !autoRun && '!bg-green-600',
          )}
          onClick={() => (autoRun ? setAutoRun(false) : updatePackages())}
        >
          {autoRun ? (
            <FaPause />
          ) : (
            <FaPlay className="translate-x-[2px] text-green-600" />
          )}
        </Button>
      </div>
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
