import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './routes/index'
import store from './store/index'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.use(store).use(router).use(Antd)
app.mount('#app')
