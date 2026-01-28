<template>
    <el-sub-menu :index="menuItem.key">
        <template #title>
            {{ menuItem.name }}
        </template>
        <div :key="item.key" v-for="item in menuItem.subMenu" >
            <sub-menu 
            v-if="item.subMenu && item.subMenu.length > 0" 
            :menu-item="item"
            >
                123
            </sub-menu>
            <el-menu-item :index="item.key" v-else>{{ item.name }}</el-menu-item>
        </div>
    </el-sub-menu>
</template>
<script setup>
const { menuItem } = defineProps(['menuItem'])
</script>
<style lang="less" scoped></style>
