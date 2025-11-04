module.exports = (app) => {
    const BaseController = require('./base')(app)
    return class ProjectController extends BaseController {
        /**
         * 获取项目列表
         * @param {Object} ctx 上下文 
         */
        async getList(ctx) {
            const { proj_key: projKey } = ctx.request.query
            console.log(projKey, '~~~~~~~~~');

            const { project: projectService } = app.service
            const projectList = await projectService.getList();
            // const a = projectList.a.b.c            
            this.success(ctx, projectList)
        }
    }
}