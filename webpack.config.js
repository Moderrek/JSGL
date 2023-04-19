/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';
// const { version } = require('./package.json');

const config = {
    entry: {
        'JSGL': path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        asyncChunks: true,
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name]-[id].js',
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        clean: true
    },
    resolve: { extensions: ['.ts'] },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'babel-loader'
            }
        ]
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        // config.output.filename = `[name]-${version}.js`;
    } else {
        config.mode = 'development';
        config.devtool = 'source-map';
        // config.output.filename = `[name]-${version}-dev.js`;
    }
    return config;
};