import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';

import App from './components/App';
import './redirect';
import './styles/index.scss';

ReactDom.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
