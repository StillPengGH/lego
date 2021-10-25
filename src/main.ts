import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './routes/index'
import store from './store/index'
import mitt from 'mitt'
import 'ant-design-vue/dist/antd.css'

// 创建事件发射器实例并导出
export const emitter = mitt()

// 创建一个Vue应用实例
const app = createApp(App)

app.use(store).use(router).use(Antd)
console.log('application instance', app)

// 组件实例
const vm = app.mount('#app')
console.log('component instance', vm)