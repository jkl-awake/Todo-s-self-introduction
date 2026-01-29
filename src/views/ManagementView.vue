<script setup>
import { ref } from 'vue'
import { useContentStore } from '../stores/contentStore'
import { storeToRefs } from 'pinia'

const store = useContentStore()
const { knowledgeBase, notes } = storeToRefs(store)

const activeTab = ref('kb') // 'kb' or 'notes'

// KB Management State
const editingCategory = ref(null)
const editingSub = ref(null)
const editingArticle = ref(null)

// Forms
const categoryForm = ref({ name: '', icon: '', id: '' })
const subForm = ref({ name: '', description: '', id: '' })
const articleForm = ref({ title: '', date: '', status: '待开始', content: '', id: null })

// KB Actions
function addCategory() {
  const id = prompt('请输入分类ID (英文，如: backend)')
  if (!id) return
  knowledgeBase.value.push({
    id,
    name: '新分类',
    icon: '📁',
    subs: []
  })
}

function addSub(category) {
  const id = prompt('请输入子话题ID (英文，如: nodejs)')
  if (!id) return
  category.subs.push({
    id,
    name: '新话题',
    description: '话题描述',
    articles: []
  })
}

function addArticle(sub) {
  const newArticle = {
    id: Date.now(),
    title: '新文章',
    date: new Date().toISOString().split('T')[0],
    status: '待开始',
    content: '开始编写内容...'
  }
  sub.articles.unshift(newArticle)
  editArticle(newArticle)
}

function editArticle(article) {
  editingArticle.value = article
  articleForm.value = { ...article }
}

function saveArticle() {
  if (editingArticle.value) {
    Object.assign(editingArticle.value, articleForm.value)
    editingArticle.value = null
  }
}

function deleteArticle(sub, articleId) {
  if (confirm('确定删除这篇文章吗？')) {
    sub.articles = sub.articles.filter(a => a.id !== articleId)
    if (editingArticle.value?.id === articleId) {
      editingArticle.value = null
    }
  }
}

// Note Actions
function deleteNote(id) {
  if (confirm('确定删除这篇随记吗？')) {
    notes.value = notes.value.filter(n => n.id !== id)
  }
}

