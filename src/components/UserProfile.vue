<template>
  <a-button type="primary" @click="login" v-if="!user.isLogin">
    登录
  </a-button>
  <div v-else>
    <a-dropdown-button>
      <router-link to="/setting">{{user.userName}}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useStore} from 'vuex'
import { message } from 'ant-design-vue'
import { UserProps } from '../store/user'

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const router  = useRouter()
    const login = () => {
      store.commit('login')
      message.success('登录成功 ',2)
    }
    const logout = () =>{
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转首页',2)
      setTimeout(()=>{
        router.push('/')
      },2000)
    }
    return {
      login,
      logout
    }
  },
})
</script>

<style lang="scss" scoped>
.user-profile-dropdown{
  border-radius: 2px !important;
}

</style>