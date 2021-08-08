module.exports = {
    devtool: '#eval-source-map',
    context: __dirname,
    entry: "./index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    watch: true,

    node: { fs: 'empty' },
    externals: [
        { './cptable': 'var cptable' },
        { './jszip': 'jszip' }
    ],
    module: {


                rules: [
                    {

                        test: /\.js$/,
                        exclude: /(node_modules)/,
                        use: {
                             
                loader: 'url-loader',
                options: {
                    esModule: false,
                },

                            loader: "babel-loader",
                            options: {

                                presets: ['@babel/preset-env', '@babel/preset-react'],
                                plugins: [[
                                    "@babel/plugin-proposal-class-properties"
                                ]
                                ]
                            }


                        }

            },
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },

            { test: /\.scss$/i, use: ['style-loader', 'css-loader'] },

            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: 'url-loader?limit=100000',
                options: {
                    esModule: false,
                }
            }
         
                ]

            }
}
vendor: [
    'xlsx',
    'file-saver'
]
