const path = require('path');

module.exports =(app)=>{
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
    
}