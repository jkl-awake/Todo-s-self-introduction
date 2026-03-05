import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { gameApi } from '@/api/game'

export const useGameStore = defineStore('game', () => {
  // 状态 State
  const games = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // 分页状态
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })

  // 动作 Actions (调用后端 API)

  // 1. 获取列表
  async function fetchGames(page = 1, size = 10) {
    isLoading.value = true
    error.value = null
    try {
      // 调用封装好的 API 方法
      // 传入分页参数
      const params = { current: page, size: size }
      const res = await gameApi.list(params)
      
      // 更新列表
      games.value = res.list || []
      
      // 更新分页状态
      pagination.value.current = res.current || page
      pagination.value.size = res.size || size
      pagination.value.total = res.total || 0
    } catch (err) {
      error.value = err.message || '加载失败'
      console.error('Error fetching games:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 2. 新增游戏
  async function addGame(gameData) {
    isLoading.value = true
    try {
      const payload = { ...gameData, id: 0 }
      const res = await gameApi.operation(payload)
      // 如果后端返回了新对象则添加到列表，否则重新拉取
      if (res && res.id) {
        games.value.push(res)
      } else {
        await fetchGames()
      }
      return res
    } catch (err) {
      error.value = err.message || '添加失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 3. 更新游戏
  async function updateGame(id, gameData) {
    isLoading.value = true
    try {
      const payload = { ...gameData, id: id }
      await gameApi.operation(payload)
      // 更新本地状态
      const index = games.value.findIndex(g => g.id === id)
      if (index !== -1) {
        // 合并新数据
        games.value[index] = { ...games.value[index], ...gameData }
      }
    } catch (err) {
      error.value = err.message || '更新失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 4. 删除游戏
  async function deleteGame(id) {
    try {
      await gameApi.delete(id)
      const index = games.value.findIndex(g => g.id === id)
      if (index !== -1) {
        games.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message || '删除失败'
      throw err
    }
  }

  // 4. 获取游戏详情
  async function fetchGameDetail(id) {
    try {
      const detail = await gameApi.get(id)
      return detail
    } catch (err) {
      console.error('Error fetching game detail:', err)
      throw err
    }
  }

  // Getters
  function getGameById(id) {
    return games.value.find(g => g.id === Number(id))
  }

  return { 
    games, 
    isLoading, 
    error, 
    pagination,
    fetchGames, 
    fetchGameDetail,
    addGame, 
    updateGame,
    deleteGame, 
    getGameById 
  }
})
