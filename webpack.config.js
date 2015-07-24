'use strict';

var path = require('path'),
    webpack = require('webpack');

module.exports = {
    cache: true,
    context: path.join(__dirname, 'src'),
    entry: [
        "./js/index"
    ],
    output: {
        path: path.join(__dirname, "build"),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.less$/, loader: "style!css!less"},
            { test: /\.woff?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2?$/,   loader: "url?limit=10000&mimetype=application/font-woff2" },
            { test: /\.ttf?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot?$/,    loader: "file" },
            { test: /\.svg?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};