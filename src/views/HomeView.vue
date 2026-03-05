<script setup>
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import { ref, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import GameDetailDialog from './GameDetailDialog.vue'

const gameStore = useGameStore()
const authStore = useAuthStore()
const showAddModal = ref(false)
const showDetailModal = ref(false)
const isEditMode = ref(false)
const selectedGame = ref(null)

// 页面加载时调用 API 获取数据
onMounted(() => {
  gameStore.fetchGames()
})

const playingExperiences = [{
  playingExperienceId: 0,
  context: '',
  createTime:''
}]

const newGame = ref({
  gameId:0,
  gameName: '',
  platform: 1,
  star: 1,
  gameImage: 'https://placeholder.co/150x200?text=New+Game',
  experiences: playingExperiences
})

async function openDetail(game) {
  selectedGame.value = game // 先显示现有数据
  showDetailModal.value = true
  
  // 异步获取最新详情
  try {
    const detail = await gameStore.fetchGameDetail(game.id)
    if (detail) {
      // 合并或更新详情数据 (注意这里可能需要根据后端返回格式调整)
      // 如果后端返回的就是完整的游戏对象，直接覆盖
      // 注意字段映射，如果后端详情接口返回字段和列表不一样，可能需要再做一次 Adapter 转换
      // 假设后端详情接口返回的字段已经比较全或者是标准的
      selectedGame.value = { ...selectedGame.value, ...detail }
    }
  } catch (err) {
    console.error('Failed to fetch detail', err)
  }
}

async function submitGame() {
  if (!newGame.value.gameName) return
  
  // 过滤掉空的心得
  const experiences = newGame.value.experiences
    .filter(e => e.context && e.context.trim() !== '' && e.context !== '<p><br></p>')
    
  const payload = {
    ...newGame.value,
    experiences
  }

  try {
    if (isEditMode.value) {
      // 编辑模式
      // 注意：updateGame 的 id 参数可能是 gameId 或 id
      const gameId = newGame.value.gameId || newGame.value.id
      await gameStore.updateGame(gameId, payload)
      ElMessage.success('更新成功')
      
      // 如果正在查看详情，同时也更新详情里的数据显示
      if (selectedGame.value && (selectedGame.value.id === gameId || selectedGame.value.gameId === gameId)) {
        // 更新 selectedGame 用于即时显示
        // 需要将 newGame 的结构转换回 selectedGame 的结构 (Adapter 结构)
        const platformMapReverse = { 1: 'PC', 2: 'Switch', 3: 'PS5', 4: 'Xbox', 5: 'Mobile', 6: 'Life' }
        
        const updatedExperiences = experiences.map(exp => ({
          content: exp.context,
          id: exp.playingExperienceId || exp.id || 0,
          createTime: exp.createTime
        }))
        
        selectedGame.value = { 
          ...selectedGame.value, 
          title: newGame.value.gameName,
          cover: newGame.value.gameImage,
          rating: newGame.value.star,
          platform: platformMapReverse[newGame.value.platform] || 'Unknown',
          experiences: updatedExperiences,
          // 更新 notes 用于降级显示
          notes: updatedExperiences.map(e => e.content).join('\n\n')
        }
      }
    } else {
      // 新增模式
      const gameToAdd = { ...payload, gameId: 0 }
      await gameStore.addGame(gameToAdd)
      ElMessage.success('添加成功')
    }
    showAddModal.value = false
    resetForm()
  } catch (err) {
    ElMessage.error(err.message || '操作失败')
  }
}

function resetForm() {
  newGame.value = {
    gameId: 0,
    gameName: '',
    platform: 1,
    star: 0,
    gameImage: 'https://placeholder.co/150x200?text=New+Game',
    status: 'Backlog',
    experiences: [{ playingExperienceId: 0, context: '', createTime: '' }]
  }
}

function openAddModal() {
  isEditMode.value = false
  resetForm()
  showAddModal.value = true
}

function openEditModal() {
  if (!selectedGame.value) return
  isEditMode.value = true
  
  // 深拷贝数据到表单，并进行字段转换 (Adapter -> API/Form)
  const source = selectedGame.value
  const platformMap = { 'PC': 1, 'Switch': 2, 'PS5': 3, 'Xbox': 4, 'Mobile': 5, 'Life': 6 }
  
  // 处理 experiences 数据
  let experiences = []
  if (source.experiences && source.experiences.length > 0) {
    experiences = source.experiences.map(exp => ({ 
      context: exp.content, 
      playingExperienceId: exp.id || 0,
      createTime: exp.createTime
    }))
  } else if (source.notes) {
    experiences = [{ context: source.notes, playingExperienceId: 0, createTime: '' }]
  } else {
    experiences = [{ context: '', playingExperienceId: 0, createTime: '' }]
  }
  
  newGame.value = {
    gameId: source.id, // 或者 source.gameId
    id: source.id,
    gameName: source.title, // title -> gameName
    platform: platformMap[source.platform] || 1,
    star: source.rating, // rating -> star
    gameImage: source.cover, // cover -> gameImage
    status: source.status || 'Backlog',
    experiences: experiences
  }
  
  showDetailModal.value = false 
  showAddModal.value = true
}

function addExperienceBlock() {
  newGame.value.experiences.push({ playingExperienceId: 0, context: '', createTime: '' })
}

function removeExperienceBlock(index) {
  newGame.value.experiences.splice(index, 1)
}

function getStatusType(status) {
  const map = {
    'Backlog': 'info',
    'Playing': 'warning',
    'Completed': 'success',
    'Dropped': 'danger'
  }
  return map[status] || 'info'
}

function handleDelete(id) {
  gameStore.deleteGame(id)
  showDetailModal.value = false
}
</script>

<template>
  <div class="home">
    <!-- Game Library Section -->
    <div class="library-section">
      <div class="header-section glass-panel">
        <div class="header-row">
          <div class="header-content">
            <h1>游戏库</h1>
            <p class="subtitle">收藏的每一个世界</p>
          </div>
          <div class="actions">
            <el-button v-if="authStore.isAdmin" type="primary" :icon="Plus" @click="openAddModal" size="large">
              记录新游戏
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <el-skeleton v-if="gameStore.isLoading" :rows="3" animated class="glass-panel" style="padding: 20px;" />

      <!-- Error State -->
      <div v-else-if="gameStore.error" class="glass-panel" style="padding: 20px;">
        <el-alert :title="gameStore.error" type="error" show-icon :closable="false">
          <div style="margin-top: 10px;">
            <el-button type="danger" size="small" @click="gameStore.fetchGames()">重试</el-button>
          </div>
        </el-alert>
      </div>
      
      <!-- Empty State -->
      <el-empty v-else-if="gameStore.games.length === 0" description="暂无游戏数据" class="glass-panel">
        <el-button v-if="authStore.isAdmin" type="primary" @click="showAddModal = true">去添加</el-button>
      </el-empty>

      <template v-else>
        <TransitionGroup name="list" tag="div" class="game-grid">
          <div v-for="game in gameStore.games" :key="game.id || game.gameId" class="game-card glass-panel" @click="openDetail(game)">
            <div class="card-image">
              <img :src="game.cover || game.gameImage" :alt="game.title || game.gameName" loading="lazy" />
              <div class="card-overlay">
                <span class="play-btn">查看详情</span>
              </div>
              <div class="status-badge-card" :class="(game.status || 'backlog').toLowerCase()">
                {{ game.status }}
              </div>
            </div>
            
            <div class="card-content">
              <h3 class="card-title">{{ game.title || game.gameName }}</h3>
              <div class="card-meta">
                <span class="platform-pill">{{ game.platform }}</span>
                <div class="mini-rating" v-if="(game.rating || game.star) > 0">
                  ⭐ {{ game.rating || game.star }}
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Pagination -->
        <div class="pagination-wrapper" style="display: flex; justify-content: center; margin-top: 20px; padding-bottom: 20px;">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="gameStore.pagination.total"
            :page-size="gameStore.pagination.size"
            v-model:current-page="gameStore.pagination.current"
            @current-change="(page) => gameStore.fetchGames(page)"
          />
        </div>
      </template>
    </div>

    <!-- Game Detail Modal -->
    <GameDetailDialog
      v-model="showDetailModal"
      :selected-game="selectedGame"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <!-- Add/Edit Game Modal -->
    <el-dialog v-model="showAddModal" :title="isEditMode ? '编辑记录' : '记录新瞬间'" width="600px" align-center class="glass-dialog">
      <el-form :model="newGame" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="newGame.gameName" placeholder="游戏或事件名称..." />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="平台">
              <el-select v-model="newGame.platform" style="width: 100%">
                <el-option label="PC" :value="1" />
                <el-option label="Switch" :value="2" />
                <el-option label="PS5" :value="3" />
                <el-option label="Xbox" :value="4" />
                <el-option label="Mobile" :value="5" />
                <el-option label="Life" :value="6" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="newGame.status" style="width: 100%">
                <el-option label="想去/想玩" value="Backlog" />
                <el-option label="进行中" value="Playing" />
                <el-option label="已完成" value="Completed" />
                <el-option label="搁置" value="Dropped" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="评分">
          <el-rate v-model="newGame.star" allow-half />
        </el-form-item>

        <el-form-item label="封面">
          <el-input v-model="newGame.gameImage" placeholder="图片链接..." />
        </el-form-item>

        <div class="experiences-edit-section">
          <div class="section-header">
            <span class="label">游玩体验 (富文本)</span>
            <el-button type="primary" link :icon="Plus" @click="addExperienceBlock">添加段落</el-button>
          </div>
          
          <div v-for="(exp, index) in newGame.experiences" :key="index" class="experience-editor-block">
            <div class="editor-header">
              <span>段落 {{ index + 1 }}</span>
              <el-button type="danger" link :icon="Delete" @click="removeExperienceBlock(index)" v-if="newGame.experiences.length > 1">删除</el-button>
            </div>
            <QuillEditor 
              v-model:content="exp.context" 
              contentType="html" 
              theme="snow" 
              toolbar="minimal" 
              style="height: 150px; background: rgba(255,255,255,0.9); color: #333;"
            />
          </div>
        </div>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="submitGame">{{ isEditMode ? '保存修改' : '保存记录' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* Terminal Styles */
.terminal-section {
  background: var(--terminal-bg);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  font-family: 'Fira Code', 'Consolas', monospace;
  color: #fff;
}

.terminal-content {
  margin-top: 10px;
}

.command-line {
  margin-bottom: 10px;
}

.prompt {
  color: #2ecc71;
  margin-right: 10px;
}

.cmd {
  color: #fff;
}

.output {
  color: var(--terminal-text);
  font-size: 0.9rem;
  line-height: 1.5;
  padding-left: 10px;
  border-left: 2px solid rgba(255,255,255,0.1);
}

.status-ok {
  color: #2ecc71;
  font-weight: bold;
}

.header-section {
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #2d3436, #0984e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.add-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(9, 132, 227, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(9, 132, 227, 0.4);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 10px;
}

.game-card {
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.card-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .card-overlay {
  opacity: 1;
}

.play-btn {
  color: white;
  border: 2px solid white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
}

.status-badge-card {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
}

.status-badge-card.completed { background: #2ecc71; }
.status-badge-card.playing { background: #0984e3; }
.status-badge-card.backlog { background: #fdcb6e; color: #2d3436; }
.status-badge-card.dropped { background: #ff7675; }

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.platform-pill {
  background: rgba(0,0,0,0.05);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.mini-rating {
  font-size: 0.9rem;
  color: #f1c40f;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: 30px;
  max-height: 90vh;
  overflow-y: auto;
}

.detail-modal {
  max-width: 800px;
  padding: 0;
  overflow: hidden;
}

.detail-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 400px;
}

.detail-image {
  background: #000;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.detail-info {
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.detail-info h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.detail-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.platform-tag {
  background: var(--terminal-bg);
  color: var(--terminal-text);
  padding: 5px 15px;
  border-radius: 4px;
  font-family: monospace;
}

.rating-display {
  color: #ddd;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.star.filled {
  color: #f1c40f;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.info-item label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.info-item span {
  font-weight: 600;
  font-size: 1.1rem;
}

.notes-section h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.notes-section p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  background: #ff7675;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 0.9;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-secondary);
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  background: rgba(255,255,255,0.8);
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  background: white;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 15px;
}

input[type="range"] {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-secondary);
}

.submit-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(9, 132, 227, 0.3);
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Loading/Error States */
.loading-state,
.error-state,
.empty-state {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Element Plus Overrides for Glassmorphism */
:deep(.glass-dialog) {
  --text-primary: rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.72);

  --el-dialog-bg-color: rgba(30, 30, 40, 0.95) !important;
  --el-text-color-primary: var(--text-primary);
  --el-text-color-regular: var(--text-secondary);
  --el-border-color: rgba(255, 255, 255, 0.12);
  --el-fill-color-blank: rgba(255, 255, 255, 0.03);
  --el-fill-color-light: rgba(255, 255, 255, 0.06);

  color: var(--text-primary);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  border-radius: 16px !important;
  overflow: hidden;
}

:deep(.glass-dialog .el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 25px;
}

:deep(.glass-dialog .el-dialog__title) {
  color: var(--text-primary);
}

:deep(.glass-dialog .el-dialog__body) {
  padding: 30px;
  color: var(--text-primary);
}

:deep(.glass-dialog .el-dialog__footer) {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 25px;
  background: rgba(0, 0, 0, 0.2);
}

:deep(.glass-dialog .el-descriptions__label) {
  color: var(--text-secondary);
}

:deep(.glass-dialog .el-descriptions__content) {
  color: var(--text-primary);
}

:deep(.glass-dialog .el-input__wrapper),
:deep(.glass-dialog .el-textarea__inner),
:deep(.glass-dialog .el-select__wrapper) {
  background-color: rgba(255, 255, 255, 0.06) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  color: var(--text-primary);
}

:deep(.glass-dialog .el-input__wrapper:hover),
:deep(.glass-dialog .el-textarea__inner:hover) {
  background-color: rgba(255, 255, 255, 0.09) !important;
}

:deep(.glass-dialog .el-input__wrapper.is-focus),
:deep(.glass-dialog .el-textarea__inner:focus) {
  background-color: rgba(255, 255, 255, 0.11) !important;
  box-shadow: 0 0 0 1px var(--accent-color) !important;
}
.notes-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: var(--text-secondary);
  background: rgba(128,128,128,0.1);
  padding: 15px;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.95rem;
}

/* Experiences List Styles */
.experiences-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
}

.experience-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.experience-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.exp-header {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

.exp-date {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
}

.exp-content {
  padding: 12px;
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap;
}

/* Scrollbar for experiences list */
.experiences-list::-webkit-scrollbar {
  width: 6px;
}

.experiences-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.experiences-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.experiences-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Editor Styles */
.experiences-edit-section {
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: var(--text-primary);
  font-weight: bold;
}

.experience-editor-block {
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

:deep(.ql-toolbar) {
  background: #f5f5f5;
  border-color: #ccc !important;
}

:deep(.ql-container) {
  border-color: #ccc !important;
  background: #fff;
  color: #333;
}
</style>
