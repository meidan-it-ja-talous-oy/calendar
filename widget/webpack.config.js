const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
const pkg = require('./package.json');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = 'meitaGcal.min.js';
} else {
  mode = 'development';
  outputFile = 'meitaGcal.js';
}

const config = {
  mode: mode,
  entry: __dirname + '/src/index.js',
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: 'MeitaGcal',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  optimization: {
	  minimizer: [new UglifyJsPlugin({
	        uglifyOptions: {
	            warnings: false,
	            parse: {},
	            compress: {},
	            mangle: true, 
	            output: null,
	            toplevel: false,
	            nameCache: null,
	            ie8: false,
	            keep_fnames: false,
	          },
	        })],
	        namedModules: false,
	        namedChunks: false,
	        nodeEnv: 'production',
	        flagIncludedChunks: true,
	        occurrenceOrder: true,
	        sideEffects: true,
	        usedExports: true,
	        concatenateModules: true,
	        noEmitOnErrors: true,
	        checkWasmTypes: true,
	        minimize: true
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};

module.exports = config;

