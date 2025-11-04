module.exports = (app) => class BaseController {
    /**
     * controller 基类
     * 统一收拢 controller 相关的公共方法
     */
    constructor() {
        this.app = app
        this.config = app.config
        // this.service = app.service
    }

    /**
     * API处理成功时统一返回结构
     * @param {Object} ctx 上下文
     * @param {Object} data 核心数据    
     * @param {Object} metadata 附加数据
     */
    success(ctx, data = {}, metadata = {}) {
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: data,
            metadata: metadata
        }
    }

    /**
     * API处理失败时统一返回结构
     * @param {Object} ctx 上下文
     * @param {String} message 错误信息    
     * @param {Number} code 错误码
     */
    fail(ctx, message , code) {
        // ctx.status = 400;
        ctx.body = {
            success: false,
            message: message,
            code: code
        }
    }
}