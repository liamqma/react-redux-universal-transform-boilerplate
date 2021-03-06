import express from 'express';
import configureStore from '../common/store/configure-store';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import App from '../common/container/app';
import isDevelopment from './is-development';

const app = express();
const port = process.env.PORT || 3000;

function renderFullPage(html, initialState) {
  return `<!doctype html>
    <html>
      <head>
        <title>React Redux Boilerplate</title>
        ${isDevelopment() ? '' : '<link href="/static/bundle.css" rel="stylesheet">'}
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.INITIAL_STATE = ${JSON.stringify(initialState)}
        </script>
        <script src="${isDevelopment() ? 'http://localhost:8080' : ''}/static/bundle.js"></script>
      </body>
    </html>
    `;
}

function handleRender(req, res) {
  // Create a new Redux store instance
  const store = configureStore();

  // Render the component to a string
  const html = renderToString(
    <Provider store={store} >
      <App />
    </Provider>
  );

  // Grab the initial state from our Redux store
  const finalState = store.getState();

  // Send the rendered page back to the client
  res.send(renderFullPage(html, finalState));
}

if (!isDevelopment()) {
  app.use('/static', express.static(`${__dirname}/static`));
}

app.use(handleRender);

app.listen(port, (error) => {
  /* eslint-disable no-console */
  if (error) {
    console.error(error);
  } else {
    console.info(`Listening on port ${port}`);
  }
  /* eslint-enable no-console */
});
