<template>
	<div class="home-container">
		<TemplateList :list="listData" />
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import TemplateList from '../components/TemplateList.vue'

const listData = [
	{
		id: 1,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
		title: '前端架构师直播海报',
	},
	{
		id: 2,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
		title: '前端架构师直播海报',
	},
	{
		id: 3,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-682056.png',
		title: '前端架构师直播海报',
	},
	{
		id: 4,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
		title: '前端架构师直播海报',
	},
	{
		id: 5,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
		title: '前端架构师直播海报',
	},
	{
		id: 6,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
		title: '前端架构师直播海报',
	},
	{
		id: 5,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
		title: '前端架构师直播海报',
	},
	{
		id: 6,
		coverImg:
			'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
		title: '前端架构师直播海报',
	},
]

export default defineComponent({
	components: {
		TemplateList,
	},
	setup() {
		return {
			listData,
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
