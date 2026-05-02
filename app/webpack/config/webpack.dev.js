const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

//基类配置
const baseConfig = require('./webpack.base.js');

// devServer 配置
const DEV_SERVER_CONFIG = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH: '__webpack_hmr',//官方规定
    TIMEOUT: 20000,
}

//开发阶段的 entry 配置需要加入 hmr
Object.keys(baseConfig.entry).forEach((v) => {
    // 第三方不作为 hmr 入口
    if (v !== 'vender') {
        baseConfig.entry[v] = [
            //主入口文件
            baseConfig.entry[v],
            //hmr 更新入口，官方指定的 hmr 路径
            `${require.resolve('webpack-hot-middleware/client')}?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`
        ]
    }
})

//生产环境 webpack配置
const webpackConfig = merge.smart(baseConfig, {
    //指定生产环境
    mode: 'development',

    //source-map 开发工具，呈现代码的映射关系，便于在开发过程中调试代码
    devtool: 'eval-cheap-module-source-map',

    //生产环境的output配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.resolve(process.cwd(), './app/public/dist/dev/'), //输出文件存储路径
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev`,//外部资源公共路径
        globalObject: 'this'
    },
    //开发阶段插件
    plugins: [
        // HotModuleReplacementPlugin 用于实现热模块替换 （HMR）
        // 模块热替换允许在应用程序运行时替换模块
        // 极大的提升开发效率，因为能让应用程序一直保持运行状态
        new webpack.HotModuleReplacementPlugin({
            //开启多步模式
            multiStep: true
        })
    ]
})
module.exports = {
    //webpack配置
    webpackConfig,
    //devServer配置，暴露给dev.js使用
    DEV_SERVER_CONFIG
};