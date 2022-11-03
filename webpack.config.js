const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: 'source-map',
    resolve: {
        extensions: ['.mjs','.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    // this makes sure we include node_modules and other 3rd party libraries
    externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    // module: {
    //     rules: [
    //         // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
    //         { test: /\.tsx?$/, loader: 'ts-loader' },
    //         { test: /\.m?js/, resolve: { fullySpecified: false } }
    //     ],
    // },
};
