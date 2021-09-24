import { defineComponent } from 'vue'

// 渲染vNode的组件
const RenderVNode = defineComponent({
  props: {
    vNode: {
      type: [Object, String],
      required: true
    }
  },
  render() {
    return this.vNode
  }
})

export default RenderVNode