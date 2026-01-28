<template>
    <el-row class="schema-view">
        <search-panel v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
            @search="onSearch"></search-panel>
        <table-panel @operate="onTableOperate"></table-panel>
    </el-row>
</template>
<script setup>
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hook/schema.js'
import { provide, ref } from 'vue';

const {
    api,
    tableConfig,
    tableSchema,
    searchSchema,
    searchConfig
} = useSchema()

const apiParams = ref({})

provide('schemaViewData', {
    api,
    apiParams,  
    tableConfig,
    tableSchema,
    searchSchema,
    searchConfig
})

const onSearch = (searchValObj) => {
    console.log('999');
    apiParams.value = searchValObj
}

const onTableOperate = (operateObj) => {
    console.log('触发了',operateObj);
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