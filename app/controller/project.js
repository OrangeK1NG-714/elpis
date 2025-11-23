module.exports = (app) => {
    const BaseController = require('./base')(app)
    return class ProjectController extends BaseController {
        /**
         * 获取所有模型与项目的结构化数据
         */
        async getModelList(ctx) {
            const { project: projectService } = app.service
            const modelList = await projectService.getModelList();

            //构造返回结果，只返回关键数据
            const dtoModelList = modelList.reduce((preList, item) => {
                const { model, project } = item;

                //构造model 关键数据
                const { key, name, desc } = model;
                const dtoModel = {
                    key, name, desc
                }

                //构造project关键数据
                const dtoProject = {};
                for (const projKey in project) {
                    const { key, name, desc, homePage } = project[projKey];
                    dtoProject[projKey] = {
                        key, name, desc, homePage
                    }
                }

                preList.push({
                    model: dtoModel,
                    project: dtoProject
                })

                return preList
            }, [])

            this.success(ctx, dtoModelList)
        }
    }
}