import React from 'react';
import classNames from 'classnames';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaCode, FaLink } from 'react-icons/fa';
import { SiMedium, SiWordpress } from 'react-icons/si';
// @ts-ignore
import motokoFlatImage from '../assets/motoko-flat.png?width=144&height=144&webp';
// @ts-ignore
import motokoColorImage from '../assets/motoko-color.png?width=144&height=144&webp';
// @ts-ignore
import dfinityImage from '../assets/icp.png?webp';
import Embed, { getEmbedSnippet } from './Embed';

export default function LandingPage() {
  // hotfix, TODO: split landing page into separate bundle
  document.body.style.backgroundColor = '#F5F5F5';

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="p-4 w-full max-w-[640px] flex flex-col justify-center items-center">
          <a
            className="block mt-1"
            href="https://github.com/dfinity/embed-motoko"
            target="_blank"
            title="GitHub repository"
            rel="noreferrer"
          >
            <h1 className="main-title md:px-5 text-4xl sm:text-7xl text-center lowercase font-light select-none tracking-wide">
              Embed
              {[
                [motokoFlatImage, 'hover-hide'],
                [motokoColorImage, 'hover-show'],
              ].map(([motokoImage, className]) => (
                <img
                  key={motokoImage}
                  src={motokoImage}
                  className={classNames(
                    'inline h-[40px] sm:h-[72px] mr-1 sm:mr-2',
                    className,
                  )}
                  alt=""
                />
              ))}
              Motoko
            </h1>
          </a>
          <hr className="w-full mb-3" />
          <div className="w-full py-4">
            <div
              className="min-w-full min-h-[140px] rounded overflow-auto sm:resize"
              style={{
                boxShadow: '0 0 20px #CCC',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Embed />
            </div>
          </div>
          <div className="mt-4 sm:px-4 w-full">
            <div className="sm:flex items-center">
              <div className="flex-grow flex sm:block justify-center">
                <p className="text-lg sm:text-2xl opacity-75 inline-block">
                  Embed a custom Motoko code snippet
                  <br />
                  in a Medium article, blog, or webapp.
                </p>
              </div>
              <div className="mt-8 mb-0 sm:mt-0 sm:mb-0 flex justify-center">
                <a
                  className="inline-block w-[100px] hover:scale-105 duration-100"
                  href="https://smartcontracts.org/"
                  target="_blank"
                  rel="noreferrer"
                  title="Learn more about the Internet Computer"
                >
                  <img src={dfinityImage} alt="SmartContracts.org" />
                </a>
              </div>
            </div>
          </div>
          <hr className="w-full my-8" />
          <div className="w-full">
            <h2 className="mb-4 font-bold text-3xl opacity-60">
              <SiMedium className="inline ml-1 mr-3 translate-y-[-2px]" />
              Medium article:
            </h2>
            <pre className="block p-4 bg-[#FFF] rounded-lg drop-shadow-lg">
              https://embed.smartcontracts.org
            </pre>
            <p className="text-xl mt-4 text-[#555360]">
              Use the
              <FaLink className="inline-block mx-2 border-[3px] border-[#555360] w-10 h-10 px-[10px] rounded-full" />
              button for your custom embed link.
            </p>
          </div>
          <hr className="w-full my-8" />
          <div className="w-full">
            <h2 className="mb-4 font-bold text-3xl opacity-60">
              <SiWordpress className="inline ml-1 mr-3 translate-y-[-2px]" />
              Blog or webapp:
            </h2>
            <SyntaxHighlighter
              language="html"
              style={syntaxStyle}
              customStyle={{ background: 'white', padding: '1rem' }}
              className="rounded-lg drop-shadow-lg"
            >
              {getEmbedSnippet()}
            </SyntaxHighlighter>
            <p className="text-xl mt-4 text-[#555360]">
              Use the
              <FaCode className="inline-block mx-2 border-[3px] border-[#555360] w-10 h-10 px-[10px] rounded-full" />
              button for your custom code snippet.
            </p>
          </div>
          <hr className="w-full my-8" />
        </div>
      </div>
    </>
  );
}
