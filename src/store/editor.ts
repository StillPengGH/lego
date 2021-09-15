import { Module } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { GlobalDataProps } from './index'

export interface EditorProps {
  elements: ELementData[];  // 供中间画布渲染数组
  currentElement: string;       // 当前编辑的是哪个元素
}

interface ELementData {
  id: string;                     // id，uuid v4 生成
  name: string;                   // 业务组件库名称 l-text l-image等等
  props: { [key: string]: any };  // 这个元素的属性
}

// 测试数据
export const testElements: ELementData[] = [
  { id: uuidv4(), name: 'l-text', props: { text: 'hello1', fontSize: '20px', color: 'red'} },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '12px', fontWeight: 'bold'} },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello3', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com'} },
]

const editor: Module<EditorProps,GlobalDataProps> = {
  state: {
    elements: testElements,
    currentElement: ''
  }
}

export default editor