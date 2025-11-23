const Koa = require('koa')
const path = require('path')
const { sep } = path;//兼容不同操作系统上的斜杠

const env = require('./env')

const middlewareLoader = require('./loader/middleware')
const routerSchemaLoader = require('./loader/router-schema')
const configLoader = require('./loader/config')
const controllerLoader = require('./loader/controller')
const extendLoader = require('./loader/extend')
const routerLoader = require('./loader/router')
const serviceLoader = require('./loader/service')


module.exports = {
    /**
     * 启动Elpis服务
     * @param  options - 项目配置
     * options ={
     *  name:'elpis',//项目名称
     *  homePage:'/xxx',//项目首页路径
     * }
     */
    start(options = {}) {
        //koa实例
        const app = new Koa();
        // console.log(process.env._ENV, 'app.env');
        // console.log(process.cwd(), 'process.cwd');
        
        //应用配置
        app.options = options;
        // console.log(app.options);

        //基础路径
        app.baseDir = process.cwd();
        // console.log(app.baseDir);

        //业务文件路径
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
        // console.log(app.businessPath);

        //初始化环境配置
        app.env = env();

        //加载middleware
        middlewareLoader(app)
        // console.log(app.middlewares);

        //加载routerSchema
        routerSchemaLoader(app)
        // console.log(app.routerSchema);

        //加载controller
        controllerLoader(app)
        // console.log(app.controller);

        //加载service
        serviceLoader(app)
        // console.log(app.service);

        //加载config
        configLoader(app)
        // console.log(app.config);

        //加载extend
        extendLoader(app)
        // console.log(app);

        // console.log(app.extend);
        //注册全局中间件
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app)
            console.log('注册全局中间件成功');
        } catch (e) {
            console.log('注册全局中间件失败');
        }
        //注册路由
        routerLoader(app)
        // console.log(app.router);

        try {
            const port = process.env.PORT || 8080;
            const host = process.env.IP || '0.0.0.0';
            app.listen(port, host);
            console.log(`server is running at http://${host}:${port}`);
        } catch (error) {
            console.log(error);
        }
        return app;
    }
}
