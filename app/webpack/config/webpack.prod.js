const path = require('path');
const merge = require('webpack-merge');
const os = require('os');
// const HappyPack = require('happypack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');

const TerserPlugin = require('terser-webpack-plugin');

// //多线程 build 设置 
// const happypackCommonConfig = {
//     debug: false,
//     threadPool: HappyPack.ThreadPool({
//         size: os.cpus().length
//     }),
// }

//基类配置
const baseConfig = require('./webpack.base.js');

//生产环境 webpack配置
const webpackConfig = merge.smart(baseConfig, {
    //指定生产环境
    mode: 'production',

    //生产环境的output配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod/'),
        publicPath: '/dist/prod/',
        crossOriginLoading: 'anonymous',
    },

    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: require.resolve('thread-loader'),
                    options:{
                        workers: os.cpus().length,//根据 cpu 核心数设置线程数
                        workerParallelJobs: 1,//每个线程并行处理的任务数
                        poolTimeout: 2000,//线程池超时时间，单位毫秒
                    }
                },
                require.resolve('css-loader'),
            ]
        }, {
            test: /\.js$/,
            include: [
                //只对业务代码进行 babel，加快webpack打包速度
                path.resolve(__dirname, '../../pages/'),
            ],
            use: [
               {
                loader: require.resolve('thread-loader'),
                options:{
                    workers: os.cpus().length,//根据 cpu 核心数设置线程数
                    workerParallelJobs: 50,//每个线程并行处理的任务数
                    poolTimeout: 2000,//线程池超时时间，单位毫秒
                }
               }
               ,{
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [require.resolve('@babel/preset-env')],
                    plugins: [
                        require.resolve('@babel/plugin-transform-runtime')
                    ]
                }
               }
            ]
        },
        ]
    },
    //webpack 不会有大量 hints 信息，默认为 warning
    performance: {
        hints: false,
    },
    plugins: [
        //每次build前。清空 public/dist 目录
        new CleanWebpackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/'),
            exclude: [],
            verbose: true,
            dry: false,
        }),
        //提取 css 的公共部分，有效利用缓存，（非公共部分使用 inline）
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css',

        }),
        //优化并压缩 css 资源
        new CSSMinimizerPlugin(),

        // //多线程打包 JS,加快打包速度
        // new HappyPack({
        //     ...happypackCommonConfig,
        //     id: 'js',
        //     loaders: [`${require.resolve('babel-loader')}?${JSON.stringify({
        //         presets: [require.resolve('@babel/preset-env')],
        //         plugins: [
        //             require.resolve('@babel/plugin-transform-runtime')
        //         ]
        //     })}`],
        // }),
        // //多线程打包 CSS，加快打包速度
        // new HappyPack({
        //     ...happypackCommonConfig,
        //     id: 'css',
        //     loaders: [{
        //         path: require.resolve('css-loader'),
        //         options: {
        //             importLoaders: 1,
        //         }
        //     }],
        // }),
        //浏览器在请求资源时不发送用户的身份凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossorigin: 'anonymous',
        })
    ],
    optimization: {
        //使用 TerserPlugin 的并发和缓存，提升压缩阶段的性能
        //清除console.log
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true, //启用缓存来加速构建过程
                parallel: true, //利用多核CPU 的优势来加快压缩速度
                terserOptions: {
                    compress: {
                        drop_console: true,//去掉console.log的内容
                    }
                }
            })
        ]
    }
})
module.exports = webpackConfig;