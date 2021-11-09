const fs = require('fs');
const path = require('path'),
  {CleanWebpackPlugin} = require('clean-webpack-plugin'),
  Dotenv = require('dotenv-webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distPath = path.join(__dirname, 'dist'),
  srcPath = path.join(__dirname, 'src'),
  issuesPath = path.join(srcPath, 'issues');

const IS_DEV = process.env.NODE_ENV !== 'production';

const dirNames = fs.readdirSync(issuesPath);

const entry = dirNames.reduce((value, dirName) => {
  value[dirName] = path.join(issuesPath, dirName, 'index.ts');
  return value;
}, {});

const plugins = [
  new CleanWebpackPlugin({
    verbose: true,
    cleanStaleWebpackAssets: false,
  }),
  new Dotenv({
    allowEmptyValues: false,
    safe: true,
  }),
];

dirNames.forEach((dirName) => {
  plugins.push(
    new HtmlWebpackPlugin({
      chunks: [dirName],
      filename: `${dirName}/index.html`,
      template: path.join(srcPath, 'index.html'),
      title: 'Google Maps ThreeJSOverlayView Issues',
    })
  );
});

if (!IS_DEV) {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name]/styles.css',
      chunkFilename: '[name]/[id].css',
    })
  );
}

module.exports = {
  entry,
  output: {
    filename: '[name]/scripts.js',
    path: distPath,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {loader: IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader},
          {loader: 'css-loader'},
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: IS_DEV ? 'expanded' : 'compressed',
                precision: 8,
                includePaths: [path.join(srcPath, 'styles')],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [srcPath, 'node_modules'],
    extensions: ['.js', '.ts', '.tsx', '.scss'],
  },
  plugins,
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: IS_DEV ? 'eval-cheap-module-source-map' : 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
};
