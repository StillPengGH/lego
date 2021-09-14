<template>
	<div>
		<div class="detail-container">
			<a-row type="flex" justify="center" v-if="template">
				<a-col :span="8" class="detail-container__img">
					<img :src="template.coverImg" alt="" />
				</a-col>
				<a-col :span="8">
					<h2>{{ template.title }}</h2>
					<p>{{ template.title }}</p>
					<div class="detail-container__author">
						<a-avatar>V</a-avatar> 该模版由
						<b>{{ template.author }}</b> 创作
					</div>
					<div class="detial-container__code">
						<span>扫一扫，手机浏览</span>
						<div class="detail-container__code__qr"></div>
					</div>
					<div class="detail-container__buttons">
						<router-link to="/editor">
							<a-button type="primary" size="large"
								>使用模板</a-button
							>
						</router-link>
						<a-button size="large">下载图片海报</a-button>
					</div>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { TemplateProps } from '../store/templates'
import { GlobalDataProps } from '../store'
import { useRoute } from 'vue-router'

export default defineComponent({
	setup() {
		const route = useRoute()
		const store = useStore<GlobalDataProps>()
		const templateId = route.params.id as string
		const template = computed<TemplateProps>(() =>
			store.getters.getTemplateById(parseInt(templateId))
		)
		return {
			template,
		}
	},
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.detail-container {
	margin-top: 50px;
	margin-bottom: 30px;
	.ant-avatar {
		margin-right: 10px;
	}
	&__img {
		margin-right: 30px;
		img {
			width: 100%;
		}
	}
	&__buttons {
		margin: 30px 0;
	}
	&__code {
		margin: 20px 0;
		&__qr {
			width: 120px;
			height: 120px;
			background: yellow;
		}
	}
}
</style>
