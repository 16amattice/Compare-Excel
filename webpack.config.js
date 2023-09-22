const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');


const config = {
  target: "electron-main",
  devtool: "source-map",
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: './src/preload.js', to: 'preload.js' }
        ]
    })
]
};

module.exports = (env, argv) => {
  return config;
};