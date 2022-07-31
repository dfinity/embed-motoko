import React from 'react';
import classNames from 'classnames';
import motokoFlatImage from '../assets/motoko-flat.png?width=144&height=144&webp';
import motokoColorImage from '../assets/motoko-color.png?width=144&height=144&webp';
import dfinityImage from '../assets/icp.png?webp';

export default function Wrapper() {
  return (
    <>
      <div className="h-screen flex flex-col bg-[#F5F5F5] justify-center items-center">
        <a
          className="block"
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
                rel="noreferrer"
              />
            ))}
            Motoko
          </h1>
          <hr className="mb-3" />
        </a>
        <div className="w-full p-4">
          <iframe
            title="Embed Motoko"
            className="w-full h-screen max-w-[640px] max-h-[480px] border-0 mx-auto"
            style={{
              boxShadow: '0 0 20px #CCC',
            }}
            src={window.location.href}
          />
        </div>
        <div className="mt-4 w-full max-w-[640px]">
          <div className="px-4 sm:flex items-center">
            <div className="flex-grow flex sm:block justify-center">
              <p className="text-md sm:text-2xl opacity-75 inline-block">
                Embed an interactive Motoko code snippet
                <br />
                in a Medium article, blog post, or webapp.
              </p>
            </div>
            <div className="my-8 sm:my-0 flex justify-center">
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
          <hr className="mt-8" />
        </div>
      </div>
    </>
  );
}
