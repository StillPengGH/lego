<template>
  <Uploader 
    class="uploader-container"
    action="http://123.57.138.48/api/upload/"
    :showUploadList="false"
    @upload-success="handleUploadSuccess"
    :beforeUpload="commonUploadCheck"
  >
    <!-- 默认上传按钮 -->
    <div class="btn-container">
      <FileImageOutlined />
      <h4>上传图片</h4>
    </div>

    <!-- 上传中按钮 -->
    <template #loading>
      <div class="btn-container">
        <LoadingOutlined />
        <h4>上传中</h4>
      </div>
    </template>

    <!-- 上传完毕后按钮 -->
    <template #uploaded>
      <div class="btn-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
    </template>

  </Uploader>
</template>``

<script lang="ts">
import { defineComponent } from 'vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'
import { commonUploadCheck } from '../helper'

export default defineComponent({
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined
  },
  emits: ['upload-success'],
  setup(props, { emit }) {
    const handleUploadSuccess = (resp: any) => {
      emit('upload-success', resp.result)
    }
    return {
      handleUploadSuccess,
      commonUploadCheck
    }
  },
})
</script>

<style lang="scss">
.uploader-container {
  .btn-container{
    width: 100px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
      background: #40a9ff;
    }

    h4 {
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 10px;
    }
  }
}
</style>
