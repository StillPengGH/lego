<template>
  <component :is="tag" :style="styleProps" class="l-text-component" @click="handleClick">
    {{text}}
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { textDefaultProps, textStylePropsKeys, transformToComopnentProps} from '../defaultProps'
import useComponentCommon from '../hooks/useComponentCommon'

// 获取props属性对象
const defaultProps = transformToComopnentProps(textDefaultProps)

export default defineComponent({
  name: 'LText',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    ...defaultProps
  },
  setup(props) {
    // 筛选出props中style相关的属性，组成对象，筛选结果：{fontSize:'12px'}
    // const styleProps = computed(() => pick(props, textStylePropsKeys))
    // 处理公共逻辑（获取style属性和点击事件处理）
    const { styleProps, handleClick } = useComponentCommon(props, textStylePropsKeys)
    return {
      styleProps,
      handleClick
    }
  },
})
</script>

<style lang="scss" scoped>
.l-text-component {
  box-sizing: boder-box;
  white-space: pre-wrap;
  position: relative !important;
}
</style>
