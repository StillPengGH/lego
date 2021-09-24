<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="prop-item">
      <span class="prop-item-title">{{item?.title}}</span>
      <div class="prop-item-content">
        <component v-if="item" 
          :is="item.component" 
          :[item.valueProp]="item.value"
          v-bind="item.extraProps"
          v-on="item.events"
        >
          <template v-if="item.options">
            <component :is="item.subComponent" 
              v-for="(option, k) in item.options" 
              :key="k" 
              :value="option.value"
            >
              <RenderVNode :vNode="option.text"/>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

/* eslint-disable */

import { computed, defineComponent, PropType, VNode } from 'vue'
import { reduce } from 'lodash'
import { TextElementProps } from '../defaultProps'
import { mapPropsToForms } from '../propsMap'
import RenderVNode from '../components/RenderVNode'

// 定义渲染表单类型
interface FormProps {
  component: string;                // 对应渲染组件名称
  subComponent?: string;           // 对应渲染组件（子组件名称）         
  value: string;                    // 渲染组件的值
  extraProps?: {[key: string]: any};// 渲染组件的其他属性（对象）
  title?: string;                   // 渲染组件的前面标题（）
  options?: {                       // 子组件的选项
    text: string | VNode;
    value: any;
  }[];
  valueProp: string;                // 动态属性（有的话用valueProp的值，没有的话就是value）
  eventName: string;                // 绑定在渲染组件的事件名称（默认命名为change，即修改组件的值）
  events: {                         // 具体是事件function
    [key: string]: (e: any) => void;
  };
}

export default defineComponent({
  name: 'PropsTable',
  components: {
    RenderVNode
  },
  props: {
    elementProps: {
      type: Object as PropType<Partial<TextElementProps>>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, context) {
    // 根据业务组件元素属性对象 转换为 属性和Form表单映射的类型对象·
    const finalProps = computed(() => {
      return reduce(props.elementProps, function(result, value, key){
        const newKey = key as keyof TextElementProps
        const item = mapPropsToForms[newKey]
        // 如果属性在mapPropsToForms有对应的渲染映射关系
        if (item) {
          // 获取item中的动态属性名称valueProp（设置默认值为value）
          // 获取item中的事件名称（设置默认值为change）
          // 获取initalTransform和afterTransform
          const { valueProp = 'value', eventName='change', initalTransform, afterTransform} = item
          // 组装FormProps
          const formItem: FormProps = {
            ...item,
            value: initalTransform ? initalTransform(value) : value,
            valueProp,
            eventName,
            events: {
              [eventName]: (e: any) => {
                context.emit('change', { key, value: afterTransform ? afterTransform(e) : e })
              }
            }
          }
          result[newKey] = formItem
        }
        return result
      }, {} as { [key: string]: FormProps} )
    })
    return { finalProps }
  }
})
</script>

<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.prop-item-title {
  width: 28%;
}
.prop-item-content {
  width: 70%;
}

</style>