import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/authStore'
import './style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// 初始化 Auth Store
const authStore = useAuthStore()
authStore.checkAuth()

app.mount('#app')

