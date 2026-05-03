const glob = require('glob')
const path = require('path')
const { sep } = path
/**
 * 加载controller
 * @param {object} app Koa实例
 * 
 * 加载所有controller 通过 ‘app.controller.${目录}.${文件}’ 来访问 
 * 
 * 例如：
 * app/controller
 * |
 * | ---custom-module
 *         |  
 *         |---custom-controller.js
 * =>app.controller.customModule.customController
 */
module.exports = (app) => {
    const controller = {}
    //读取 elpis/app/controller/**/** .js下所有文件
    const elpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}controller`)
    const elpisFileList = glob.sync(path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`))
    elpisFileList.forEach(file =>{
        handleFile(file)
    })
    
    //读取 业务/app/controller/**/** .js下所有文件
    const businessControllerPath = path.resolve(app.businessPath, `.${sep}controller`)
    const businessFileList = glob.sync(path.resolve(businessControllerPath, `.${sep}**${sep}**.js`))
    businessFileList.forEach(file =>{
        handleFile(file)
    })
    
    //把内容加载在app.controller下
    function handleFile(file) {
        //提取文件名称
        let name = path.resolve(file);
        //截取路径app/controller/custom-module/custom-controller.js=>custom-module/custom-controller
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf(`.`))

        //把路径中的-改为驼峰式custom-module/custom-controller =>customModule.customController
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())
        console.log(name, 'name');

        //挂载controller到内存app对象中
        let tempController = controller;
        const names = name.split(sep)
        // console.log(names[0],'names');

        for (let i = 0, len = names.length; i < len; ++i) {
            if (i === len - 1) {
                const ControllerModule = require(path.resolve(file))(app)
                // console.log(ControllerModule,'ControllerModule');
                tempController[names[i]] = new ControllerModule()
            } else {
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {}
                }
                tempController = tempController[name[i]]
            }
        }
    }
    // console.log(controller,'controller已加载123131');

    app.controller = controller
}