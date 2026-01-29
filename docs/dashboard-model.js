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
                            label: '',//字段的中文名
                            // 字段在table 中的相关配置
                            tableOption:{
                                ...elTableColumnConfig,// 标准el-table-column 配置
                                toFixed: 0,// 保留小数点后几位
                                visible: true, // 默认为true (false或不配置时，标识不在表单中显示)
                            },
                            searchOption:{
                                ...elComponentConfig,//标准el-component-column 配置
                                comType:'',//配置组件类型 input/select/...
                                default:'',//默认值

                                // comType === 'select
                                enumList:[],// 下拉框可选项

                                // comType === 'dynamicSelect'
                                api: '',
                            },
                            // 字段在不同动态 component 中的相关配置，前缀对应 componentConfig 中的键值
                            // 如：componentConfig.createForm, 这里对应createFormOption
                            // 字段在 createForm 中相关配置
                            createFormOption:{
                                ...eleComponentConfig, //标准 el-component-column 配置
                                comType: '', // 控件类型 input/select/input-number
                                visible: true,// 是否展示(true/false)，默认为true
                                disabled: false, // 是否禁用(true/false),默认为false
                                default: '', // 默认值

                                // comType === 'select' 时生效
                                enumList: [], //枚举列表
                            }
                        },
                        ...
                    },
                    required: [], //标记哪些字段是必填项
                },
                tableConfig: {
                    headerButtons: [{
                        label:'',//中文名
                        eventKey:'',// 按钮事件名
                        //按钮事件具体配置
                        eventOption:{
                            // 当eventKey === 'showComponent'
                            comName:'',// 组件名称
                        },
                        ...elButtonConfig //标准的 el-button 配置
                    }, ...],
                    rowButtons: [{
                        label: '',// 按钮中文名
                        eventKey: '', // 按钮事件名
                        eventOption: {
                            // 当eventKey === 'showComponent'
                            comName:'',// 组件名称

                            // 当 eventKey === 'remove'
                            params:{
                                // paramKey= 参数的键值
                                // rowValue = 参数值 (当格式为 schema::tableKey 的时候，到 table 中找相应的字段) 
                                paramKey: rowValueKey
                            }
                        } ,//按钮事件具体配置
                        ...elButtonConfig //标准的 el-button 配置
                    }, ...]
                },//table 相关配置

                //search-bar 相关配置
                searchConfig: {},
                // 动态组件 相关配置
                componentConfig: {
                   // create-form 表单相关配置
                   createForm:{
                    title:'',//表单标题
                    saveBtnText:'',// 保存按钮文案 
                   }
                   // ...支持用户动态扩展

                }
            },
        }, ...]
}