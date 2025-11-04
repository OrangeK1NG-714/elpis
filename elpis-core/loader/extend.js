const glob = require('glob')
const path = require('path')
const { sep } = path
/**
 * extend loader
 * @param {object} app Koa实例
 * 
 * 加载所有extend 通过 ‘app.extend${文件}’ 来访问 
 * 
 * 例如：
 * app/extend
 * |  
 * |---custom-extend.js
 * =>app.extend.customExtend
 */
module.exports = (app) => {
    //读取 app/extend/** .js下所有文件
    const extendPath = path.resolve(app.businessPath, `.${sep}extend`)
    const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}**.js`))

    //遍历所有文件目录，把内容加载在app.extend下
    fileList.forEach((file) => {
        //提取文件名称
        let name = path.resolve(file);
        //截取路径app/extend/custom-extend.js=>custom-extend
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf(`.`))  

        //把路径中的-改为驼峰式custom-extend =>customExtend
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())
        //过滤app已经存在的key
        for(const key in app){
            if(key ===name){
                console.log(`extend ${name} already exists in app`);
                return;
            }
        }
        //挂载extend到app上
        app[name] = require(path.resolve(file))(app)
    })
}