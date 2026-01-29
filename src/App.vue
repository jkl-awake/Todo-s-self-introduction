<script setup>
import { RouterLink, RouterView } from 'vue-router'
import VideoBackground from './components/VideoBackground.vue'
</script>

<template>
  <div class="app-container">
    <VideoBackground />
    <header class="main-header">
      <div class="wrapper">
        <RouterLink to="/" class="logo">
          <span class="logo-icon">🌌</span>
          <span class="logo-text">我的空间</span>
        </RouterLink>
        <nav>
          <RouterLink to="/games">游戏库</RouterLink>
          <RouterLink to="/learning">学习记录</RouterLink>
          <RouterLink to="/notes">随记</RouterLink>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
}

.logo-icon {
  animation: spin 10s linear infinite;
}

nav {
  display: flex;
  gap: 30px;
}

nav a {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  padding: 5px 0;
  transition: color 0.3s;
}

nav a:hover {
  color: var(--text-primary);
}

nav a.router-link-active {
  color: var(--accent-color);
}

nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent-color);
}

.main-content {
  flex: 1;
  max-width: 90vw;
  width: 100%;
  margin: 0 auto;
  padding: 12px 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
