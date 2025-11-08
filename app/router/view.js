module.exports = (app, router) => {
    const { view: ViewController } = app.controller
    // console.log(ViewController.renderPage,8888);    
    //  console.log(ViewController.renderPage.bind(ViewController));  
    //用户输入 http://ip:port/view/xxxx 就能渲染出对应的页面 
    router.get('/view/:page',ViewController.renderPage.bind(ViewController))
     

}