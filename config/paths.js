const path = require('path');

const root = path.join(__dirname, '..');

const paths = {
  distUmd: path.join(root, 'dist', 'umd'),
  main: path.join(root, 'src', 'index.js'),
  root,
  source: path.join(root, 'src'),
  tests: path.join(root, 'tests'),
};

module.exports = paths;
