import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import mo from 'motoko/interpreter';
import motokoBasePackage from 'motoko/packages/latest/base.json';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCode, FaLink, FaPause, FaPlay } from 'react-icons/fa';
import useChangedState from '../hooks/useChangedState';
import useCodeState from '../hooks/useCodeState';
import { getEmbedLink, parseEmbedLink } from '../services/embedLinkService';
import { getEmbedHeight, getOutputHeight } from '../utils/getEmbedHeight';
import preprocessMotoko from '../utils/preprocessMotoko';
import Button from './Button';
import CodeEditor, { EDITOR_FONT_SIZE } from './CodeEditor';
import isMobile from '../utils/isMobile';

mo.setRunStepLimit(100_000);

const defaultLanguage = 'motoko'; // TODO: refactor

export const getEmbedSnippet = (src) =>
  `
<iframe
  src="${src || 'https://embed.smartcontracts.org'}"
  width="100%"
  height="${getEmbedHeight(Number(/[?&]lines=([0-9]+)/.exec(src)?.[1]))}"
  style="border:0"
  title="Motoko code snippet"
/>
`.trim();

let runDebounce: ReturnType<typeof setTimeout>;

export default function Embed() {
  const [inputCode, setInputCode] = useCodeState();
  const [changed] = useChangedState();
  const [message, setMessage] = useState('');
  const [autoRun, setAutoRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_output, setOutput] = useState<Partial<ReturnType<typeof mo.run>>>({});

  const output = autoRun ? _output : {};

  const { code, attributes /* , lineCount */ } = useMemo(() => {
    return preprocessMotoko(inputCode || '');
  }, [inputCode]);

  const packages = useMemo(() => {
    const packages = attributes
      .filter((a) => a.key === 'package' && a.value?.includes(' '))
      .map((a) =>
        a
          .value!.split(' ')
          .map((s) => s.trim())
          .filter((s) => s),
      )
      .filter((kv) => kv.length === 2);
    return packages;
  }, [attributes]);

  // Package string for memoization
  const packageData = JSON.stringify(packages);

  const updatePackages = useCallback(() => {
    if (loading) {
      return;
    }

    console.log('Loading packages:', packages);
    setLoading(true);
    mo.clearPackages();
    mo.loadPackage(motokoBasePackage);
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
      // if (packages.length === 1 && packages[0] === motokoBasePackage) {
      //   updatePackages();
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageData]);

  useEffect(() => {
    if (!autoRun) {
      // return {};
      return;
    }
    clearTimeout(runDebounce);
    runDebounce = setTimeout(() => {
      try {
        setMessage('');
        const file = mo.file('mo');
        file.write(code);
        const { stdout, stderr } = file.run();
        const unitValueString = '() : ()\n';
        setOutput({
          stdout: stdout.endsWith(unitValueString)
            ? stdout.slice(0, -unitValueString.length)
            : stdout,
          stderr,
        });
      } catch (err) {
        console.error(err);
        setOutput({ stderr: err.message || String(err) });
      }
    }, 100);
  }, [code, autoRun]);

  const handleCopy = useCallback(
    (fn: (link: string) => string) => {
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
            window.history.pushState?.({}, '', link);
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
      return 'Copied link to clipboard. Paste into a Medium article to embed this code snippet!';
    });
  }, [handleCopy]);

  const copyFrameSnippet = useCallback(() => {
    handleCopy((link) => {
      copy(getEmbedSnippet(link).replace(/\s+/g, ' '));
      return 'Copied <iframe /> embed tag to clipboard.';
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
    (value: string) => {
      setInputCode(value);
      setLoading(false);
    },
    [setInputCode],
  );

  const outputHeight = getOutputHeight();

  return (
    <div
      className="relative w-full h-full"
      // style={{ maxHeight: !!limitHeight && getEmbedHeight(lineCount) }}
    >
      <div
        // className="overflow-y-auto"
        style={
          isMobile()
            ? {}
            : { height: `calc(100% - ${outputHeight}px)`, overflowY: 'auto' }
        }
      >
        <CodeEditor value={inputCode} onChange={handleChange} />
      </div>
      <div className="space-y-2 p-2 absolute right-0 bottom-[100px] text-sm sm:top-0 pointer-events-none [&>*]:pointer-events-auto z-10">
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
          padding: '14px',
          paddingBottom: 0,
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
            {output?.stderr ? (
              <pre
                style={{
                  color: '#F15A24',
                  opacity: 0.8,
                }}
              >
                {output.stderr}
              </pre>
            ) : (
              typeof output?.stdout === 'string' && (
                <pre
                  style={{
                    color: !output.stdout ? '#FFF5' : '#29E249',
                  }}
                >
                  {output.stdout || '()'}
                </pre>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
