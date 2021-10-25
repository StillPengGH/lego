import { flushPromises, mount, shallowMount, VueWrapper } from '@vue/test-utils'
import axios from 'axios'
import Uploader from '@/components/Uploader.vue'

// mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// mock components
const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponents = {
  'DeleteOutlined': mockComponent,
  'LoadingOutlined': mockComponent,
  'FileOutlined': mockComponent,
  'a-button': mockComponent
}
// 创建一个上传文件File对象
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })

const setInputValue = (input: HTMLInputElement) => {
   // 创建files
   const files = [testFile]
   // 在fileInput对象上添加files属性，值为files，只读的
   Object.defineProperty(input, 'files', {
     value: files,
     writable: false
   })
}

let wrapper: VueWrapper<any> // eslint-disable-line

describe('Uploader组件测试', () => {
	beforeAll(() => {
		wrapper = mount(Uploader, {
			props: {
				action: 'test.url',
			},
      global: {
        stubs: mockComponents
      }
		})
	})

	it('测试基础样式渲染', () => {
		// 断言：页面存在button按钮，按钮文字为点击上传，且input为隐藏
		expect(wrapper.find('button').exists()).toBeTruthy()
		expect(wrapper.get('button').text()).toBe('点击上传')
		expect(wrapper.get('input').isVisible()).toBeFalsy()
	})

	it('测试上传成功', async () => {
		// 拿到input type=file的元素节点
    const fileInput = wrapper.get('input').element as HTMLInputElement
    // // 创建files
    // const files = [testFile]
    // // 在fileInput对象上添加files属性，值为files，只读的
    // Object.defineProperty(fileInput, 'files', {
    //   value: files,
    //   writable: false
    // })
    
    setInputValue(fileInput)

    // 模拟axios异步请求，并返回成功返回数据
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' })
    // 触发change事件
    await wrapper.get('input').trigger('change')
    // 断言：此时按钮文字为"正在上传" (mockResolvedValueOnce此时会promise执行完了，无法测试)
    // @vue/test-utils版本问题，低版本可以
    // expect(wrapper.get('button span').text()).toBe('正在上传')
    // 断言：mockedAxios.post被触发1次
    // 断言：正在上传时，button增加disabled属性
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    // 断言：此时上传文件列表中增加一条数据
    expect(wrapper.findAll('li').length).toBe(1)
    // 断言：第一个li的class是否有uploading类
    const firstLiItem = wrapper.get('li:first-child')
    expect(firstLiItem.classes()).toContain('upload-loading')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    // 让所有Promise执行完成
    await flushPromises()
    // 断言：此时按钮文字为"上传成功"
    expect(wrapper.get('button').text()).toBe('点击上传')
    // 断言：li的样式是否变为upload-success
    expect(firstLiItem.classes()).toContain('upload-success')
    // 断言：上传列表显示上传文件名称是否正确
    expect(firstLiItem.get('.filename').text()).toBe(testFile.name)
	})

	it('测试上传失败', async () => {
		mockedAxios.post.mockRejectedValueOnce( { error: new Error() } )
    wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')
    // 断言：上传失败后，由于也要展示失败效果，所以列表长度也增加了
    expect(wrapper.findAll('li').length).toBe(2)
    // 断言：添加的li的class为upload-error
    const lastLiItem = wrapper.get('li:last-child')
    expect(lastLiItem.classes()).toContain('upload-error')
    // 断言：点击删除按钮，删除li
    await lastLiItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
	})

  it('测试自定义模板相关(使用slot)', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: 'dummy.url' }})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      slots: {
        default: '<button>Custom button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{ uploadedData.url }}</div>
        </template>`
      },
      global: {
        stubs: mockComponents
      }
    })
    // 断言：默认button的text是Custom button
    expect(wrapper.get('button').text()).toBe('Custom button')
    // mock input 对象上挂载files
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    // 触发input 的 change
    await wrapper.get('input').trigger('change')
    // 断言：loading的text是否是custom loading
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    // 让promsie结束
    await flushPromises()
    // 断言uploaded里的内容是我们从服务器上获取的返回结果
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url')
  })

  it('测试生命周期函数beforeUpload之检查 size（true/false方式）', async () => {
    const callback = jest.fn()
    mockedAxios.post.mockRejectedValueOnce({ data: {url: 'dummy.url' }})
    const checkFileSize = (file: File) => {
      if(file.size > 2){
        callback()
        return false
      }
      return true
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: checkFileSize
      }
    })
    // 模拟上传附件操作，触发input的change事件
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    // 断言：没有发送axios.post请求，附件列表没有展示，callback函数被调用（即文件size大于2）
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    expect(callback).toHaveBeenCalled()
  })

  it('测试生命周期函数beforeUpload之检查 type（Promise方式）', async () => {
    mockedAxios.post.mockRejectedValueOnce({ data: {url: 'dummy.url' }})
    const failedPromise = (file: File) => {
      return Promise.reject('wrong type')
    }

    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: failedPromise
      }
    })

    // 失败情况测试
    // 模拟上传附件操作，触发input的change事件
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    // 断言：没有发送axios.post请求，附件列表没有展示
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
  })

  it('测试生命周期函数beforeUpload（Promise方式 resolve情况）', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url' }})

    const successPromise = (file: File) => {
      const newFile = new File([file], 'new_name.png', { type : file.type})
      return Promise.resolve(newFile)
    }

    // 返回错误类型方法
    const successPromiseWithWrongType = () => {
      return Promise.resolve('123123')
    }
    
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: successPromise
      }
    })

    // 正确返回结果测试
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).toHaveBeenCalled()
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-success')
    expect(firstItem.get('.filename').text()).toBe('new_name.png')
    await flushPromises()

    // successPromiseWithWrongType Test
    mockedAxios.post.mockReset()
    await wrapper.setProps({
      beforeUpload: successPromiseWithWrongType
    })
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  it('测试拖拽drag and drop 事件', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: 'dummy.url' }})
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        drag: true
      }
    })
    // 获取上传区域，触发绑定的dragover和dragleave事件
    // 断言：是否添加获移除了is-dragover样式
    const uploadArea = wrapper.get('.upload-area')
    await uploadArea.trigger('dragover')
    expect(uploadArea.classes()).toContain('is-dragover')
    await uploadArea.trigger('dragleave')
    expect(uploadArea.classes()).not.toContain('is-dragover')
    // 测试drop事件，第二个参数是模拟的上传文件
    await uploadArea.trigger('drop', {
      dataTransfer: { files: [testFile] }
    })
    expect(mockedAxios.post).toHaveBeenCalled()
    await flushPromises() 
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('非自动上传测试', async () => {
    mockedAxios.post.mockResolvedValueOnce({data: {url: 'dummy.url'}})
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        drag: true,
        autoUpload: false
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    // 因为触发了change方法，所以fileList数组中应该已经有一个file对象了
    expect(wrapper.findAll('li').length).toBe(1)
    // 此时ul中第一个li的class应该是upload-ready
    expect(wrapper.get('li:first-child').classes()).toContain('upload-ready')
    // 模拟触发nonAutoUploadFiles方法
    wrapper.vm.nonAutoUploadFiles()
    expect(mockedAxios.post).toHaveBeenCalled()
    await flushPromises()
    expect(wrapper.get('li:first-child').classes()).toContain('upload-success')
  })

  it('缩略图列表展示测试', async () => {
    mockedAxios.post.mockResolvedValueOnce({data: {url: 'dumy.url'}})
    // 模拟URL.createObjectURL，返回一个url地址
    window.URL.createObjectURL = jest.fn((): string => {
      return 'test.url'
    })
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        listType: 'picture'
      }
    })
    // 断言：listType为picture时，url的class是否是upload-list-picture
    expect(wrapper.get('ul').classes()).toContain('upload-list-picture')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    // 断言：上传完成后是否增加一个li
    expect(wrapper.findAll('li').length).toBe(1)
    // 断言：是否渲染了img标签
    expect(wrapper.find('li:first-child img').exists()).toBeTruthy()
    const firstImg = wrapper.get('li:first-child img')
    expect(firstImg.attributes('src')).toEqual('test.url')
  })

  afterEach(() => {
    // 每个case结束reset一下mockedAxios.post
    mockedAxios.post.mockReset()
  })
})
