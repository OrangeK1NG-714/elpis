const glob = require('glob')
const path = require('path')
const { sep } = path
/**
 * 加载controller
 * @param {object} app Koa实例
 * 
 * 加载所有service 通过 ‘app.service.${目录}.${文件}’ 来访问 
 * 
 * 例如：
 * app/service
 * |
 * | ---custom-module
 *         |  
 *         |---custom-service.js
 * =>app.service.customModule.customService
 */
module.exports = (app) => {
    //读取 app/service/**/** .js下所有文件
    const servicePath = path.resolve(app.businessPath, `.${sep}service`)                    
    const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`))

    //遍历所有文件目录，把内容加载在app.service下
    const service = {}
    fileList.forEach((file) => {
        //提取文件名称
        let name = path.resolve(file);
        //截取路径app/service/custom-module/custom-service.js=>custom-module/custom-service
        name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf(`.`))

        //把路径中的-改为驼峰式custom-module/custom-service =>customModule.customService
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())

        //挂载service到内存app对象中
        let tempService = service;
        const names = name.split(sep)
        for (let i = 0, len = names.length; i < len; ++i) {
            if (i === len - 1) {
                const ServiceModule = require(path.resolve(file))(app)
                tempService[names[i]] =new ServiceModule()
            } else {
                if (!tempService[names[i]]) {
                    tempService[names[i]] = {}
                }
                tempService = tempService[names[i]]
            }
        }
    })
    app.service = service
}