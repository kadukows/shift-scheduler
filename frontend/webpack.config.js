const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const BrottliPlugin = require("brotli-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "./static/frontend"),
        publicPath: "./static/frontend",
        filename: "base.js",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".css"],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        /*
        new BrottliPlugin({
            asset: "[path].br[query]",
            test: /\.(js|css|html|svg)$/,
            treshold: 10240,
            minRatio: 0.8,
        }),
        */
    ],
    /*
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    */
    devtool: "inline-source-map",
};
