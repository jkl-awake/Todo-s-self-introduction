<script setup>
import { useAuthStore } from '../stores/authStore'
import { Picture, Edit, Calendar } from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  selectedGame: Object
})

const emit = defineEmits(['update:modelValue', 'edit', 'delete'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const authStore = useAuthStore()

function getStatusType(status) {
  const map = {
    'Backlog': 'info',
    'Playing': 'warning',
    'Completed': 'success',
    'Dropped': 'danger'
  }
  return map[status] || 'info'
}

function handleEdit() {
  emit('edit')
}

function handleDelete() {
  emit('delete', props.selectedGame.id)
}
</script>

<template>
  <el-dialog 
    v-model="visible" 
    :title="selectedGame?.title || selectedGame?.gameName || '游戏详情'" 
    width="800px" 
    align-center 
    destroy-on-close 
    class="glass-dialog"
  >
    <el-row :gutter="30" v-if="selectedGame">
      <el-col :span="10">
        <el-image 
          :src="selectedGame.cover || selectedGame.gameImage" 
          :alt="selectedGame.title || selectedGame.gameName" 
          fit="cover"
          style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); aspect-ratio: 3/4;"
        >
          <template #error>
            <div class="image-slot" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background: #f5f7fa; color: #909399;">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </el-col>
      <el-col :span="14">
        <div class="detail-header" style="margin-bottom: 20px;">
          <div class="tags" style="margin-bottom: 15px;">
            <el-tag effect="dark" style="margin-right: 10px;">{{ selectedGame.platform }}</el-tag>
            <el-tag :type="getStatusType(selectedGame.status || 'Backlog')" effect="light">{{ selectedGame.status || 'Backlog' }}</el-tag>
          </div>
          <el-rate 
            v-model="selectedGame.rating" 
            disabled 
            show-score 
            text-color="#ff9900" 
            score-template="{value} 分" 
          />
        </div>

        <el-descriptions :column="1" border style="margin-bottom: 20px;">
          <el-descriptions-item label="游玩时长">{{ selectedGame.playtime || 0 }} 小时</el-descriptions-item>
          <el-descriptions-item label="添加时间">{{ selectedGame.createTime || '未知' }}</el-descriptions-item>
        </el-descriptions>

        <div class="notes-section">
          <h4 style="margin-bottom: 15px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <el-icon><Edit /></el-icon> 心得笔记
          </h4>
          
          <!-- 如果有分块的体验记录 (详情页数据) -->
          <div v-if="selectedGame.experiences && selectedGame.experiences.length > 0" class="experiences-list">
            <div v-for="(exp, index) in selectedGame.experiences" :key="index" class="experience-card">
              <div class="exp-header">
                <span class="exp-date">
                  <el-icon><Calendar /></el-icon>
                  {{ exp.createTime || '记录时间未知' }}
                </span>
              </div>
              <div class="exp-content" v-html="exp.content"></div>
            </div>
          </div>
          
          <!-- 降级显示 (列表页数据或旧数据) -->
          <div v-else class="notes-content" v-html="selectedGame.notes || selectedGame.evaluation || '暂无笔记...'"></div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-popconfirm v-if="authStore.isAdmin" title="确定要删除这条记录吗？" @confirm="handleDelete" width="200">
          <template #reference>
            <el-button type="danger" plain>删除记录</el-button>
          </template>
        </el-popconfirm>
        <el-button v-if="authStore.isAdmin" type="primary" :icon="Edit" @click="handleEdit">编辑</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
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
</style>