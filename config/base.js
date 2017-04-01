const pkg = require('../package')
const paths = require('./paths')

const baseConfig = {
  devtool: 'eval',
  entry: paths.main,
  module: {
    rules: [{
      test: /\.js$/,
      include: /src/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }]
  },
  output: {
    filename: `${pkg.name}.js`
  },
  resolve: {
    alias: {},
    modules: ['node_modules']
  },
  plugins: []
}

module.exports = baseConfig
