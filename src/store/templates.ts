import { Module } from "vuex"
import { GlobalDataProps } from './index'

// 单个模板类型
export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

// 测试数据
export const testData: TemplateProps[] = [
  {id: 1, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-889755.png', title: '前端架构师直播海报1', author: 'still', copiedCount: 1 },
  {id: 2, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报2', author: 'still', copiedCount: 2 },
  {id: 3, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-682056.png', title: '前端架构师直播海报3', author: 'still', copiedCount: 3 },
  {id: 4, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报4', author: 'still', copiedCount: 4 },
  {id: 5, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-889755.png', title: '前端架构师直播海报5', author: 'still', copiedCount: 5 },
  {id: 6, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报6', author: 'still', copiedCount: 6 },
  {id: 7, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报7', author: 'still', copiedCount: 7 },
  {id: 8, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报8', author: 'still', copiedCount: 8 }
]

// 创建templates类型，即导出模块的类型
export interface TemplatesProps {
  data: TemplateProps[];
}

const templates: Module<TemplatesProps,GlobalDataProps> = {
  state: {
    data: testData
  },
  getters: {
    // 根据模板id获取模板信息，getTemplateById 参数：state, getters, rootState
    getTemplateById: (state) => (id: number) => {
      return state.data.find(t => t.id === id)
    }
  }
}

export default templates
