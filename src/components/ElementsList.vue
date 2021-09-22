<template>
	<div>
		<div
			class="element-item"
			v-for="(item, index) in list"
			:key="index"
			@click="onItemClick(item)"
		>
			<LText v-bind="item"></LText>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import LText from '../components/LText.vue'
import { TextElementProps } from '../defaultProps'

export default defineComponent({
	name: 'ElementsList',
	props: {
		list: {
			type: Array  as PropType<TextElementProps[]>,
			require: true,
		},
	},
	components: { LText },
  emits: ['on-item-click'],
	setup(props, context) {
		const onItemClick = (props: TextElementProps) => {
			context.emit('on-item-click', props)
		}
		return {
			onItemClick
		}
	},
})
</script>

<style>
.element-item {
	width: 100px;
	margin: 0 auto;
	margin-bottom: 15px;
}
</style>
