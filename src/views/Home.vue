<template>
	<div class="home-container">
		<TemplateList :list="testData" />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import TemplateList from '../components/TemplateList.vue'

export default defineComponent({
	components: {
		TemplateList,
	},
	setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates)
		return {
			testData,
		}
	},
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.home-container {
  background: $whiteColor;
  padding: 0 24px 24px 24px;
  min-height: 85vh; /* “css中的vh是一种视窗单位,也是相对单位。相对于视窗的高度。视窗被均分为100单位的vh。vh 优势在于能够直接获取高度,而用 % 在没有设置 body 高度的情况下,是无法正确获得可视区域的高度的。” */
  min-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
