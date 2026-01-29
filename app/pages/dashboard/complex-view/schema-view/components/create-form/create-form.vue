<template>
    <el-drawer
    v-model="isShow"
    direction="rtl"
    :destroy-on-close="true"
    :size="500"
    >
    </el-drawer>
</template>
<script setup>
import { ref } from 'vue'
const name = ref('createForm')
const isShow = ref(false)
const show = (rowData)=>{
    isShow.value = true
    console.log(rowData);
}
defineExpose({
    name,
    show,
})
</script>
<style lang="less" scoped></style>
