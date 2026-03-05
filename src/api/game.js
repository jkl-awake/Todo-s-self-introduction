import { callApi } from '@/utils/request'

// 定义转换器 Adapter：将后端的分页结构转换为前端简单的数组
// 后端: { code: 200, data: { records: [...] }, message: "" }
// 前端需要的: [...]
const gameListAdapter = (response) => {
  // 1. 如果有 data 字段，先取 data
  const data = response.data || response
  
  // 构造统一的分页结果对象
  const result = {
    list: [],
    total: 0,
    current: 1,
    size: 10
  }

  // 2. 如果 data 里有 records 字段 (标准分页结构)
  if (data && Array.isArray(data.records)) {
    result.list = data.records.map(item => ({
      id: item.id,
      title: item.name,      // 字段映射: name -> title
      platform: item.platform || 'Unknown',
      rating: item.star || 0, // 字段映射: star -> rating
      cover: item.image || '', // 字段映射: image -> cover
      status: 'Backlog',     // 默认值，因为后端没返回
      playtime: 1,           // 默认值
      notes: item.evaluation || '' // 字段映射
    }))
    result.total = data.total || 0
    result.current = data.current || 1
    result.size = data.size || 10
    return result
  }
  
  // 3. 如果直接是数组 (非分页结构兼容)
  if (Array.isArray(data)) {
    result.list = data
    result.total = data.length
    return result
  }
  
  return result
}

const platformMap = {
  'PC': 1,
  'Switch': 2,
  'PS5': 3,
  'Xbox': 4,
  'Mobile': 5,
  'Life': 6
}

const platformMapReverse = {
  1: 'PC',
  2: 'Switch',
  3: 'PS5',
  4: 'Xbox',
  5: 'Mobile',
  6: 'Life'
}

// 详情转换器 Adapter
// 后端: { data: { gameId, gameName, playingExperiences: [...] } }
// 前端需要的: { id, title, notes, ... }
const gameDetailAdapter = (response) => {
  const data = response.data || response
  if (!data) return null

  // 解析 experiences
  let experiences = []
  if (Array.isArray(data.playingExperiences)) {
    experiences = data.playingExperiences.map(exp => {
      // 兼容处理：如果是字符串（旧格式）
      if (typeof exp === 'string') {
        return { content: exp, id: 0, createTime: null }
      }
      // 如果是对象（新格式）
      return {
        content: exp.context || '', // 注意字段是 context
        id: exp.playingExperienceId || 0,
        createTime: exp.createTime || null
      }
    })
  }

  return {
    id: data.gameId || data.id,
    title: data.gameName || data.name,
    cover: data.gameImage || data.image || '',
    rating: data.star || 0,
    platform: platformMapReverse[data.platform] || 'Unknown', 
    createTime: data.createTime,
    // 将多条心得合并显示
    notes: experiences.map(e => e.content).join('\n\n'),
    // 保留结构化体验数组
    experiences: experiences
  }
}

export const gameApi = {
  // 获取游戏列表
  list(params) {
    return callApi('/api/game/GetGames', 'POST', params, {}, gameListAdapter)
  },

  // 获取单个游戏详情
  get(id) {
    return callApi(`/api/game/GetGameWithPlayingExperience?gameId=${id}`, 'GET', {}, {}, gameDetailAdapter)
  },

  // 统一的新增/编辑操作 (新增 id=0, 编辑 id=gameId)
  operation(data) {
    const payload = {
      id: data.id || 0,
      name: data.gameName || data.title || data.name,
      platform: typeof data.platform === 'number' ? data.platform : (platformMap[data.platform] || 1),
      gameStatus: 0, // 默认状态
      star: data.star || data.rating || 0,
      image: data.gameImage || data.cover || data.image || '',
      evaluation: data.evaluation || data.notes || '', 
      playingExperiences: (data.experiences || []).map(exp => ({
        gameId: data.id || 0,
        playingExperienceId: exp.playingExperienceId || exp.id || 0,
        context: exp.context || exp.content || ''
      }))
    }
    return callApi('/api/game/OperateGamePlayingExperience', 'POST', payload)
  },

  // 删除游戏
  delete(id) {
    return callApi(`/api/game/DeleteGame?id=${id}`, 'POST')
  }
}

