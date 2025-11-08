<template>
  <h1>这是page1</h1>
  <el-input v-model="content" style="width: 300px;">
    page1
  </el-input>
  <el-table :data="tableData" style="width: 100%;">
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column prop="description" label="description" width="180" />
  </el-table>
  <div>{{ content }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import utils from '$common/utils';
import $curl from '$common/curl'
import './a.css'
const content = ref('')
console.log('page1 init');
const tableData = ref([
  { name: '张三', description: '这是张三' },
  { name: '李四', description: '这是李四' },
  { name: '王五', description: '这是王五' },
])

onMounted(async () => {
  const res = await $curl({
    method: 'get',
    url: '/api/project/list',
    query:{
      proj_key:'123aa'
    }
  })
  tableData.value = res.data
})

// $curl({
//   url: '/api' //请求地址
//     method = 'post',//请求方法
//   headers = {},//请求头
//   query = {},//url query
//   data = {},//post body
//   responseType = 'json',//response data type
//   timeout = 60000,//请求超时时间
//   errorMessage = '网络异常'
// })
</script>
<style lang="less" scoped>
h1 {
  color: red;
}
</style>