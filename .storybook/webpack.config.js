const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../')
      }
    ]
  },
  resolve: {
    alias: {
      $root: path.resolve(__dirname, '../'),
      $lib: path.resolve(__dirname, '../src/')
    }
  }
}
