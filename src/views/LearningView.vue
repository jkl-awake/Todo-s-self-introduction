<script setup>
import { ref, computed } from 'vue'

// Mock Data Structure
const knowledgeBase = ref([
  {
    id: 'languages',
    name: '编程语言',
    icon: '💻',
    subs: [
      {
        id: 'python',
        name: 'Python',
        description: '人生苦短，我用 Python',
        articles: [
          { id: 101, title: 'Python 装饰器深入理解', date: '2025-12-20', status: '已掌握', content: '装饰器本质上是一个 Python 函数，它可以让其他函数在不需要做任何代码变动的前提下增加额外功能...' },
          { id: 102, title: 'Asyncio 异步编程指南', date: '2025-12-22', status: '学习中', content: 'Asyncio 是用来编写并发代码的库，使用 async/await 语法...' }
        ]
      },
      {
        id: 'js',
        name: 'JavaScript / TS',
        description: 'Web 开发的基石',
        articles: [
          { id: 201, title: 'ES6+ 新特性汇总', date: '2025-10-15', status: '已掌握', content: 'let, const, 箭头函数, 解构赋值...' },
          { id: 202, title: 'TypeScript 泛型实战', date: '2025-11-01', status: '复习中', content: '泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型...' }
        ]
      },
      {
        id: 'rust',
        name: 'Rust',
        description: '高性能与安全并存',
        articles: []
      }
    ]
  },
  {
    id: 'frameworks',
    name: '框架与架构',
    icon: '🏗️',
    subs: [
      { 
        id: 'vue', 
        name: 'Vue.js 生态', 
        description: '渐进式 JavaScript 框架',
        articles: [
          { id: 301, title: 'Vue 3 组合式 API 最佳实践', date: '2025-12-10', status: '学习中', content: 'Composition API 提供了更好的逻辑复用能力...' }
        ] 
      },
      { id: 'react', name: 'React', description: '构建用户界面的库', articles: [] },
      { id: 'spring', name: 'Spring Boot', description: 'Java 后端开发标准', articles: [] }
    ]
  },
  {
    id: 'cs',
    name: '计算机基础',
    icon: '🧠',
    subs: [
      { id: 'algo', name: '数据结构与算法', description: '内功修炼', articles: [] },
      { id: 'network', name: '计算机网络', description: '连接世界', articles: [] }
    ]
  }
])

const activeFilter = ref('All')
const filters = [
  { id: 'All', name: '全部' },
  { id: 'languages', name: '编程语言' },
  { id: 'frameworks', name: '框架' },
  { id: 'cs', name: '计算机基础' }
]

const filteredTopics = computed(() => {
  if (activeFilter.value === 'All') {
    return knowledgeBase.value
  }
  return knowledgeBase.value.filter(cat => cat.id === activeFilter.value)
})

const selectedTopic = ref(null)
const selectedArticle = ref(null)
const viewMode = ref('dashboard') // 'dashboard', 'timeline', 'article'

function openTopic(sub, category) {
  selectedTopic.value = {
    ...sub,
    categoryName: category.name,
    categoryIcon: category.icon
  }
  viewMode.value = 'timeline'
  selectedArticle.value = null
}

function openArticle(article) {
  selectedArticle.value = article
  viewMode.value = 'article'
}

function backToDashboard() {
  viewMode.value = 'dashboard'
  selectedTopic.value = null
}

