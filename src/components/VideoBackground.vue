<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let animationFrameId

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  let width, height
  let particles = []

  const resize = () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }

  window.addEventListener('resize', resize)
  resize()

  class Particle {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * width
      this.y = height + Math.random() * 100
      this.speed = 0.5 + Math.random() * 1.5
      this.size = Math.random() * 3 + 1
      this.opacity = Math.random() * 0.5 + 0.1
      this.wobble = Math.random() * Math.PI * 2
      this.wobbleSpeed = 0.02 + Math.random() * 0.03
    }

    update() {
      this.y -= this.speed
      this.wobble += this.wobbleSpeed
      this.x += Math.sin(this.wobble) * 0.5

      if (this.y < -50) {
        this.reset()
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function init() {
    particles = []
    for (let i = 0; i < 100; i++) {
      const p = new Particle()
      p.y = Math.random() * height // Start scattered
      particles.push(p)
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height)
    particles.forEach(p => {
      p.update()
      p.draw()
    })
    animationFrameId = requestAnimationFrame(animate)
  }

  init()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div class="video-bg">
    <video autoplay loop muted playsinline>
      <source src="https://cdn.pixabay.com/video/2021/10/30/93926-641767570_large.mp4" type="video/mp4">
    </video>
    <canvas ref="canvasRef" class="particles-overlay"></canvas>
    <!-- Removed the white overlay div -->
  </div>
</template>

<style scoped>
.video-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.particles-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
