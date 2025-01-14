const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
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

        'frontend/open_layer':
            hp('frontend/open_layer/src/index.js'),

        'frontend/profile':
            hp('frontend/profile/src/index.js'),

        'govorg/frontend':
            hp('govorg/frontend/index.js'),

        'llc/frontend':
        hp('llc/frontend/index.js'),
    },
    output: {
        // options related to how webpack emits results

        // where compiled files go
        path: path.resolve(__dirname, "geoportal_app/"),

        // http://127.0.0.1/<publicPath>/ - where files are served from
        publicPath: "/",

        filename: 'static/dist_dev/[name]/[chunkhash].js',
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
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
           '@': path.resolve(__dirname, 'frontend/bundle/src/'),
           '@utils': path.resolve(__dirname, 'src/components/'),
           '@helpComp': path.resolve(__dirname, 'src/BackAndFront/'),
           '@helpUtils': path.resolve(__dirname, 'src/utils/'),
        }
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest',
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
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true,
            cleanOnceBeforeBuildPatterns: ['static/dist_dev/**/*'],
        }),
        hhwp({
            chunks: ['backend/webapp'],
            filename: path.resolve(__dirname, 'backend/webapp/templates/backend/webapp.dev.html'),
        }),
        hhwp({
            chunks: ['frontend/bundle'],
            filename: path.resolve(__dirname, 'frontend/bundle/templates/bundle/detail.dev.html'),
        }),
        hhwp({
            chunks: ['frontend/mobile'],
            filename: path.resolve(__dirname, 'frontend/mobile/templates/mobile/detail.dev.html'),
        }),
        hhwp({
            chunks: ['frontend/payment'],
            filename: path.resolve(__dirname, 'frontend/payment/templates/payment/index.dev.html'),
        }),
        hhwp({
            chunks: ['frontend/open_layer'],
            filename: path.resolve(__dirname, 'frontend/open_layer/templates/open_layer/index.dev.html'),
        }),
        hhwp({
            chunks: ['frontend/profile'],
            filename: path.resolve(__dirname, 'frontend/profile/templates/profile/index.dev.html'),
        }),
        hhwp({
            chunks: ['govorg/frontend'],
            filename: path.resolve(__dirname, 'govorg/backend/org/templates/org/index.dev.html'),
        }),
        hhwp({
            chunks: ['llc/frontend'],
            filename: path.resolve(__dirname, 'llc/backend/llc_conf/templates/llc/index.dev.html'),
        }),
        new WebpackBuildNotifierPlugin({
            title: "Geoportal DEV",
            logo: path.resolve("./geoportal_app/static/assets/favicon.ico"),
            successSound: true,
            showDuration: true,
        }),
    ],
}
