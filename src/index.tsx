import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';

import App from './components/App';
import './styles/index.scss';
import './redirect';

ReactDom.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