function backToTimeline() {
  viewMode.value = 'timeline'
  selectedArticle.value = null
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
  <div class="learning-container">
    <div class="header-area" v-if="viewMode === 'dashboard'">
      <h1>知识库</h1>
      <div class="filter-bar glass-panel">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          class="filter-btn"
          :class="{ active: activeFilter === filter.id }"
          @click="activeFilter = filter.id"
        >
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- Dashboard View -->
    <Transition name="page" mode="out-in">
      <div v-if="viewMode === 'dashboard'" class="timeline-container">
        <div v-for="category in filteredTopics" :key="category.id" class="timeline-section">
          <div class="timeline-left">
            <div class="timeline-marker glass-panel">
              {{ category.icon }}
            </div>
            <div class="timeline-line"></div>
          </div>
          
          <div class="timeline-right">
            <h2 class="category-title">{{ category.name }}</h2>
            
            <div class="sub-grid">
              <div 
                v-for="sub in category.subs" 
                :key="sub.id" 
                class="topic-card glass-panel"
                @click="openTopic(sub, category)"
              >
                <div class="card-content">
                  <h3>{{ sub.name }}</h3>
                  <p>{{ sub.description }}</p>
                  <div class="card-footer">
                    <span class="article-count">{{ sub.articles.length }} 篇文章</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Timeline View -->
      <div v-else-if="viewMode === 'timeline'" class="detail-container">
        <button class="back-btn" @click="backToDashboard">← 返回知识库</button>
        
        <div class="topic-header-large">
          <div class="header-icon-large glass-panel">{{ selectedTopic.categoryIcon }}</div>
          <div class="header-text">
            <h2>{{ selectedTopic.name }}</h2>
            <p>{{ selectedTopic.description }}</p>
          </div>
        </div>

        <div class="article-timeline">
          <div v-if="selectedTopic.articles.length === 0" class="empty-state">
            <p>暂无文章，点击右上角添加。</p>
          </div>
          
          <div 
            v-for="article in selectedTopic.articles" 
            :key="article.id" 
            class="timeline-item"
            @click="openArticle(article)"
          >
            <div class="item-date">{{ article.date }}</div>
            <div class="item-dot"></div>
            <div class="item-card glass-panel">
              <div class="item-header">
                <h4>{{ article.title }}</h4>
                <span class="status-badge" :class="getStatusColor(article.status)">
                  {{ article.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Reading View -->
      <div v-else-if="viewMode === 'article'" class="detail-container">
        <button class="back-btn" @click="backToTimeline">← 返回列表</button>
        <div class="read-content glass-panel">
          <h1>{{ selectedArticle.title }}</h1>
          <div class="read-meta">
            <span>{{ selectedArticle.date }}</span>
            <span class="status-badge" :class="getStatusColor(selectedArticle.status)">
              {{ selectedArticle.status }}
            </span>
          </div>
          <div class="markdown-body">
            {{ selectedArticle.content }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.learning-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-area {
  margin-bottom: 40px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.filter-bar {
  display: inline-flex;
  padding: 6px;
  border-radius: 35px;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.filter-btn {
  padding: 10px 24px;
  border-radius: 25px;
  background: transparent;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  letter-spacing: 0.5px;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: translateY(-1px);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* Timeline Layout */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-left: 20px;
}

.timeline-section {
  display: flex;
  gap: 30px;
  position: relative;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.timeline-marker {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.timeline-line {
  flex: 1;
  width: 4px;
  background: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255,255,255,0.3);
}

.timeline-section:last-child .timeline-line {
  display: none;
}

.timeline-right {
  flex: 1;
  padding-bottom: 20px;
}

.category-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  display: flex;
  align-items: center;
  height: 60px; /* Align with marker */
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.sub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.topic-card {
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255,255,255,0.4);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
}

.topic-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.9);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-content h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: var(--text-primary);
  font-weight: 600;
}

.card-content p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.05);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Detail Views */
.detail-container {
  animation: fadeIn 0.3s ease;
}

.topic-header-large {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.header-icon-large {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: rgba(255,255,255,0.5);
}

.header-text h2 {
  font-size: 2.2rem;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.header-text p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* Article Timeline */
.article-timeline {
  position: relative;
  padding-left: 30px;
  border-left: 2px solid rgba(0,0,0,0.1);
  margin-left: 20px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  cursor: pointer;
}

.item-dot {
  position: absolute;
  left: -36px;
  top: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-color);
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.timeline-item:hover .item-dot {
  transform: scale(1.2);
  background: #fff;
  border-color: var(--accent-color);
}

.item-date {
  position: absolute;
  left: -140px;
  top: 18px;
  width: 90px;
  text-align: right;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.item-card {
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.4);
}

.timeline-item:hover .item-card {
  transform: translateX(10px);
  background: #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-header h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

/* Read View */
.back-btn {
  margin-bottom: 20px;
  background: transparent;
  color: var(--accent-color);
  font-weight: 600;
  font-size: 1rem;
  padding: 0;
  cursor: pointer;
  border: none;
}

.back-btn:hover {
  text-decoration: underline;
}

.read-content {
  padding: 40px;
  border-radius: 16px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.read-content h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color:#333
}

.read-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.markdown-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
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

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  margin-top: 50px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
