const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const config = {
  target: "electron-renderer",
  devtool: "source-map",
  entry: "./src/app/renderer.tsx",
  output: {
    filename: "renderer.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      // TypeScript processing
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      // SCSS processing
      {
        test: /\.scss$/,
        use: [
          'style-loader',  // Inject styles into DOM
          'css-loader',    // Translates CSS into CommonJS
          'sass-loader'    // Compiles Sass to CSS
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [htmlPlugin]
};

module.exports = (env, argv) => {
  return config;
};