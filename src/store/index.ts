import { createStore } from 'vuex'

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplateProps[];
}

const testData: TemplateProps[] = [
  {id: 1, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-889755.png', title: '前端架构师直播海报1', author: 'still', copiedCount: 1 },
  {id: 2, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报2', author: 'still', copiedCount: 2 },
  {id: 3, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-682056.png', title: '前端架构师直播海报3', author: 'still', copiedCount: 3 },
  {id: 4, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报4', author: 'still', copiedCount: 4 },
  {id: 5, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-889755.png', title: '前端架构师直播海报5', author: 'still', copiedCount: 5 },
  {id: 6, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报6', author: 'still', copiedCount: 6 },
  {id: 7, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报7', author: 'still', copiedCount: 7 },
  {id: 8, coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png', title: '前端架构师直播海报8', author: 'still', copiedCount: 8 }
]

const store = createStore<GlobalDataProps>({
  state: {
    user: { isLogin: false },
    templates: testData
  },
  mutations: {
    login(state) {
      state.user = {...state.user, isLogin: true, userName: 'still'}
    },
    logout(state) {
      state.user = { isLogin: false }
    }
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.templates.find(t => t.id === id)
    }
  }
})

export default store