function exportData() {
  const data = {
    knowledgeBase: knowledgeBase.value,
    notes: notes.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `content-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}
</script>

<template>
  <div class="management-container">
    <header class="mgmt-header">
      <h1>内容管理控制台</h1>
      <div class="mgmt-tabs">
        <button :class="{ active: activeTab === 'kb' }" @click="activeTab = 'kb'">知识库管理</button>
        <button :class="{ active: activeTab === 'notes' }" @click="activeTab = 'notes'">随记管理</button>
      </div>
      <button class="export-btn" @click="exportData">导出 JSON 备份</button>
    </header>

    <main class="mgmt-content">
      <!-- Knowledge Base Management -->
      <div v-if="activeTab === 'kb'" class="kb-mgmt">
        <div class="mgmt-grid">
          <!-- Categories & Subs Tree -->
          <div class="tree-panel card">
            <div class="panel-header">
              <h3>结构目录</h3>
              <button @click="addCategory">+ 分类</button>
            </div>
            <div class="tree-content">
              <div v-for="cat in knowledgeBase" :key="cat.id" class="tree-cat">
                <div class="cat-item">
                  <input v-model="cat.icon" class="icon-input" />
                  <input v-model="cat.name" class="name-input" />
                  <button class="add-sub-btn" @click="addSub(cat)">+ 话题</button>
                </div>
                <div class="tree-subs">
                  <div v-for="sub in cat.subs" :key="sub.id" class="sub-item">
                    <div class="sub-info">
                      <input v-model="sub.name" class="sub-name-input" />
                      <button class="add-art-btn" @click="addArticle(sub)">+ 文章</button>
                    </div>
                    <div class="art-list">
                      <div v-for="art in sub.articles" :key="art.id" 
                           class="art-item" 
                           :class="{ active: editingArticle?.id === art.id }"
                           @click="editArticle(art)">
                        <span>{{ art.title }}</span>
                        <button class="del-btn" @click.stop="deleteArticle(sub, art.id)">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Article Editor -->
          <div class="editor-panel card">
            <div v-if="editingArticle" class="editor-form">
              <div class="form-header">
                <input v-model="articleForm.title" class="title-input" placeholder="文章标题" />
                <div class="meta-inputs">
                  <input v-model="articleForm.date" type="date" />
                  <select v-model="articleForm.status">
                    <option>已掌握</option>
                    <option>学习中</option>
                    <option>复习中</option>
                    <option>待开始</option>
                  </select>
                </div>
              </div>
              <textarea v-model="articleForm.content" class="content-textarea" placeholder="文章内容..."></textarea>
              <div class="form-actions">
                <button class="save-btn" @click="saveArticle">保存更改</button>
              </div>
            </div>
            <div v-else class="empty-editor">
              <p>请从左侧选择或创建一篇文章进行编辑</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Management -->
      <div v-if="activeTab === 'notes'" class="notes-mgmt">
        <div class="notes-table card">
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>标题</th>
                <th>内容预览</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="note in notes" :key="note.id">
                <td>{{ note.date }}</td>
                <td><input v-model="note.title" class="table-input" /></td>
                <td><input v-model="note.content" class="table-input" /></td>
                <td>
                  <button class="del-btn" @click="deleteNote(note.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="hint">* 随记页面本身已支持新增，此处主要用于清理和快速修改</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mgmt-header {
  display: flex;
  align-items: center;
  gap: 40px;
  background: white;
  padding: 20px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

h1 { font-size: 1.5rem; margin: 0; color: #2c3e50; }

.mgmt-tabs {
  display: flex;
  gap: 10px;
  flex: 1;
}

.mgmt-tabs button {
  padding: 10px 20px;
  border-radius: 8px;
  background: #f8f9fa;
  color: #636e72;
  font-weight: 600;
  transition: all 0.2s;
}

.mgmt-tabs button.active {
  background: var(--accent-color);
  color: white;
}

.export-btn {
  padding: 8px 16px;
  background: #2ecc71;
  color: white;
  border-radius: 8px;
}

.mgmt-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

.kb-mgmt, .notes-mgmt {
  flex: 1;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.mgmt-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  flex: 1;
  height: 100%;
  min-height: 0;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0; /* 允许卡片在 Grid 中缩小以触发内部滚动 */
}

.panel-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-content { flex: 1; overflow-y: auto; padding: 20px; }

.tree-cat { margin-bottom: 20px; }
.cat-item { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
.icon-input { width: 40px; text-align: center; border: 1px solid #eee; border-radius: 4px; padding: 4px; }
.name-input { flex: 1; font-weight: 700; border: none; font-size: 1.1rem; }

.tree-subs { margin-left: 20px; border-left: 2px solid #f1f2f6; padding-left: 15px; }
.sub-item { margin-bottom: 15px; }
.sub-info { display: flex; gap: 8px; margin-bottom: 8px; }
.sub-name-input { font-weight: 600; border: none; color: #636e72; }

.art-list { display: flex; flex-direction: column; gap: 4px; }
.art-item {
  padding: 6px 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
}
.art-item:hover { background: #e9ecef; }
.art-item.active { background: #e3f2fd; color: #0984e3; border: 1px solid #0984e3; }

.del-btn { color: #ff7675; padding: 0 5px; font-weight: bold; }

.editor-panel { padding: 30px; }
.editor-form { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  height: 100%;
  min-height: 0; /* 允许 flex 子项缩小 */
}
.title-input { font-size: 1.8rem; font-weight: 700; border: none; border-bottom: 2px solid #eee; padding-bottom: 10px; width: 100%; }
.title-input:focus { outline: none; border-color: var(--accent-color); }

.meta-inputs { display: flex; gap: 20px; }
.meta-inputs input, .meta-inputs select { padding: 8px; border: 1px solid #eee; border-radius: 6px; }

.content-textarea { 
  flex: 1; 
  border: 1px solid #eee; 
  border-radius: 8px; 
  padding: 20px; 
  font-size: 1.1rem; 
  line-height: 1.6; 
  resize: none; /* 在固定容器中禁用手动缩放，依靠滚动 */
  overflow-y: auto;
  width: 100%;
}
.save-btn { background: var(--accent-color); color: white; padding: 12px; border-radius: 8px; font-weight: 600; align-self: flex-end; width: 200px; }

.empty-editor { display: flex; align-items: center; justify-content: center; height: 100%; color: #b2bec3; font-style: italic; }

.notes-table { padding: 20px; overflow: auto; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #636e72; }
td { padding: 12px; border-bottom: 1px solid #f1f2f6; }
.table-input { width: 100%; border: none; padding: 4px; }
.table-input:focus { background: #f8f9fa; }
.hint { font-size: 0.8rem; color: #b2bec3; margin-top: 20px; }
</style>
