const merge = require('webpack-merge');

const baseConfig = require('./config/base');
const umdConfig = require('./config/umd');
const umdMinConfig = require('./config/umd.min');

const umd = merge(baseConfig, umdConfig);
const umdMin = merge(umd, umdMinConfig);

const target = process.env.npm_lifecycle_event;

let config;

switch (target) {
  case 'build:umd':
    config = umd;
    break;
  case 'build:umd:min':
    config = umdMin;
    break;
  default:
    config = umd;
    break;
}

module.exports = config;
