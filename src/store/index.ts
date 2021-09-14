import { createStore } from 'vuex'
import templates, { TemplatesProps } from './templates'
import user, { UserProps } from './user'

// 定义store类型
export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
}

// 创建store实例，并通过modules引入其他store模块
const store = createStore<GlobalDataProps>({
  modules: {
    user,
    templates
  }
})

export default store