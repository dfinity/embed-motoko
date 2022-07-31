import React from 'react';
import ReactTooltip from 'react-tooltip';
import isEmbedded from '../utils/isEmbedded';
import Embed from './Embed';
import Wrapper from './Wrapper';

export default function App() {
  return (
    <>
      <ReactTooltip />
      {isEmbedded() ? <Embed /> : <Wrapper />}
    </>
  );
}
