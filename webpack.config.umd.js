const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.config.base');
const path = require('path');

config.mode = 'development';

config.entry = {
  'dragon-ui': ['./components/index.js', './styles/index.scss']
};

config.output = {
  library: 'DragonUI',
  libraryTarget: 'umd',
  path: path.join(process.cwd(), 'dist'),
  filename: '[name].js'
};

config.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].css',
  })
);

config.externals = {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
  },
  'react-dom': {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom'
  }
};

module.exports = config;
