import { Module } from "vuex"
import { GlobalDataProps } from './index'

// 定义user类型
export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false
  },
  mutations: {
    // 登录
    login(state) {
      state.isLogin = true
      state.userName = 'still'
    },
    // 登出
    logout(state) {
      state.isLogin = false
    }
  }
}

export default user