module.exports = (app) => {
    const baseController = require('./base')(app)
    return class BusinessController extends baseController {
        remove(ctx) {
            const { product_id: productId } = ctx.request.body
            this.success(ctx, {
                projKey:ctx.projKey,
                product_id: productId,
            })
        }
        getList(ctx) {
            const { page, size } = ctx.request.query
            
            this.success(ctx, [{
                product_id: '1',
                product_name: `${ctx.projKey} - <大前端面试宝典>`,
                price: 39.9,
                inventory: 99999,
                create_time: '2026-01-20 17:02:00',
            }, {
                product_id: '2',
                product_name: `${ctx.projKey} - <前段求职之道>`,
                price: 199,
                inventory: 100000,
                create_time: '2026-01-20 17:03:00',
            }, {
                product_id: '3',
                product_name: `${ctx.projKey} - <大前端全栈实践>`,
                price: 699,
                inventory: 1898998,
                create_time: '2026-01-20 17:04:00',
            }
            ], {
                total: 3,
                page,
                size,
            })
        }
    }
}