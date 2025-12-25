<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const game = computed(() => gameStore.getGameById(route.params.id))

function deleteGame() {
  if (confirm('确定要删除这个游戏吗？')) {
    gameStore.deleteGame(game.value.id)
    router.push('/games')
  }
}
</script>

<template>
  <div v-if="game" class="game-detail">
    <div class="hero-section" :style="{ backgroundImage: `url(${game.cover})` }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="poster-wrapper">
          <img :src="game.cover" :alt="game.title" class="poster-art" />
        </div>
        <div class="hero-text">
          <h1>{{ game.title }}</h1>
          <div class="badges">
            <span class="badge platform">{{ game.platform }}</span>
            <span :class="['badge status', game.status.toLowerCase()]">{{ game.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="main-column">
        <section class="info-card glass-panel">
          <h2>📝 笔记</h2>
          <p class="notes-text">{{ game.notes || '暂无笔记。' }}</p>
        </section>
      </div>
      
      <div class="side-column">
        <section class="info-card glass-panel stats-panel">
          <div class="stat-item">
            <span class="label">游玩时长</span>
            <span class="value">{{ game.playtime }} 小时</span>
          </div>
          <div class="stat-item">
            <span class="label">评分</span>
            <span class="value rating">⭐ {{ game.rating }}/5</span>
          </div>
        </section>
        
        <div class="action-buttons">
          <button @click="deleteGame" class="delete-btn glass-panel">
            🗑️ 删除游戏
          </button>
          <RouterLink to="/games" class="back-btn glass-panel">
            ← 返回游戏库
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="not-found glass-panel">
    <h2>未找到游戏</h2>
    <RouterLink to="/games" class="back-btn">返回游戏库</RouterLink>
  </div>
</template>

<style scoped>
.game-detail {
  animation: fadeIn 0.5s ease;
}

.hero-section {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  border-radius: var(--card-radius);
  overflow: hidden;
  margin-bottom: 40px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 100%);
  backdrop-filter: blur(4px);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 40px;
  display: flex;
  gap: 40px;
  align-items: flex-end;
  width: 100%;
}

.poster-wrapper {
  position: relative;
}

.poster-wrapper::after {
  content: '';
  position: absolute;
  inset: -5px;
  background: linear-gradient(45deg, var(--accent-color), transparent);
  z-index: -1;
  border-radius: 16px;
  opacity: 0.3;
  filter: blur(10px);
}

.poster-art {
  width: 220px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border: 4px solid #fff;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: var(--text-primary);
  line-height: 1.1;
}

.badges {
  display: flex;
  gap: 15px;
}

.badge {
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
}

.badge.platform {
  background: rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.1);
  color: var(--text-primary);
}

.badge.status {
  border: 1px solid transparent;
}

.badge.status.completed { background: rgba(0, 255, 136, 0.1); border-color: var(--success-color); color: var(--success-color); }
.badge.status.playing { background: rgba(0, 242, 255, 0.1); border-color: var(--accent-color); color: var(--accent-color); }
.badge.status.backlog { background: rgba(0, 0, 0, 0.05); border-color: var(--text-secondary); color: var(--text-secondary); }
.badge.status.dropped { background: rgba(255, 77, 77, 0.1); border-color: var(--danger-color); color: var(--danger-color); }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.info-card {
  padding: 30px;
  border-radius: var(--card-radius);
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.info-card h2 {
  color: var(--accent-color);
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.notes-text {
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stat-item .label {
  color: var(--text-secondary);
}

.stat-item .value {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.stat-item .value.rating {
  color: #f59e0b;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delete-btn, .back-btn {
  display: block;
  width: 100%;
  padding: 15px;
  text-align: center;
  border-radius: var(--card-radius);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: 1px solid transparent;
  cursor: pointer;
}

.delete-btn {
  background: rgba(255, 77, 77, 0.1);
  color: var(--danger-color);
  border-color: rgba(255, 77, 77, 0.3);
}

.delete-btn:hover {
  background: var(--danger-color);
  color: #fff;
  box-shadow: 0 5px 15px rgba(255, 77, 77, 0.3);
}

.back-btn {
  background: rgba(255,255,255,0.5);
  color: var(--text-secondary);
}

.back-btn:hover {
  background: #fff;
  color: var(--text-primary);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.not-found {
  text-align: center;
  padding: 60px;
  border-radius: var(--card-radius);
  background: rgba(255, 255, 255, 0.6);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    flex-direction: column;
    align-items: center;
  }
  
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
