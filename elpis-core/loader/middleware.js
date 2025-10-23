const glob = require('glob')
const path = require('path')
const {sep} = path
/**
 * 加载middleware
 * @param {object} app Koa实例
 * 
 * 加载所有middleware 通过 ‘app.middleware.${目录}.${文件}’ 来访问 
 * 
 * 例如：
 * app/middleware
 * |
 * | ---custom-module
 *         |  
 *         |---custom-middleware.js
 * =>app.middlewares.customModule.customMiddleware
 */
module.exports = (app) => { 
    //读取 app/middleware/**/** .js下所有文件
    const middlewarePath = path.resolve(app.businessPath,`.${sep}middleware`)
    const fileList = glob.sync(path.resolve(middlewarePath,`.${sep}**${sep}**.js`))

    //遍历所有文件目录，把内容加载在app.middleware下
    const middlewares ={}
    fileList.forEach((file)=>{
        //提取文件名称
        let name = path.resolve(file);
        //截取路径app/middleware/custom-module/custom-middleware.js=>custom-module/custom-middleware
        name = name.substring(name.lastIndexOf(`middleware${sep}`)+`middleware${sep}`.length,name.lastIndexOf(`.`))
        
        //把路径中的'-‘改为驼峰式custom-middleware.js=>customModule.customMiddleware
        name = name.replace(/[_-][a-z]/ig,(s)=>s.substring(1).toUpperCase())
        //挂载middleware到内存app对象中
        let tempMiddleware = middlewares;
        const names = name.split(sep)
        for(let i =0,len = names.length; i<len;++i){
            if(i===len-1){
                tempMiddleware[names[i]] =require(path.resolve(file))(app)
            }else{
                if(!tempMiddleware[names[i]]){
                    tempMiddleware[names[i]] = {}
                }
                tempMiddleware = tempMiddleware[names[i]]
            }
        }        
    })
    app.middlewares = middlewares
}