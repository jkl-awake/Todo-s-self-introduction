<script setup>
import { useGameStore } from '../stores/gameStore'
import { computed } from 'vue'

const gameStore = useGameStore()

const totalGames = computed(() => gameStore.games.length)
const completedGames = computed(() => gameStore.games.filter(g => g.status === 'Completed').length)
const playingGames = computed(() => gameStore.games.filter(g => g.status === 'Playing').length)
const backlogGames = computed(() => gameStore.games.filter(g => g.status === 'Backlog').length)
</script>

<template>
  <div class="statistics">
    <h1>你的生活足迹</h1>
    
    <div class="stats-grid">
      <div class="stat-card glass-panel">
        <div class="icon">📝</div>
        <h3>记录总数</h3>
        <p class="stat-value">{{ totalGames }}</p>
      </div>
      <div class="stat-card glass-panel">
        <div class="icon">✨</div>
        <h3>进行中</h3>
        <p class="stat-value">{{ playingGames }}</p>
      </div>
      <div class="stat-card glass-panel">
        <div class="icon">🏁</div>
        <h3>已完成</h3>
        <p class="stat-value">{{ completedGames }}</p>
      </div>
      <div class="stat-card glass-panel">
        <div class="icon">📌</div>
        <h3>想去/想玩</h3>
        <p class="stat-value">{{ backlogGames }}</p>
      </div>
    </div>

    <div class="charts-placeholder">
      <div class="chart-card glass-panel">
        <h3>活跃度概览</h3>
        <div class="fake-chart">
          <div class="bar" style="height: 40%"></div>
          <div class="bar" style="height: 70%"></div>
          <div class="bar" style="height: 50%"></div>
          <div class="bar" style="height: 90%"></div>
          <div class="bar" style="height: 30%"></div>
          <div class="bar" style="height: 60%"></div>
          <div class="bar" style="height: 80%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics {
  animation: slideUp 0.5s ease;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: var(--text-primary);
  letter-spacing: -1px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 30px;
  border-radius: var(--card-radius);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  opacity: 0.9;
}

.stat-card h3 {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 3.5rem;
  font-weight: 300;
  margin: 10px 0 0 0;
  line-height: 1;
  color: var(--text-primary);
}

.chart-card {
  padding: 30px;
  border-radius: var(--card-radius);
  background: rgba(255, 255, 255, 0.5);
}

.chart-card h3 {
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  font-weight: 600;
}

.fake-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  margin-top: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.bar {
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px 4px 0 0;
  transition: height 1s ease, background 0.3s;
  position: relative;
}

.bar:hover {
  background: var(--accent-color);
  box-shadow: 0 0 15px rgba(9, 132, 227, 0.3);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
