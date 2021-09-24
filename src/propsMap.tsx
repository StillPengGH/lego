import { VNode } from 'vue'
import { TextElementProps } from './defaultProps'

/* eslint-disable */

// 属性对应的Form表单类型定义
export interface PropToForm {
  component: string;                    // 对应渲染组件
  subComponent?: string;                // 对应渲染组件（子组件）
  title?: string;                       // 渲染组件的标题
  extraProps?: { [key: string]: any };  // 渲染组件属性定义
  options?: {                           // 子组件选项（属性，文本等）
    text: string | VNode;
    value: any;
  }[];
  initalTransform?: (value: any) => any; // 匹配渲染组件所需数据格式的转换函数    
  afterTransform?: (value: any) => any;  // 格式化修改后返回数据，用来匹配业务组件属性实际对应的值  
  valueProp?: string;                    // 动态属性（有的话用valueProp的值，没有的话就是value）
  eventName?: string;                    // 绑定在渲染组件的事件名称（默认命名为change，即修改组件的值）
}

// 业务组件属性和form表单映射类型定义(export type - 类型别名)
export type PropsToForms = {
  // 循环TextElementProps获取key值
  [P in keyof TextElementProps ]?: PropToForm
}

// 字体数组
const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' },
]
// 转换成新的带样式的字体数组
const fontFamilyOptions = fontFamilyArr.map( font => {
  return {
    value: font.value,
    text: <span style={{ fontFamily: font.value}}>{font.text}</span> as VNode
  }
})

// 属性和表单映射对象
export const mapPropsToForms: PropsToForms = {
  text: {
    component: 'a-input',
    title: '文字',
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    component: 'a-input-number',
    title: '字号',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e ? `${e}px`: ''
  },
  lineHeight: {
    component: 'a-slider',
    title: '行高',
    extraProps: { min: 0, max: 3, step: 0.1 }, // 查询ant-design-vue文档
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    title: '对齐方式',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    title: '字体',
    extraProps: { style: 'width: 100px'},
    options: [
      { text: '无', value: '',},
      ...fontFamilyOptions
    ]
  }
}