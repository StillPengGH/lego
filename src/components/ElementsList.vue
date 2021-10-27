<template>
	<div>
    <!-- 循环默认的text元素数组 -->
		<div class="element-item" v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
			<LText v-bind="item"></LText>
		</div>
	</div>
  <!-- 上传图片 -->
  <StyledUploader @upload-success="onImageUploaded" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import LText from '../components/LText.vue'
import StyledUploader from './StyledUploader.vue'
import { TextElementProps, imageDefaultProps } from '../defaultProps'
import { UploadResp } from '../extraType'
import { getImageTrueWH } from '../helper'

export default defineComponent({
	name: 'ElementsList',
	props: {
		list: {
			type: Array  as PropType<TextElementProps[]>,
			require: true,
		},
	},
	components: { LText, StyledUploader },
  emits: ['on-item-click'],
	setup(props, context) {

    // LText组件上绑定的click事件
		const onItemClick = (props: TextElementProps) => {
      const ElementData = {
        uid: uuidv4(),
        name: 'l-text',
        props: props
      }
			context.emit('on-item-click', ElementData)
		}

    // 图片上传成功后
    const onImageUploaded = (resp: UploadResp) => {
      message.success('上传成功')
      // 创建elementData对象
      const elementData = {
        uid: uuidv4(),
        name: 'l-image',
        props: {
          ...imageDefaultProps
        }
      }
      // 将服务器响应信息中的图片url地址赋值给添加src属性
      elementData.props.src = resp.data.url

      // 处理图片大小逻辑
      getImageTrueWH(resp.data.url).then((result) => {
        // 画布最大宽度
        const maxWidth = 373 
        // 获取图片真实宽高
        const width = result.width
        elementData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px'
        // 将组装的数据通过发射事件的形式，携带到父组间
        context.emit('on-item-click', elementData)
      })
    }

		return {
			onItemClick,
      onImageUploaded
		}
	},
})
</script>

<style>
.element-item {
	width: 100px;
	margin: 0 auto;
	margin-bottom: 15px;
}
</style>
