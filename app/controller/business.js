module.exports = (app) => {
    const sleep = async (time) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    const baseController = require('./base')(app)
    return class BusinessController extends baseController {
        async create(ctx) {
            await sleep(500)
            const {
                product_name: productName,
                price,
                inventory,
            } = ctx.request.body
            this.success(ctx, {
                product_id: Date.now(),
                product_name: productName,
                price,
                inventory,
            })
        }
        async update(ctx) {
            await sleep(500)
            const {
                product_id: productId,
                product_name: productName,
                price,
                inventory,
            } = ctx.request.body
            this.success(ctx, {
                product_id: productId,
                product_name: productName,
                price,
                inventory,
            })
        }
        async remove(ctx) {
            await sleep(500)
            const { product_id: productId } = ctx.request.body
            this.success(ctx, {
                projKey: ctx.projKey,
                product_id: productId,
            })
        }
        async get(ctx) {
            const { product_id: productId } = ctx.request.query

            const productList = this.getProductList(ctx)
            const productItem = productList.find(item => item.product_id === productId)
            if (!productItem) {
                this.fail(ctx, '商品不存在')
                return
            }
            this.success(ctx, productItem)
        }
        async getList(ctx) {
            await sleep(500)
            const { product_name: productName, page, size } = ctx.request.query
            let productList = this.getProductList(ctx)

            if (productName && productName !== 'all') {
                productList = productList.filter(item => item.product_name === productName)
            }

            this.success(ctx, productList, {
                total: 3,
                page,
                size
            })
        }

        getProductEnumList(ctx) {
            this.success(ctx, [
                {
                    label: `全部`,
                    value: `all`,
                },
                {
                    label: `${ctx.projKey} - <大前端面试宝典>`,
                    value: `${ctx.projKey} - <大前端面试宝典>`,
                },
                {
                    label: `${ctx.projKey} - <前段求职之道>`,
                    value: `${ctx.projKey} - <前段求职之道>`,
                },
                {
                    label: `${ctx.projKey} - <大前端全栈实践>`,
                    value: `${ctx.projKey} - <大前端全栈实践>`,
                },
            ])
        }
        getProductList(ctx) {
            return [{
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
            }]
        }

    }
}