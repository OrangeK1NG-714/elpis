{
    model: 'dashboard',//模版类型,不同模版类型对应不一样的模版数据结构
    name: '',//名称
    desc:'',//描述
    icon:'',//图标
    homePage:'',//首页(项目配置
        //头部菜单
    menu: [{
            key: '',//菜单唯一描述
            name: '',//菜单名称
            menuType: '',// 枚举值, group /module
            //当menuType==group时，可填
            subMenu: [{
                // 可递归 menuType
            }, ...],
            //当menuType==module时，可填
            moduleType: '',//枚举值： sider/iframe/custom/schema

            //当moduleType==sider时，可填
            siderConfig: {//侧边栏配置
                menu: [{
                    //可递归 menuItem（除 moduleType==sider）
                }, ...]
            },


            //当moduleType==iframe时，可填
            iframeConfig: {
                path: '',//iframe路径
            },

            //当moduleType==custom时，可填
            customConfig: {
                path: '',//自定义路由路径
            },

            //当moduleType==schema时，可填
            schemaConfig: {
                api: '',//数据源API（遵循RESTful 规范）
                schema: {//板块数据结构
                    type: 'object',
                    properties: {
                        key: {
                            ...schema,//标准schema 配置
                            type: '',//字段类型
                            label: ''//字段的中文名
                        },
                        ...
                    }
                },
                tableConfig: {},//table 相关配置
                searchConfig: {},//search-bar 相关配置
                components: {}//模块组件
            },
        }, ...]
}