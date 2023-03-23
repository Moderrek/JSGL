const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: {
        "JSGL": path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].js',
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        clean: true
    },
    resolve: { extensions: ['.ts'] },
    plugins: [],
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
    } else {
        config.mode = 'development';
        config.devtool = 'source-map';
    }
    return config;
};
