<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'

const typedText = ref('')
const showButton = ref(false)
const lines = [
  '> 初始化系统核心...',
  '> 加载用户档案: [Gamer, Coder, Dreamer]',
  '> 同步神经连接... 100%',
  '> 状态: <span class="status-ok">ONLINE</span>',
  '> 欢迎来到我的数字空间。'
]

const showCursor = ref(true)

onMounted(() => {
  let lineIndex = 0
  let charIndex = 0
  let currentText = ''

  const typeWriter = () => {
    if (lineIndex < lines.length) {
      const currentLine = lines[lineIndex]
      
      // Handle HTML tags instantly for better effect
      if (currentLine.includes('<span')) {
         currentText += currentLine + '<br/>'
         typedText.value = currentText
         lineIndex++
         setTimeout(typeWriter, 400)
         return
      }

      if (charIndex < currentLine.length) {
        currentText += currentLine.charAt(charIndex)
        typedText.value = currentText
        charIndex++
        setTimeout(typeWriter, 50)
      } else {
        currentText += '<br/>'
        typedText.value = currentText
        lineIndex++
        charIndex = 0
        setTimeout(typeWriter, 300) // Pause between lines
      }
    } else {
      showButton.value = true
    }
  }
  
  typeWriter()
  
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
})
</script>

<template>
  <div class="landing">
    <div class="content-wrapper">
      <div class="terminal-window glass-panel">
        <div class="window-header">
          <div class="controls">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <div class="title">user@life-os:~</div>
        </div>
        <div class="terminal-body">
          <div class="code-content" v-html="typedText"></div>
          <span class="cursor" v-if="showCursor">_</span>
        </div>
      </div>

      <Transition name="fade-up">
        <div v-if="showButton" class="actions">
          <RouterLink to="/games" class="enter-btn">
            <span class="btn-text">进入系统</span>
            <span class="btn-icon">➜</span>
          </RouterLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.landing {
  height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 700px;
}

.terminal-window {
  width: 100%;
  min-height: 350px;
  background: rgba(30, 30, 30, 0.85); /* Darker for terminal feel */
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  overflow: hidden;
  transform: rotateX(5deg);
  animation: float 6s ease-in-out infinite;
  border: 1px solid rgba(255,255,255,0.1);
}

.window-header {
  background: rgba(255,255,255,0.05);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.controls {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.title {
  flex: 1;
  text-align: center;
  color: rgba(255,255,255,0.4);
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  margin-right: 50px; /* Balance the dots */
}

.terminal-body {
  padding: 30px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #a8b2d1;
  text-align: left;
}

:deep(.status-ok) {
  color: #2ecc71;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
}

.cursor {
  color: #2ecc71;
  font-weight: bold;
  animation: blink 1s step-end infinite;
}

.enter-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 40px;
  background: var(--accent-color);
  color: white;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(9, 132, 227, 0.3);
}

.enter-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 30px rgba(9, 132, 227, 0.4);
  background: #0a74c4;
}

.btn-icon {
  transition: transform 0.3s;
}

.enter-btn:hover .btn-icon {
  transform: translateX(5px);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0) rotateX(2deg); }
  50% { transform: translateY(-15px) rotateX(5deg); }
}

.fade-up-enter-active {
  transition: all 0.8s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
