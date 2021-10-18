import {mount, VueWrapper} from '@vue/test-utils'
import { message } from 'ant-design-vue'
import UserProfile from '@/components/UserProfile.vue'
import store from '@/store/index'

// mock 模块
jest.mock('ant-design-vue',() => {
  return {
    message: {
      success: jest.fn()
    }
  }
})
// jest.mock('vuex')
jest.mock('vue-router')

// "半真半假"方式实现router的mock
const mockedRoutes: string[] = [] // mock一个路由数组
jest.mock('vue-router',() => {
  return {
    useRouter: () => ({
      push: (url: string) => mockedRoutes.push('/')
    })
  }
})

let wrapper: VueWrapper<any>
const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>'
}
describe('UserProfile component Test', () => {
  beforeAll(() => {
    jest.useFakeTimers() // 使用mock的timer
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false }
      },
      global: {
        components: {
          'a-button': mockComponent,
          'a-dropdown-button': mockComponent2,
          'router-link': mockComponent,
          'a-menu': mockComponent,
          'a-menu-item': mockComponent,
        },
        provide: { store }
      }
    })
  })

  // case1：未登录状态测试
  it('未登录状态，渲染登录按钮', async () => {
    //console.log(wrapper.html())
    expect(wrapper.get('div').text()).toBe("登录")
    await wrapper.get('div').trigger('click')
    // 断言：点击登录后，message.success()是否被触发
    expect(message.success).toHaveBeenCalled()
    // 断言：点击登录后，store中的user.userName是否是'still'
    expect(store.state.user.userName).toBe('still')
  })

  // case2：登录状态测试
  it('登录状态，渲染用户名称username和登出按钮', async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: 'still'}
    })
    // console.log(wrapper.html())
    // 断言：是否渲染了username为still
    expect(wrapper.get('div').html()).toContain('still')
    // 断言：是否渲染了“登出”按钮
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
  })

  // case3: 登录状态下点击"登出"相关测试
  it('登录状态，点击登出按钮，测试store，message，router相关内容', async () => {
    // 点击"登出"按钮
    await wrapper.get('.user-profile-dropdown div').trigger('click')
    // 断言1：store中的isLogin是否为false
    expect(store.state.user.isLogin).toBeFalsy()
    // 断言2：message.success是否被调用，且调用一次
    expect(message.success).toHaveBeenCalledTimes(1)
    // 让timer跑完，即所有的定时器跑完后
    jest.runAllTimers()
    // 断言3：路由数组中是否包含"/"，如果有证明触发了router.push
    expect(mockedRoutes).toEqual(['/'])
  })
  
  afterEach(() => {
    // 将message重置
    (message as jest.Mocked<typeof message>).success.mockReset()
  })
})