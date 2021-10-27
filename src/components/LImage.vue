<template>
  <img 
    class="l-image-component" 
    :src="src" 
    :style="styleProps" 
    @click="handleClick"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { imageDefaultProps, imageStylePropsKeys, transformToComopnentProps} from '../defaultProps'
import useComponentCommon  from '../hooks/useComponentCommon'

// 通过defaultProps中定义的默认属性对象 转换为 符合组件props格式的对象
const defaultProps = transformToComopnentProps(imageDefaultProps)

export default defineComponent({
  name: 'LImage',
  props: {
    ...defaultProps
  },
  setup(props) {
    // 业务组件通用逻辑处理：获取styleProps、添加handleClick函数定义
    const { styleProps, handleClick} = useComponentCommon(props, imageStylePropsKeys)
    return  {
      styleProps,
      handleClick
    }
  },
})
</script>

<style scoped>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>