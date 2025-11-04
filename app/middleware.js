const path = require('path');

module.exports =(app)=>{
    //配置静态根目录
    const koaStatic = require('koa-static')
    app.use(koaStatic(path.resolve(process.cwd(),'./app/public')))

    //模版渲染引擎
    const koaNunjucks = require('koa-nunjucks-2');
    app.use(koaNunjucks({
        ext:'tpl',
        path:path.resolve(process.cwd(), 'app/public'),
        nunjucksConfig:{
            noCache: true,
            trimBlocks: true,
        }
    }))
    console.log('模版渲染引擎已加载');
    //引入ctx.body解析中间件
    const bodyParser = require('koa-bodyparser')
    app.use(bodyParser({
        formLimit:'1000mb',
        enableTypes:['json', 'form', 'text'],
    }))

    //引入异常捕获中间件
    app.use(app.middlewares.errorHandler)

    //签名合法性校验
    app.use(app.middlewares.apiSignVerify)

    //引入API参数校验
    app.use(app.middlewares.apiParamsVerify)
}