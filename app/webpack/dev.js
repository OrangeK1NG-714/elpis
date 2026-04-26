//本地开发启动 devServer
const express = require('express');
const path = require('path');
const consoler = require('consoler');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = () => {

    //从webpack.dev.js 获取 webpack 配置 和devServer 配置
    const { webpackConfig, DEV_SERVER_CONFIG } = require('./config/webpack.dev.js');

    console.log('xxxxx',webpackConfig);
    
    const app = express();

    const compiler = webpack(webpackConfig);

    //静态文件目录
    app.use(express.static(path.join(__dirname, '../public/dist')));

    //引入 devMiddleware 中间件（监控文件改动）
    app.use(devMiddleware(compiler, {
        //落地文件 （不用打包到内存）
        writeToDisk: (filePath) => filePath.endsWith('.tpl'),

        //资源路径
        publicPath: webpackConfig.output.publicPath,

        //headers配置
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Authorization'
        },
        //有颜色输出
        stats: {
            colors: true
        }
    }));
    //引入 hotMiddleware 中间件 （实现热更新通讯）
    app.use(hotMiddleware(compiler, {
        path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
        log: () => { },
    }))


    consoler.info('请等待webpack初次构建完成提示...');

    //启动 devServer
    const port = DEV_SERVER_CONFIG.PORT;
    app.listen(port, () => {
        console.log(`devServer 启动成功，监听端口：${port}`);
    })
}