module.exports = {
    name: '拼多多',
    desc: '拼多多电商系统',
    homePage: '/todo?proj_key=pdd&key=product',
    menu: [
        {
            key: 'product',
            name: '商品管理(拼多多)',
        },
        {
            key: 'client',
            name: '客户管理(拼多多)',
        },
        {
            key: 'data',
            name: '数据分析',
            menuType: 'module',
            moduleType: 'sider',
            siderConfig: {
                menu: [{
                    key: 'analysis',
                    name: '电商罗盘',
                    menuType: 'module',
                    moduleType: 'custom',
                    customConfig: {
                        path: '/todo',
                    }
                },
                {
                    key: 'sider-search',
                    name: '信息查询',
                    menuType: 'module',
                    moduleType: 'iframe',
                    iframeConfig: {
                        path: 'https://www.baidu.com',
                    }
                }]
            }
        },
        {
            key: 'search',
            name: '信息查询',
            menuType: 'module',
            moduleType: 'iframe',
            iframeConfig: {
                path: 'https://www.baidu.com',
            }
        }
    ]
}