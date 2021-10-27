<template>
	<div class="editor-container">
    <!-- 页面主体 -->
		<a-layout>
      <!-- 左侧元素列表 -->
			<a-layout-sider width="300" style="background: #fff">
				<div class="sidebar-container">
					元素列表
          <ElementsList :list="defaultTextElements" @onItemClick="addElement"/>
				</div>
			</a-layout-sider>
      <!-- 中间画布区域 -->
			<a-layout style="padding: 0 24px 24px">
				<a-layout-content class="preview-container">
					<p>画布区域</p>
					<div class="preview-list" id="canvas-area">
            <EditWraper v-for="element in elements" 
              :key="element.id" 
              :id="element.id"
              :active="element.id === (currentElement && currentElement.id)"
              @setActive="setActive"
            >
              <component :is="element.name" v-bind="element.props" />
            </EditWraper>
          </div>
				</a-layout-content>
			</a-layout>
      <!-- 右侧组件属性设置 -->
			<a-layout-sider width="300" style="background: #fff" class="settings-panel">
				组件属性
        <PropsTable 
          v-if="currentElement && currentElement.props" 
          :elementProps="currentElement.props"
          @change="handleChange"
        />
			</a-layout-sider>
		</a-layout>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore} from 'vuex'
import { GlobalDataProps } from '../store/index'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
import EditWraper from '../components/EditWrapper.vue'
import ElementsList from '../components/ElementsList.vue'
import PropsTable from '../components/PropsTable.vue'
import { defaultTextElements } from '../defaultTextElements'
import { ELementData } from '../store/editor'

export default defineComponent({
  components: {
    LText,
    LImage,
    ElementsList,
    EditWraper,
    PropsTable
  },
	setup() {
    const store = useStore<GlobalDataProps>()
    // 获取元素数组
    const elements = computed(() => store.state.editor.elements )
    // 获取当前选中的元素
    const currentElement = computed<ELementData | null >(() => store.getters.getCurrentElement)

    // 添加元素
    const addElement = (element: any) => {
      store.commit('addElement', element)
    }

    // 设置选中
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    
    // 修改选中业务组件元素的数据
    // eslint-disable-next-line
    const handleChange = (e: any) => {
      store.commit('updateElement', e)
    }

		return {
      elements,
      defaultTextElements,
      addElement,
      setActive,
      currentElement,
      handleChange
    }
	},
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.editor-container {
  .preview-container {
    padding: 24px;
    margin: 0;
    min-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
}

.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid $light_ef;
  background: $whiteColor;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>
