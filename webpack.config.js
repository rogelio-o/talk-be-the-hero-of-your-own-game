const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/app/index.ts",
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["public/build"],
    }),
    new HtmlWebpackPlugin({
      template: "src/templates/index.html",
    }),
    new CopyWebpackPlugin([{ from: "static" }]),
  ],
  output: {
    path: __dirname + "/public",
    filename: "build/[name].[contenthash].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts?$/, loader: "ts-loader" }],
  },
};
