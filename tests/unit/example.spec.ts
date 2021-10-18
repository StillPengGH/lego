import { shallowMount, mount, VueWrapper } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'
import HelloWorld from '@/components/HelloWorld.vue'
import Hello from '@/components/Hello.vue'

// jest 接管 axios
jest.mock('axios')
// 创建具有类型补全的axios
const mockAxios = axios as jest.Mocked<typeof axios> 

// HelloWorld组件相关测试用例
const msg = 'new message'
let wrapper: VueWrapper<any>

describe('HelloWorld.vue', () => {
  // 所有测试用例前执行的钩子函数（只执行一次）
  beforeAll(() => {
    // 获取渲染后的组件HTML对象（类型是VueWrapper）
    wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
  })

  // case1
  it('renders props.msg when passed', () => {
    // console.log(wrapper.html()) 输出组件渲染后的内容
    expect(wrapper.text()).toMatch(msg) 
    //console.log(wrapper.find('h2')) // 获取h1的text内容
    //console.log(wrapper.find('h1').text()) 
    //console.log(wrapper.findComponent(Hello)) // 查看是否存在Hello组件
    //console.log(wrapper.findComponent(Hello).props()) // 查看Hello组件的props属性
  })
  // case2
  it('click button to update count value', async () => {
    // 找到button按钮，触发点击事件
    await wrapper.get('button').trigger('click')
    // 断言button的文本内容，即count为2
    expect(wrapper.get('button').text()).toBe('2')
  })
  // case3
  it('input内容改变，点击button按钮，内容是否渲染到li上', async () => {
    const todoContent = 'hello content'
    // 给input设置值(异步过程)
    await wrapper.get('input').setValue(todoContent)
    // 断言：当当前input的值食补是todoContent，即是否渲染成功
    expect(wrapper.get('input').element.value).toBe(todoContent)
    // 触发addTodo事件
    await wrapper.get('.addTodo').trigger('click')
    // 断言：查看li的length是否是1，即是否添加成功
    expect(wrapper.findAll('li')).toHaveLength(1)
    // 断言：li上的文本是不是todoContent
    expect(wrapper.get('li').text()).toBe(todoContent)
    // 测试是否发送案件
    //console.log(wrapper.emitted())
    // 断言：是否发送了send事件
    expect(wrapper.emitted()).toHaveProperty('send')
    // 断言：send事件发送的内容（参数）是否是todoContent
    expect(wrapper.emitted('send')?.shift()).toEqual([todoContent])
  })
  // case4
  it('测试异步请求', async () => {
    // 模拟axios请求，返回结果为{ data: { uaername: 'still' }}
    mockAxios.get.mockResolvedValue({ data: {username: 'still' } })
    // 点击load按钮触发click事件
    await wrapper.get('.loadUser').trigger('click')
    // 断言：axios是否被调用
    expect(mockAxios.get).toHaveBeenCalled()
    // 断言：是否出现loading
    expect(wrapper.find('.loading').exists()).toBeTruthy()
    // 异步请求完成，并完成页面刷新
    // 页面更新完毕后的断言
    await flushPromises()
    // 断言：loading是否消失
    expect(wrapper.find('.loading').exists()).toBeFalsy()
    // 断言：username是否渲染到页面
    expect(wrapper.get('.userName').text()).toBe('still')
  })
  // case5
  it('测试异步请求返回结果为error', async () => {
    mockAxios.get.mockRejectedValueOnce('error')
    await wrapper.get('.loadUser').trigger('click')
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    await flushPromises()
    expect(wrapper.find('.loading').exists()).toBe(false)
    expect(wrapper.find('.error').exists()).toBe(true)
  })

  // 每个case结束执行的钩子函数
  afterEach(() => {
    // 重置mockAxios.get
    mockAxios.get.mockReset()
  })
})
