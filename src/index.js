import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { FirebaseAppProvider } from "reactfire";
import firebaseConfig from './firebase-config';

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Suspense fallback="loading...">
      <App />
    </Suspense>
  </FirebaseAppProvider>,
  document.getElementById('root')
);
