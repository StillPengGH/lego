import { computed } from 'vue'
import { pick } from 'lodash-es'

// 处理业务组件通用逻辑
const useComponentCommon = (props: any, picks: string[]) => {
	const styleProps = computed(() => pick(props, picks))
	const handleClick = () => {
		if (props.actionType === 'url' && props.url) {
			window.location.href = props.url
		}
	}
	return {
		styleProps,
    handleClick
	}
}

export default useComponentCommon
