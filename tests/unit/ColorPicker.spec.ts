import { mount, VueWrapper } from '@vue/test-utils'
import rgb2hex from 'rgb2hex'
import ColorPicker from '@/components/ColorPicker.vue'

/* eslint-disable */
// 默认颜色
const defaultColors = [
	'#ffffff',
	'#f5222d',
	'#fa541c',
	'#fadb14',
	'#52c41a',
	'#1890ff',
	'#722ed1',
	'#8c8c8c',
	'#000000',
	''
]
// 定义wrapper
let wrapper: VueWrapper<any>

describe('ColorPicker component Test', () => {
	beforeAll(() => {
		wrapper = mount(ColorPicker, {
			props: {
				value: '#ffffff',
			},
		})
	})
	it('测试是否渲染正確的页面结构', () => {
		// 页面结构（期待）
		// <div><input></div>
		// <ul class="picked-color-list">
		//   <li class="item-0" or class="transparent-back">
		//     <div>色块</div>
		//   </li>
		// </ul>

		// 测试左侧是否为input标签
		expect(wrapper.find('input').exists()).toBeTruthy()
		// 测试类型是否是color
		const input = wrapper.get('input').element // 拿到input真实节点
		expect(input.type).toBe('color')
		// value是否是调用组件通过属性传递过来的值，即我们props中mock的值
		expect(input.value).toBe('#ffffff')
		// 测试右侧是否有颜色列表
		expect(wrapper.findAll('.picked-color-list li').length).toBe(
			defaultColors.length
		)
		// 检验一个元素的 css backgroundColor属性是否相等对应的颜色(右侧颜色是否等于左侧颜色)
		const firstItem = wrapper.get('li:first-child div')
			.element as HTMLElement
		expect(rgb2hex(firstItem.style.backgroundColor).hex).toBe(defaultColors[0])
		// 测试最后一个元素是否有特殊类型（透明）
		const lastItem = wrapper.get('li:last-child div').element as HTMLElement
		expect(lastItem.classList.contains('transparent-back')).toBeTruthy()
	})

	it('当change input的时候应该发送正确的事件', async () => {
		// 测试input修改后，是否发送了对应的事件和对应的值
		const blackHex = '#000000'
		const input = wrapper.get('input')
		await input.setValue(blackHex)
		expect(wrapper.emitted()).toHaveProperty('change')
		const events: any = wrapper.emitted('change')
		expect(events[0]).toEqual([blackHex])
	})

	it('当click 色块的时候应该发送正确的事件', async () => {
		// 测试点击右侧颜色列表后，是否发送对应的值
		const firstItem = wrapper.get('li:first-child div')
		firstItem.trigger('click')
		const events: any = wrapper.emitted('change')
		expect(events[1]).toEqual([defaultColors[0]])
	})
})
