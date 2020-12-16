const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const hp = (v) => ['babel-polyfill', path.resolve(__dirname, v)]
const hhwp = ({ chunks, filename }) => new HtmlWebpackPlugin({
    chunks: chunks,
    filename: filename,
    templateContent: '',
})

module.exports = {
    mode: "development",
    entry: {
        'backend/webapp':
            hp('backend/webapp/src/index.js'),

        'frontend/bundle':
            hp('frontend/bundle/src/index.js'),

        'frontend/mobile':
            hp('frontend/mobile/src/index.js'),

        'frontend/payment':
            hp('frontend/payment/src/index.js'),

        'frontend/profile':
            hp('frontend/profile/src/index.js'),

        'govorg/frontend':
            hp('govorg/frontend/index.js'),
    },
    output: {
        // options related to how webpack emits results

        // where compiled files go
        path: path.resolve(__dirname, "geoportal_app/"),

        // http://127.0.0.1/<publicPath>/ - where files are served from
        publicPath: "/",

        filename: 'static/dist/[name]/[chunkhash].js',
    },
    module: {
        // configuration regarding modules
        rules: [
            {
                // regex test for js and jsx files
                test: /\.(js|jsx)?$/,
                // don't look in the node_modules/ folder
                exclude: /node_modules/,
                // for matching files, use the babel-loader
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }

        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
           '@': path.resolve(__dirname, 'frontend/bundle/src/'),
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        runtimeChunk: {
            name: "manifest",
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'libs',
                    chunks: 'all',
                }
            }
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true,
            cleanOnceBeforeBuildPatterns: ['static/dist/**/*'],
        }),
        hhwp({
            chunks: ['backend/webapp'],
            filename: path.resolve(__dirname, 'backend/webapp/templates/backend/webapp.prod.html'),
        }),
        hhwp({
            chunks: ['frontend/bundle'],
            filename: path.resolve(__dirname, 'frontend/bundle/templates/bundle/detail.prod.html'),
        }),
        hhwp({
            chunks: ['frontend/mobile'],
            filename: path.resolve(__dirname, 'frontend/mobile/templates/mobile/detail.prod.html'),
        }),
        hhwp({
            chunks: ['frontend/payment'],
            filename: path.resolve(__dirname, 'frontend/payment/templates/payment/index.prod.html'),
        }),
        hhwp({
            chunks: ['frontend/profile'],
            filename: path.resolve(__dirname, 'frontend/profile/templates/profile/index.prod.html'),
        }),
        hhwp({
            chunks: ['govorg/frontend'],
            filename: path.resolve(__dirname, 'govorg/backend/org/templates/org/index.prod.html'),
        }),
    ],
}
