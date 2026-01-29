<script setup>
import { ref, computed } from 'vue'
import { useContentStore } from '../stores/contentStore'
import { storeToRefs } from 'pinia'

const store = useContentStore()
const { knowledgeBase } = storeToRefs(store)

const activeCategory = ref(knowledgeBase.value?.[0]?.id || '')
const activeSubTopic = ref(knowledgeBase.value?.[0]?.subs?.[0]?.id || '')
const activeArticle = ref(null)

// 默认选中第一篇文章
const firstSub = knowledgeBase.value?.[0]?.subs?.[0]
if (firstSub?.articles?.length > 0) {
  activeArticle.value = firstSub.articles[0]
}

const currentCategory = computed(() => {
  return knowledgeBase.value.find(c => c.id === activeCategory.value)
})

const currentSubTopic = computed(() => {
  return currentCategory.value?.subs?.find(s => s.id === activeSubTopic.value)
})

function selectCategory(id) {
  activeCategory.value = id
  // Reset sub selection
  const cat = knowledgeBase.value.find(c => c.id === id)
  if (cat?.subs?.length > 0) {
    selectSubTopic(cat.subs[0].id)
  } else {
    activeSubTopic.value = ''
    activeArticle.value = null
  }
}

function selectSubTopic(id) {
  activeSubTopic.value = id
  const sub = currentCategory.value?.subs?.find(s => s.id === id)
  if (sub?.articles?.length > 0) {
    activeArticle.value = sub.articles[0]
  } else {
    activeArticle.value = null
  }
}

function selectArticle(article) {
  activeArticle.value = article
}

function getStatusColor(status) {
  const map = {
    '已掌握': 'green',
    '学习中': 'blue',
    '复习中': 'yellow',
    '待开始': 'gray'
  }
  return map[status] || 'gray'
}
</script>

<template>
  <div class="kb-container">
    <div class="glass-layout">
      <!-- Sidebar: Categories & Topics -->
      <aside class="kb-sidebar">
        <div class="sidebar-header">
          <h2>知识库</h2>
        </div>
        
        <div class="nav-groups">
          <div v-for="category in knowledgeBase" :key="category.id" class="nav-group">
            <div 
              class="group-title"
              :class="{ active: activeCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <span class="icon">{{ category.icon }}</span>
              {{ category.name }}
            </div>
            
            <div class="sub-list" v-if="activeCategory === category.id">
              <div 
                v-for="sub in category.subs" 
                :key="sub.id"
                class="sub-item"
                :class="{ active: activeSubTopic === sub.id }"
                @click.stop="selectSubTopic(sub.id)"
              >
                <span class="sub-name">{{ sub.name }}</span>
                <span class="count-badge" v-if="sub.articles.length">{{ sub.articles.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Middle: Article List -->
      <div class="article-list-panel">
        <div class="panel-header">
          <h3>{{ currentSubTopic?.name }}</h3>
          <p class="subtitle">{{ currentSubTopic?.description }}</p>
        </div>

        <div class="article-list">
          <div v-if="!currentSubTopic?.articles.length" class="empty-state">
            暂无文章
          </div>
          
          <div 
            v-for="article in currentSubTopic?.articles" 
            :key="article.id"
            class="article-card"
            :class="{ active: activeArticle?.id === article.id }"
            @click="selectArticle(article)"
          >
            <div class="card-top">
              <h4>{{ article.title }}</h4>
              <span class="status-dot" :class="getStatusColor(article.status)"></span>
            </div>
            <div class="card-meta">
              <span>{{ article.date }}</span>
              <span class="status-text">{{ article.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Article Content -->
      <main class="content-area">
        <div v-if="activeArticle" class="article-viewer">
          <div class="article-header">
            <h1>{{ activeArticle.title }}</h1>
            <div class="meta-tags">
              <span class="date">📅 {{ activeArticle.date }}</span>
              <span class="status-badge" :class="getStatusColor(activeArticle.status)">
                {{ activeArticle.status }}
              </span>
            </div>
          </div>
          
          <div class="article-body markdown-body">
            {{ activeArticle.content }}
          </div>
        </div>
        
        <div v-else class="empty-selection">
          <div class="placeholder-icon">📚</div>
          <p>选择一篇文章开始阅读</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.kb-container {
  height: calc(100vh - 120px); /* 减去 header 高度 */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  overflow: hidden;
}

/* Main Unified Glass Layout */
.glass-layout {
  display: grid;
  grid-template-columns: 220px 260px 1fr; /* 稍微减小侧边栏宽度，给内容区更多空间 */
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Sidebar Styles */
.kb-sidebar {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: rgba(240, 242, 245, 0.5);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.sidebar-header h2 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--text-primary);
  font-weight: 700;
  padding-left: 10px;
  opacity: 0.8;
}

.nav-group {
  margin-bottom: 5px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.2s;
  font-size: 0.95rem;
}

.group-title:hover {
  background: rgba(0,0,0,0.03);
  color: var(--text-primary);
}

.group-title.active {
  background: #fff;
  color: var(--accent-color);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.sub-list {
  margin: 5px 0 10px 15px;
  padding-left: 10px;
  border-left: 2px solid rgba(0,0,0,0.05);
}

.sub-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 2px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.sub-item:hover {
  background: rgba(0,0,0,0.03);
}

.sub-item.active {
  background: rgba(9, 132, 227, 0.1);
  color: var(--accent-color);
  font-weight: 600;
}

.count-badge {
  background: rgba(0,0,0,0.05);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Article List Panel */
.article-list-panel {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.4);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  background: rgba(255,255,255,0.3);
}

.panel-header h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
  color: var(--text-primary);
  font-weight: 700;
}

.subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.article-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.article-card {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.article-card:hover {
  background: rgba(255,255,255,0.6);
}

.article-card.active {
  background: #fff;
  border-color: rgba(0,0,0,0.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.card-top h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.status-dot.green { background: #2ecc71; }
.status-dot.blue { background: #0984e3; }
.status-dot.yellow { background: #f1c40f; }
.status-dot.gray { background: #b2bec3; }

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* Content Area */
.content-area {
  background: #fff;
  padding: 30px 40px; /* 减小 padding，避免在小屏幕上挤压内容 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
}

.article-viewer {
  width: 100%;
  max-width: 900px; /* 稍微放宽最大宽度，但保持可读性 */
  min-width: 0; /* 关键：允许在 Flex 容器中收缩 */
}

.article-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.article-header h1 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.3;
}

.meta-tags {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.green { background: #e3f9e5; color: #27c93f; }
.status-badge.blue { background: #e3f2fd; color: #0984e3; }
.status-badge.yellow { background: #fff3cd; color: #f1c40f; }
.status-badge.gray { background: #f1f2f6; color: #a4b0be; }



.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #34495e;
  white-space: pre-wrap;
  width: 100%;
  overflow-wrap: break-word; /* 防止长单词导致溢出 */
  word-wrap: break-word;
}

.empty-selection, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.3;
  color: #ccc;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.2);
}
</style>
