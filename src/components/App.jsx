import React from 'react';
import ReactTooltip from 'react-tooltip';
import isEmbedded from '../utils/isEmbedded';
import Embed from './Embed';
import logoImage from '../assets/motoko-flat.png?width=144&height=144&webp';

export default function App() {
  return (
    <>
      <ReactTooltip />
      {isEmbedded() ? (
        <Embed />
      ) : (
        <div className="h-screen flex flex-col bg-[#F5F5F5] justify-center items-center">
          <div>
            <h1 className="text-4xl sm:text-7xl opacity-80 text-center lowercase font-light cursor-default select-none tracking-wide">
              Embed
              <img
                src={logoImage}
                className="inline h-[40px] sm:h-[72px] mr-1 sm:mr-2"
              />
              Motoko
            </h1>
            <hr className="mb-3" />
          </div>
          <div className="w-full p-4">
            <iframe
              title="Embed Motoko"
              className="w-full h-screen mx-auto"
              style={{
                maxWidth: 640,
                maxHeight: 480,
                border: 0,
                boxShadow: '0 0 20px #CCC',
              }}
              src={window.location.href}
            />
            {/* <div
              className="w-full max-w-[640px] h-[480px] border-0 mx-auto"
              style={{
                boxShadow: '0 0 20px #CCC',
              }}>
              <Embed />
            </div> */}
          </div>
          {/* <div className="mt-4 w-[640px]"> */}
            {/* <code className="mx-auto bg-gray-200 p-4 rounded-lg">
              &lt;iframe width="640" height="480" style="border:0" src="{}"
              /&gt;
            </code> */}
            {/* <hr className="my-3" /> */}
            {/* <code className="mx-auto text-xl opacity-50">
              Embed an interactive Motoko code snippet in a Medium article or
              blog post.
            </code> */}
          {/* </div> */}
        </div>
      )}
    </>
  );
}
