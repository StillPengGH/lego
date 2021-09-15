import { without, mapValues } from 'lodash-es'

// 通用属性
export const commonDefaultProps = {
	// actions
	actionType: '',
	url: '',
	// size
	height: '',
	width: '318px',
	paddingLeft: '0px',
	paddingRight: '0px',
	paddingTop: '0px',
	paddingBottom: '0px',
	// border type
	borderStyle: 'none',
	borderColor: '#000',
	borderWidth: '0',
	borderRadius: '0',
	// shadow and opacity
	boxShadow: '0 0 0 #000000',
	opacity: 1,
	// position and x,y
	position: 'absolute',
	left: '0',
	top: '0',
	right: '0',
}

//  LText组件属性=特有属性+通用属性
export const textDefaultProps = {
	text: '正文内容',
	fontSize: '14px',
	fontFamily: '',
	fontWeight: 'normal',
	fontStyle: 'normal',
	textDecoration: 'none',
	lineHeight: '1',
	textAlign: 'left',
	color: '#000000',
	backgroundColor: '',
	...commonDefaultProps,
}

// 获取style属性的key（使用lodash的without排出和样式无关的key）
export const textStylePropsKeys = without(
	Object.keys(textDefaultProps),
	'actionType',
	'url',
	'text'
)

// 使用lodash提供的mapValues对textDefaultProps组装成符合组件内props格式的对象
// 格式：props: { text: {type: String, default: '123'}, ...},
export const transformToComopnentProps = <T extends { [key: string]: any }> (props: T) => {
	return mapValues(props, (item) => {
		return {
			type: item.constructor,
			default: item,
		}
	})
}
