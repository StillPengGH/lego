import store from "@/store/index"
import { testData } from '@/store/templates'
import { testElements, ELementData } from '@/store/editor'
import { TextElementProps } from '../../src/defaultProps'
import { clone, last} from 'lodash'

// 克隆测试数据
const cloneElements = clone(testElements)

describe('test vuex store', () => {
  // 测试store中是否有三个模块
  it('store中应该有三个模块', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })

  // 测试user模块
  describe('测试user模块',() => {
    it('测试login mutation', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })
    it('测试logout mutation', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })
  
  // 测试templates模块
  describe('测试templates模块', () => {
    it('测试tempaltes模块store中的data应该为定义的testData', () => {
      expect(store.state.templates.data).toHaveLength(testData.length)
    })
    it('测试根据id获取正确的模板信息', () => {
      const selTemplate = store.getters.getTemplateById(1)
      expect(selTemplate.title).toBe('前端架构师直播海报1')
    })
  })
  // 测试editor模块
  describe('test editor module', () => {
    it('测试默认数据是否正常', () => {
      expect(store.state.editor.elements).toHaveLength(cloneElements.length)
    })
    it('测试setActive mutation', () => {
      store.commit('setActive', cloneElements[0].id)
      // 断言：当触发setActive后（id为testElements的第一项id），currentElement是否正确
      expect(store.state.editor.currentElement).toBe(cloneElements[0].id)
      // 断言：测试getters中的getCurrentElement获取的是否正确
      const currentElement = store.getters.getCurrentElement
      expect(currentElement.id).toBe(cloneElements[0].id)
    })
    it('测试addElement', () => {
      const newProps: Partial<TextElementProps> = {
        text: 'text1'
      }
      store.commit('addElement', newProps)
      // 断言：测试是否添加成功
      expect(store.state.editor.elements).toHaveLength(cloneElements.length + 1)
      // 断言：添加的最后一项是不是newProps
      const lastItem = last(store.state.editor.elements)
      expect(lastItem?.props.text).toBe('text1')
    })
    it('测试updateElement', () => {
      const newProps = {
        key: 'text',
        value: 'newValue'
      }
      store.commit('updateElement', newProps)
      const currentElement: ELementData = store.getters.getCurrentElement
      // 断言：更新后的currentElements的text是不是新的值newValue
      expect(currentElement.props.text).toBe('newValue')
    })
  })
})
