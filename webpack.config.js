const Webpack = require('webpack');
//pathの読み込み
const path = require("path");
//mini-css-extract-plugin の読み込み
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 本番環境のときはsourcemapを出力させない設定
const enabledSourceMap = process.env.NODE_ENV !== "production";
const { VueLoaderPlugin } = require('vue-loader');

module.exports = env => {

    const mode = env.hasOwnProperty('WEBPACK_BUILD') ? 'production' : 'development';

    return {

        entry: path.resolve(__dirname, "_src/index.js"),

        // ファイルの出力設定
        output: {
            //  出力ファイルのディレクトリ名
            path: path.resolve(__dirname, "deploy/"),
            // 出力ファイル名
            filename: `js/script.js`
        },

        // ローカル開発用環境を立ち上げる
        // 実行時にブラウザが自動的に localhost を開く
        devServer: {
            static: {
                directory: path.resolve(__dirname, 'deploy/'),
            },
            open: true,
            hot: true,
            port: 3000,
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-env'
                                ]
                            }
                        }
                    ],
                    exclude: /node_modules/,
                },

                // vueファイルの読み込みとコンパイル
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },

                // Sassファイルの読み込みとコンパイル
                {
                    // 対象となるファイルの拡張子(scssかsassかcss)
                    test: /\.(sa|sc|c)ss$/,
                    // Sassファイルの読み込みとコンパイル
                    use: [
                        // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
                        MiniCssExtractPlugin.loader,

                        // CSSをバンドルするためのローダー
                        {
                            loader: "css-loader",
                            options: {
                                // CSS内のurl()メソッドの取り込みを禁止
                                url: false,
                                // production モードでなければソースマップを有効に
                                sourceMap: enabledSourceMap,
                                // postcss-loader と sass-loader の場合は2を指定
                                importLoaders: 2
                                // 0 => no loaders (default);
                                // 1 => postcss-loader;
                                // 2 => postcss-loader, sass-loader
                            }
                        },
                        // PostCSS（autoprefixer）の設定
                        {
                            loader: "postcss-loader",
                            options: {
                                // production モードでなければソースマップを有効に
                                sourceMap: enabledSourceMap,
                                postcssOptions: {
                                    // ベンダープレフィックスを自動付与
                                    plugins: [require("autoprefixer")({ grid: true })]
                                }
                            }
                        },
                        // Sass を CSS へ変換するローダー
                        {
                            loader: "sass-loader",
                            options: {
                                // dart-sass を優先
                                implementation: require("sass"),
                                //  production モードでなければソースマップを有効に
                                sourceMap: enabledSourceMap
                            }
                        }
                    ]
                }
            ]
        },
        // ES5(IE11等)向けの指定（webpack 5以上で必要）
        target: ["web", "es5"],
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm-bundler.js',
                extensions: [ '.ts', '.js', '.vue', '.json' ]
            },
        },
        plugins: [
            new Webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: true }),
            new MiniCssExtractPlugin({
                // SASSのコンパイル後のファイル名を設定
                filename: `css/style.css`
            }),
            new VueLoaderPlugin(),
        ]
    }
}