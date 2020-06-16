const path = require('path')


module.exports = {
    mode: "development",
    entry: {
        'webapp': [
            'babel-polyfill',
            path.resolve(__dirname, 'src/index.js'),
        ],
    },
    output: {
        // options related to how webpack emits results

        // where compiled files go
        path: path.resolve(__dirname, "static/assets/js/backend/"),

        // http://127.0.0.1/<publicPath>/ - where files are served from
        publicPath: "/static/assets/js/backend/",
        filename: '[name].js',  // the same one we import in index.html
    },
    module: {
        // configuration regarding modules
        rules: [
            {
                // regex test for js and jsx files
                test: /\.(js|jsx)?$/,
                include: path.resolve(__dirname, 'src/'),
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
    devtool: "inline-source-map",
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
}
