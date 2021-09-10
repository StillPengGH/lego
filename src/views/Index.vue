<template>
	<div class="index-container">
		<a-layout :style="{ background: '#fff' }">
			<!-- 页面顶部 -->
			<a-layout-header class="index-container__header">
				<div><router-link to="/">Still乐高</router-link></div>
        <UserProfile :user="user" />
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

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import UserProfile from '../components/UserProfile.vue'

export default defineComponent({
	name: 'Index',
  components: {
    UserProfile
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)
    return {
      user
    }
  }
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.index-container {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
		color: $whiteColor;
	}
}
</style>
