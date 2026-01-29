<template>
    <el-row class="schema-view">
        <search-panel v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
            @search="onSearch"></search-panel>
        <table-panel ref="tablePanelRef" @operate="onTableOperate"></table-panel>
        <component v-for="(item, key) in components" :key="key" :is="ComponentConfig[key]?.component" ref="comListRef"
            @command="onComponentCommand"></component>
    </el-row>
</template>
<script setup>
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import ComponentConfig from './components/component-config.js'
import { useSchema } from './hook/schema.js'
import { provide, ref } from 'vue';

const {
    api,
    tableConfig,
    tableSchema,
    searchSchema,
    searchConfig,
    components,
} = useSchema()
const apiParams = ref({})

provide('schemaViewData', {
    api,
    apiParams,
    tableConfig,
    tableSchema,
    searchSchema,
    searchConfig,
    components,
})

const tablePanelRef = ref(null)
const comListRef = ref([])

const onSearch = (searchValObj) => {
    apiParams.value = searchValObj
}
// table 事件映射
const EventHandlerMap = {
    showComponent: showComponent
}
const onTableOperate = ({ btnConfig, rowData }) => {
    const { eventKey } = btnConfig
    console.log(btnConfig, rowData);
    if (EventHandlerMap[eventKey]) {
        EventHandlerMap[eventKey]({ btnConfig, rowData })
    }
}
// showComponent 展示动态组件
function showComponent ({ btnConfig, rowData }) {
    const {comName} = btnConfig.eventOption
    if(!comName){
        console.log('没有配置组件名');
        return
    }
    const comRef = comListRef.value.find(item =>item.name === comName)
    if(!comRef || typeof comRef.show !== 'function'){
        console.log(`找不到组件：${comName}`);
        return
    }
    comRef.show(rowData)
}
</script>
<style lang="less" scoped>
.schema-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>