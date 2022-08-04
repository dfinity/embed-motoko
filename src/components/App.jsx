import React from 'react';
import ReactTooltip from 'react-tooltip';
import isEmbedded from '../utils/isEmbedded';
import Embed from './Embed';
import LandingPage from './LandingPage';

export default function App() {
  return (
    <>
      <ReactTooltip />
      {isEmbedded() ? (
        <div className="h-screen">
          <Embed />
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
