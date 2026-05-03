const KoaRouter = require('koa-router')
const glob = require('glob')
const path = require('path')
const { sep } = path
/**
 * router loader
 * @param {object} app Koa实例
 * 
 * 解析所有app/router/**.js 下的文件，加载到KoaRouter下
 */
module.exports = (app) => {
    //实例化KoaRouter
    const router = new KoaRouter()

    //找到elpis路由文件路径
    const elpisRouterPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router`)
    //注册所有elpis路由
    const elpisFileList = glob.sync(path.resolve(elpisRouterPath, `.${sep}**${sep}**.js`))
    elpisFileList.forEach((file) => {
        require(path.resolve(file))(app, router)
    })
    
    //找到业务路由文件路径
    const businessRouterPath = path.resolve(app.businessPath, `.${sep}router`)
    //注册所有业务路由
    const businessFileList = glob.sync(path.resolve(businessRouterPath, `.${sep}**${sep}**.js`))
    businessFileList.forEach((file) => {
        require(path.resolve(file))(app, router)
    })
    //路由兜底(健壮性)
    router.get('*', async (ctx, next) => {
        ctx.status = 302//临时重定向
        ctx.redirect(`${app?.options?.homePage ?? '/'}`)
    })
    //路由注册到app上
    app.use(router.routes())
    app.use(router.allowedMethods())
}