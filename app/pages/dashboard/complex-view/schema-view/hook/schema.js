import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu.js'
export const useSchema = () => {
    const route = useRoute()
    const menuStore = useMenuStore()

    const api = ref('')
    const tableSchema = ref({})
    const tableConfig = ref({})

    //构造 schemaConfig 相关配置，输送给 schemaView 解释
    const buildData = () => {
        const { key, sider_key: siderKey } = route.query
        const mItem = menuStore.findMenuItem({
            key: 'key',
            value: siderKey ?? key
        })
        if (mItem && mItem.schemaConfig) {
            const { schemaConfig: sConfig } = mItem

            const configSchema = JSON.parse(JSON.stringify(sConfig.schema))

            api.value = sConfig.api ?? ''
            tableSchema.value = {}
            tableConfig.value = undefined
            nextTick(() => {
                tableSchema.value = buildDtoSchema(configSchema, 'table')                
                tableConfig.value = sConfig.schema.tableConfig//存在问题                
            })
        }
    }
    // 通用构建 schema 方法 (消除噪音)
    const buildDtoSchema = (_schema, comName) => {
        if (!_schema?.properties) { return {} }
        const dtoSchema = {
            type: 'object',
            properties: {}
        }
        //提取有效schema字段信息
        for (const key in _schema.properties) {
            const props = _schema.properties[key]
            // tableOption searchBarOption formOption
            if (props[`${comName}Option`]) {
                let dtoProps = {}
                // 提取 props 中非 option 的部分，存放到 dtoProps 中
                for (const pKey in props) {
                    if (pKey.indexOf('Option') < 0) {
                        dtoProps[pKey] = props[pKey]
                    }
                }
                // 处理 comName Option
                dtoProps = Object.assign({}, dtoProps, { option: props[`${comName}Option`] })
                dtoSchema.properties[key] = dtoProps
            }
        }
        return dtoSchema
    }
    watch([
        () => route.query.key,
        () => route.query.sider_key,
        () => menuStore.menuList
    ], () => {
        buildData()
    },
        {
            deep: true
        }
    )
    onMounted(() => {
        buildData()
    })
    return {
        api,
        tableSchema,
        tableConfig
    }
}