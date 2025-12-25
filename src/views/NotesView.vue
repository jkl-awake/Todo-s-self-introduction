<script setup>
import { ref } from 'vue'

const notes = ref([
  { id: 1, date: '2025-12-24', title: '平安夜的思考', content: '今天是一个安静的夜晚，重新思考了明年的计划...' },
  { id: 2, date: '2025-12-20', title: '新游戏体验', content: '刚开始玩《黑神话：悟空》，美术风格真的太震撼了。' },
  { id: 3, date: '2025-12-15', title: '冬日随笔', content: '天气转凉了，适合在家里喝热咖啡写代码。' }
])

const selectedNote = ref(notes.value[0])
const isEditing = ref(false)
const newNoteTitle = ref('')
const newNoteContent = ref('')

function selectNote(note) {
  selectedNote.value = note
  isEditing.value = false
}

function startNewNote() {
  selectedNote.value = null
  isEditing.value = true
  newNoteTitle.value = ''
  newNoteContent.value = ''
}

function saveNote() {
  if (!newNoteTitle.value) return
  const newId = notes.value.length + 1
  const date = new Date().toISOString().split('T')[0]
  const note = {
    id: newId,
    date: date,
    title: newNoteTitle.value,
    content: newNoteContent.value
  }
  notes.value.unshift(note)
  selectedNote.value = note
  isEditing.value = false
}
</script>

<template>
  <div class="notes-container">
    <h1>随记日记</h1>
    
    <div class="diary-layout glass-panel">
      <!-- Sidebar List -->
      <div class="diary-sidebar">
        <button class="new-note-btn" @click="startNewNote">+ 写日记</button>
        <div class="note-list">
          <div 
            v-for="note in notes" 
            :key="note.id" 
            class="note-item" 
            :class="{ active: selectedNote && selectedNote.id === note.id }"
            @click="selectNote(note)"
          >
            <span class="note-date">{{ note.date }}</span>
            <span class="note-title">{{ note.title }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="diary-content">
        <div v-if="isEditing" class="editor-mode">
          <input v-model="newNoteTitle" type="text" placeholder="日记标题..." class="title-input" />
          <textarea v-model="newNoteContent" placeholder="今天发生了什么..." class="content-input"></textarea>
          <div class="editor-actions">
            <button @click="isEditing = false" class="cancel-btn">取消</button>
            <button @click="saveNote" class="save-btn">保存</button>
          </div>
        </div>

        <div v-else-if="selectedNote" class="view-mode">
          <div class="view-header">
            <h2>{{ selectedNote.title }}</h2>
            <span class="view-date">{{ selectedNote.date }}</span>
          </div>
          <div class="view-body">
            {{ selectedNote.content }}
          </div>
        </div>

        <div v-else class="empty-selection">
          <p>选择一篇日记查看，或开始新的记录。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notes-container {
  padding: 20px;
  animation: fadeIn 0.5s ease;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--text-primary);
  letter-spacing: -1px;
  font-weight: 600;
}

.diary-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--card-radius);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.diary-sidebar {
  width: 280px;
  border-right: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.3);
}

.new-note-btn {
  margin: 20px;
  padding: 12px;
  background: var(--accent-color);
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.new-note-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.note-list {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0,0,0,0.03);
  transition: background 0.2s;
}

.note-item:hover {
  background: rgba(255,255,255,0.5);
}

.note-item.active {
  background: #fff;
  border-left: 4px solid var(--accent-color);
}

.note-date {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.note-title {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.diary-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  background: rgba(255,255,255,0.4);
}

/* Editor Styles */
.editor-mode {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title-input {
  font-size: 1.8rem;
  font-weight: 600;
  border: none;
  background: transparent;
  margin-bottom: 20px;
  color: var(--text-primary);
  border-bottom: 2px solid rgba(0,0,0,0.1);
  padding-bottom: 10px;
}

.title-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.content-input {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  font-family: inherit;
}

.content-input:focus {
  outline: none;
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.save-btn {
  background: var(--accent-color);
  color: #fff;
  padding: 10px 25px;
  border-radius: 6px;
}

/* View Styles */
.view-header {
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 20px;
}

.view-header h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.view-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.view-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.empty-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
