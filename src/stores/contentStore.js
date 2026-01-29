import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useContentStore = defineStore('content', () => {
  // 知识库初始数据
  const initialKnowledgeBase = [
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
  ]

  // 随记初始数据
  const initialNotes = [
    { id: 1, date: '2025-12-24', title: '平安夜的思考', content: '今天是一个安静的夜晚，重新思考了明年的计划...' },
    { id: 2, date: '2025-12-20', title: '新游戏体验', content: '刚开始玩《黑神话：悟空》，美术风格真的太震撼了。' },
    { id: 3, date: '2025-12-15', title: '冬日随笔', content: '天气转凉了，适合在家里喝热咖啡写代码。' }
  ]

  // 从 LocalStorage 加载数据
  const savedKB = localStorage.getItem('kb-data')
  const savedNotes = localStorage.getItem('notes-data')

  const knowledgeBase = ref(savedKB ? JSON.parse(savedKB) : initialKnowledgeBase)
  const notes = ref(savedNotes ? JSON.parse(savedNotes) : initialNotes)

  // 监听并保存
  watch(knowledgeBase, (newVal) => {
    localStorage.setItem('kb-data', JSON.stringify(newVal))
  }, { deep: true })

  watch(notes, (newVal) => {
    localStorage.setItem('notes-data', JSON.stringify(newVal))
  }, { deep: true })

  return {
    knowledgeBase,
    notes
  }
})
