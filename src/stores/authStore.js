import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAdmin = ref(false)

  // 初始化检查
  function checkAuth() {
    // 1. 检查 URL 参数
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    
    // 2. 检查 LocalStorage
    const storedToken = localStorage.getItem('admin_token')

    // 简单验证逻辑：只要 token 是 'admin123' (或者你自己定义的任何字符串) 就认为是管理员
    // 在实际生产中，这里应该调用后端接口验证 token
    if (token === 'jkl' || storedToken === 'jkl') {
      isAdmin.value = true
      // 如果 URL 里有 token，保存到本地，方便后续刷新
      if (token) {
        localStorage.setItem('admin_token', token)
        // 可选：清除 URL 中的参数，避免分享链接时泄露
        // window.history.replaceState({}, document.title, window.location.pathname)
      }
    } else {
      isAdmin.value = false
    }
  }

  // 登出
  function logout() {
    isAdmin.value = false
    localStorage.removeItem('admin_token')
    
    // 清除 URL 中的 token 参数
    const url = new URL(window.location.href)
    if (url.searchParams.has('token')) {
      url.searchParams.delete('token')
      window.history.replaceState({}, document.title, url.pathname + url.search)
    }
  }

  return {
    isAdmin,
    checkAuth,
    logout
  }
})
