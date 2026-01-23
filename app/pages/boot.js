import { createApp } from "vue";
//引入elementUI
import ElementUI from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'

import './assets/custom.css'

//引入 pinia
import pinia from '$store'

import { createRouter, createWebHistory } from "vue-router";

/**
 * vue 页面主入口，用于启动 vue
 * @params pageComponent vue 入口组件
 * @params routes 路由列表
 * @params libs 页面依赖的第三方包
 */
export default (pageComponent, { routes, libs } = {}) => {
    const app = createApp(pageComponent);

    //应用 ElementUI
    app.use(ElementUI);

    //引入 pinia
    app.use(pinia);
    //引入第三方包
    if (libs && libs.length) {
        for (let i = 0; i < libs.length; i++) {
            app.use(libs[i]);
        }
    }

    if (routes && routes.length) {
        //引入页面路由
        const router = createRouter({
            history: createWebHistory(),//采用history模式
            routes,
        })
        //应用路由
        app.use(router);
        router.isReady().then(() => {
            app.mount('#root');
        })
    } else {
        app.mount('#root');
    }

}