<script setup>
import { useGameStore } from '../stores/gameStore'
import { ref } from 'vue'

const gameStore = useGameStore()
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedGame = ref(null)

const newGame = ref({
  title: '',
  platform: 'PC',
  status: 'Backlog',
  rating: 0,
  cover: 'https://placeholder.co/150x200?text=New+Game',
  notes: ''
})

function openDetail(game) {
  selectedGame.value = game
  showDetailModal.value = true
}

function submitGame() {
  if (!newGame.value.title) return
  const gameToAdd = { ...newGame.value, playtime: 0 }
  gameStore.addGame(gameToAdd)
  showAddModal.value = false
  newGame.value = {
    title: '',
    platform: 'PC',
    status: 'Backlog',
    rating: 0,
    cover: 'https://placeholder.co/150x200?text=New+Game',
    notes: ''
  }
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
            <button @click="showAddModal = true" class="add-btn">
              <span class="icon">+</span> 记录新游戏
            </button>
          </div>
        </div>
      </div>
      
      <TransitionGroup name="list" tag="div" class="game-grid">
        <div v-for="game in gameStore.games" :key="game.id" class="game-card glass-panel" @click="openDetail(game)">
          <div class="card-image">
            <img :src="game.cover" :alt="game.title" loading="lazy" />
            <div class="card-overlay">
              <span class="play-btn">查看详情</span>
            </div>
            <div class="status-badge-card" :class="game.status.toLowerCase()">
              {{ game.status }}
            </div>
          </div>
          
          <div class="card-content">
            <h3 class="card-title">{{ game.title }}</h3>
            <div class="card-meta">
              <span class="platform-pill">{{ game.platform }}</span>
              <div class="mini-rating" v-if="game.rating > 0">
                ⭐ {{ game.rating }}
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Game Detail Modal -->
    <Transition name="modal">
      <div v-if="showDetailModal && selectedGame" class="modal-backdrop" @click.self="showDetailModal = false">
        <div class="modal-content glass-panel detail-modal">
          <div class="window-controls">
            <div class="terminal-dot red" @click="showDetailModal = false"></div>
            <div class="terminal-dot yellow"></div>
            <div class="terminal-dot green"></div>
          </div>
          
          <div class="detail-layout">
            <div class="detail-image">
              <img :src="selectedGame.cover" :alt="selectedGame.title" />
            </div>
            <div class="detail-info">
              <h2>{{ selectedGame.title }}</h2>
              <div class="detail-meta">
                <span class="platform-tag">{{ selectedGame.platform }}</span>
                <span class="status-badge" :class="selectedGame.status.toLowerCase()">{{ selectedGame.status }}</span>
              </div>
              <div class="rating large">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(selectedGame.rating) }">★</span>
              </div>
              <div class="detail-notes">
                <h3>游玩心得</h3>
                <div class="notes-content">
                  {{ selectedGame.notes || '暂无详细记录...' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Add Game Modal -->
    <Transition name="modal">
      <div v-if="showAddModal" class="modal-backdrop" @click.self="showAddModal = false">
        <div class="modal-content glass-panel">
          <div class="window-controls">
            <div class="terminal-dot red" @click="showAddModal = false"></div>
            <div class="terminal-dot yellow"></div>
            <div class="terminal-dot green"></div>
          </div>
          <h2>记录新瞬间</h2>
          <form @submit.prevent="submitGame">
            <div class="form-group">
              <label>标题</label>
              <input v-model="newGame.title" type="text" required placeholder="游戏或事件名称..." />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>平台/类别</label>
                <select v-model="newGame.platform">
                  <option>PC</option>
                  <option>Switch</option>
                  <option>PS5</option>
                  <option>Xbox</option>
                  <option>Mobile</option>
                  <option>Life</option>
                </select>
              </div>
              <div class="form-group">
                <label>状态</label>
                <select v-model="newGame.status">
                  <option value="Backlog">想去/想玩</option>
                  <option value="Playing">进行中</option>
                  <option value="Completed">已完成</option>
                  <option value="Dropped">搁置</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>评分</label>
              <div class="rating-input">
                <input v-model="newGame.rating" type="range" min="0" max="5" step="1" />
                <span>{{ newGame.rating }} 星</span>
              </div>
            </div>

            <div class="form-group">
              <label>封面图片 URL</label>
              <input v-model="newGame.cover" type="text" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label>心得评价</label>
              <textarea v-model="newGame.notes" rows="4" placeholder="写下你的感受..."></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="showAddModal = false" class="cancel-btn">取消</button>
              <button type="submit" class="submit-btn">保存记录</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
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
  margin-bottom: 30px;
  padding: 20px 30px;
  border-radius: var(--card-radius);
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.add-btn, .submit-btn {
  background: var(--accent-color);
  color: #fff;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.add-btn:hover, .submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Game Grid Styles */
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  padding-bottom: 40px;
}

.game-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  position: relative;
  height: 100%;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.8);
}

.card-image {
  position: relative;
  width: 100%;
  padding-top: 133%; /* 3:4 Aspect Ratio */
  overflow: hidden;
  background: #eee;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
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
  background: #fff;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.game-card:hover .play-btn {
  transform: translateY(0);
}

.status-badge-card {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
}

.status-badge-card.backlog { background: rgba(189, 195, 199, 0.9); }
.status-badge-card.playing { background: rgba(46, 204, 113, 0.9); }
.status-badge-card.completed { background: rgba(241, 196, 15, 0.9); }
.status-badge-card.dropped { background: rgba(231, 76, 60, 0.9); }

.card-content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.platform-pill {
  font-size: 0.75rem;
  background: rgba(0,0,0,0.06);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.mini-rating {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1c40f;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: var(--card-radius);
  background: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.modal-content.detail-modal {
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.detail-layout {
  display: flex;
  gap: 30px;
  height: 100%;
  overflow: hidden;
  margin-top: 20px;
}

.detail-image {
  flex: 0 0 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.detail-info h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.detail-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
}

.detail-notes {
  margin-top: 30px;
}

.detail-notes h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: var(--text-primary);
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.notes-content {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.modal-content h2 {
  margin-bottom: 20px;
  text-align: center;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(9, 132, 227, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.cancel-btn {
  background: transparent;
  color: var(--text-secondary);
  padding: 8px 16px;
}

.cancel-btn:hover {
  color: var(--text-primary);
  background: #f1f2f6;
  border-radius: 6px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* List Animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
