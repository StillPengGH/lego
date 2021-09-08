<template>
	<div class="index-container">
		<a-layout :style="{ background: '#fff' }">
			<!-- 页面顶部 -->
			<a-layout-header class="index-container__header">
				<div><router-link to="/">Still乐高</router-link></div>
			</a-layout-header>
			<!-- 页面主体 -->
			<a-layout-content class="content">
				<router-view />
			</a-layout-content>
			<!-- 页面底部 -->
			<a-layout-footer class="index-container__footer">
				© Still网（still.com）版权所有 | 京ICP备20888888号-2
			</a-layout-footer>
		</a-layout>
	</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Index',
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.index-container {
  &__header {
		color: $whiteColor;
	}
}
</style>
