const glob = require('glob')
const path = require('path')
const { sep } = path
/**
 * router-schema loader
 * @param {object} app koa实例 
 * 
 * 通过'json-schema & ajv'对API规则进行约束，配合api-params-verify中间件使用
 * 
 * app/router-schema/**.js
 * 输出：
 * app.routeSchema ={
 * `${api1}`:${jsonSchema}
 * `${api2}`:${jsonSchema}
 * `${api3}`:${jsonSchema}
 * `${api4}`:${jsonSchema}
 * }
 */
module.exports = (app) => {
    let routerSchema = {};

    //读取 elpis/app/router-schema/**/** .js下所有文件
    const elpisRouterSchemaPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router-schema`)
    const elpisFileList = glob.sync(path.resolve(elpisRouterSchemaPath, `.${sep}**${sep}**.js`))
    elpisFileList.forEach(file => {
        handleFile(file)
    })
    //读取 业务/app/router-schema/**/** .js下所有文件
    const businessRouterSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`)
    const businessFileList = glob.sync(path.resolve(businessRouterSchemaPath, `.${sep}**${sep}**.js`))
    businessFileList.forEach(file => {
        handleFile(file)
    })
    //注册所有 routerSchema，使得可以'app.routerSchema'这样访问

    function handleFile(file){
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
    }
    
    
    
    app.routerSchema = routerSchema
}