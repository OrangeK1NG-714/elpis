module.exports = (app, router) => {
    const { business: businessController } = app.controller
    
    router.delete('/api/proj/product', businessController.remove.bind(businessController))
    
    router.get('/api/proj/product/list', businessController.getList.bind(businessController))

    router.get('/api/proj/product_enum/list', businessController.getProductEnumList.bind(businessController))

}