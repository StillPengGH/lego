import { Module } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { GlobalDataProps } from './index'
import { TextElementProps } from '../defaultProps'

export interface EditorProps {
  elements: ELementData[];  // 供中间画布渲染数组
  currentElement: string;       // 当前编辑的是哪个元素
}

export interface ELementData {
  id: string;                     // id，uuid v4 生成
  name: string;                   // 业务组件库名称 l-text l-image等等
  props: Partial<TextElementProps>;  // 这个元素的属性
}

// 测试数据
export const testElements: ELementData[] = [
  { 
    id: uuidv4(), 
    name: 'l-text', 
    props: { 
      text: 'hello1', fontSize: '12px', lineHeight: '1', textAlign: 'left', fontFamily: '', color: '#000000'
    } 
  },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '24px', lineHeight: '2', textAlign: 'left', fontFamily: '', fontWeight: 'bold'} },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello3', fontSize: '36px', lineHeight: '3', textAlign: 'left', fontFamily: '', actionType: 'url', url: 'https://www.baidu.com'} },
]

const editor: Module<EditorProps,GlobalDataProps> = {
  state: {
    elements: testElements,
    currentElement: ''
  },
  mutations: {
    addElement(state, props: Partial<TextElementProps>) {
      const newElements: ELementData = {
        id: uuidv4(),
        name: 'l-text',
        props
      }
      state.elements.push(newElements)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    updateElement(state, {key, value}) {
      // 找到要修改的元素
      const uElement = state.elements.find((ele) => ele.id === state.currentElement)
      if(uElement) {
        // 修改属性的值
        uElement.props[key as keyof TextElementProps] = value
      }
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.elements.find((element) => element.id === state.currentElement )
    }
  }
}

export default editor