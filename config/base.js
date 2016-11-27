const pkg = require('../package')
const paths = require('./paths')

const baseConfig = {
    devtool: 'eval',
    entry: paths.main,
    module: {
        loaders: [{
            test: /\.js$/,
            include: /src/,
            loaders: ['babel']
        }]
    },
    output: {
        filename: `${pkg.name}.js`
    },
    resolve: {
        alias: { },
        root: paths.root,
        modulesDirectories: ['node_modules']
    },
    plugins: []
}

module.exports = baseConfig
