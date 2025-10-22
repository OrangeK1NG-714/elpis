const path = require('path')
const { sep } = path;

/**
 * 加载config loader
 * @param {object} app Koa实例
 * 
 *  配置区分 本地/测试/生产,通过env 环境读取不同文件配置env.config
 * 通过env.config 覆盖default.config 加载到app.config中

 * 目录下对应的config配置
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.beta.js
 * 生产配置 config/config.prod.js
 */
module.exports = (app) => {
    //找到config/目录
    const configPath = path.resolve(app.baseDir, `.${sep}config`)

    console.log(configPath, 'configPath');

    //获取default.config
    let defaultConfig = {};
    try {
        defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`))
    } catch (e) {
        console.log('default-config not found')
    }
    console.log(defaultConfig, 'defaultConfig');
    //获取env.config
    let envConfig = {}
    try {
        if (app.env.isLocal())//本地环境
        {
            envConfig = require(path.resolve(configPath, `.${sep}config.local.js`))
            console.log('local-config found');
        }
        if (app.env.isBeta())//测试环境
        {
            envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`))
            console.log('beta-config found');
        }
        if (app.env.isProd())//生产环境
        {
            envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`))
            console.log('prod-config found');
        }
    } catch (e) {
        console.log('env-config not found')
    }
    console.log(envConfig, 'envConfig');

    //覆盖并加载config配置
    app.config = Object.assign({}, defaultConfig, envConfig)
}