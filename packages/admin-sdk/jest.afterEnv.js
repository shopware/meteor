const failOnConsole = require('jest-fail-on-console');

failOnConsole()

// applyEmbeddedContext and the theme sync mutate the document root and the
// URL; reset both here after every test instead of in each affected spec file
const initialUrl = window.location.href;

afterEach(() => {
  delete document.documentElement.dataset.embedded;
  delete document.documentElement.dataset.theme;
  document.documentElement.style.removeProperty('color-scheme');
  document.getElementById('meteor-admin-sdk-embedded')?.remove();
  window.history.replaceState({}, '', initialUrl);
});
