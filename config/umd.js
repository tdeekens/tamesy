const pkg = require('../package');
const paths = require('./paths');

const umdConfig = {
  devtool: 'source-map',
  output: {
    library: `${pkg.name}`,
    libraryTarget: 'umd',
    path: paths.distUmd,
    umdNamedDefine: true,
  },
};

module.exports = umdConfig;
