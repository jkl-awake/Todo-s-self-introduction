import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useGameStore = defineStore('game', () => {
  // Load from localStorage if available, otherwise use default
  const storedGames = localStorage.getItem('my-games')
  const games = ref(storedGames ? JSON.parse(storedGames) : [
    {
      id: 1,
      title: '塞尔达传说：旷野之息',
      platform: 'Switch',
      status: 'Completed',
      rating: 5,
      cover: 'https://placeholder.co/150x200?text=Zelda',
      playtime: 120,
      notes: '神作，开放世界的标杆。'
    },
    {
      id: 2,
      title: '艾尔登法环',
      platform: 'PC',
      status: 'Playing',
      rating: 4.5,
      cover: 'https://placeholder.co/150x200?text=Elden+Ring',
      playtime: 45,
      notes: '非常难，但是探索感无与伦比。'
    },
    {
      id: 3,
      title: '赛博朋克 2077',
      platform: 'PC',
      status: 'Backlog',
      rating: 0,
      cover: 'https://placeholder.co/150x200?text=Cyberpunk',
      playtime: 0,
      notes: ''
    }
  ])

  const isLoading = ref(false)
  const error = ref(null)

  // 示例：从 API 加载游戏列表
  async function fetchGames() {
    isLoading.value = true
    error.value = null
    try {
      // 这是一个示例 API 地址，你需要替换成真实的后端 API
      // const response = await fetch('http://localhost:5053/games')
      
      // 模拟 API 请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟返回数据（实际使用时请取消上面 fetch 的注释并删除下面的模拟数据）
      // if (!response.ok) throw new Error('Failed to fetch games')
      // const data = await response.json()
      // games.value = data
      
      console.log('API 请求示例已执行')
    } catch (err) {
      error.value = err.message
      console.error('Error fetching games:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Watch for changes and save to localStorage
  watch(games, (newGames) => {
    localStorage.setItem('my-games', JSON.stringify(newGames))
  }, { deep: true })

  function addGame(game) {
    games.value.push({ 
      ...game, 
      id: Date.now(),
      rating: Number(game.rating),
      playtime: Number(game.playtime)
    })
  }

  function getGameById(id) {
    return games.value.find(g => g.id === Number(id))
  }

  function deleteGame(id) {
    const index = games.value.findIndex(g => g.id === id)
    if (index !== -1) {
      games.value.splice(index, 1)
    }
  }

  return { games, isLoading, error, fetchGames, addGame, getGameById, deleteGame }
})
