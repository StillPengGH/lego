<template>
	<div style="margin-bottom: 500px;">
		<Uploader
			action="http://123.57.138.48/api/upload/"
			:before-upload="uploadCheck"
      drag
      :autoUpload="false"
      ref="sonUploader"
		>
			<template v-slot:default>
				<a-button type="primary">点击上传</a-button>
			</template>
			<template v-slot:loading>
				<a-button type="primary" loading>正在上传</a-button>
			</template>
			<template v-slot:uploaded="uploadedData">
				<!-- <pre>{{ uploadedData }}</pre> -->
				<img :src="uploadedData.uploadedData.data.url" />
			</template>
		</Uploader>
	</div>
	<router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { emitter } from './main'
import Uploader from './components/Uploader.vue'

export default defineComponent({
	name: 'App',
	components: {
		Uploader,
	},
	setup() {
    const sonUploader = ref(null)
    console.log('inner Uploader Component', sonUploader)
    const internalInstance = getCurrentInstance()
    console.log('internal component instance', internalInstance)

    // 监听子组件发射的sonMessage事件
    emitter.on('sonMessage', (e) => {
      console.log(e)
    })

		const uploadCheck = (file: File) => {
			if (file.size > 80000) {
				return false
			}
			return true
		}
    
    // eslint-disable-next-line
		const uploadCheckPromise = (file: File) => {
			return Promise.resolve('aaaaaaaa')
		}

		const uploadCheckPromise2 = (file: File) => {
			return Promise.resolve(
				new File([file], 'new_name.jpg', { type: file.type })
			)
		}
		return { uploadCheck, uploadCheckPromise, uploadCheckPromise2,sonUploader }
	},
})
</script>

<style lang="scss">
.file-upload .upload-area {
	background: #efefef;
	border: 1px dashed #ccc;
	border-radius: 4px;
	cursor: pointer;
	padding: 20px;
	width: 360px;
	height: 180px;
	text-align: center;
	&:hover {
		border: 1px dashed #1890ff;
	}
	&.is-dragover {
		border: 2px dashed #1890ff;
		background: rgba(#1890ff, 0.2);
	}
  img {
    width: 70px;
  }
}
</style>
