import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';

import App from './components/App';
import './styles/index.scss';

ReactDom.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

// --- React 18 --- //

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';

// import App from './components/App';
// import './index.scss';

// const rootElement = document.getElementById('root');
// const root = createRoot(rootElement);

// root.render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// );
