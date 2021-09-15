import { createStore } from 'vuex'
import templates, { TemplatesProps } from './templates'
import user, { UserProps } from './user'
import editor, { EditorProps } from './editor'

// 定义store类型
export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

// 创建store实例，并通过modules引入其他store模块
const store = createStore<GlobalDataProps>({
  modules: {
    user,
    templates,
    editor
  }
})

export default store