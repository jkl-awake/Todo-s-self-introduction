import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import HomeView from '../views/HomeView.vue'
import GameDetailView from '../views/GameDetailView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import LearningView from '../views/LearningView.vue'
import NotesView from '../views/NotesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/games',
      name: 'games',
      component: HomeView
    },
    {
      path: '/games/:id',
      name: 'game-detail',
      component: GameDetailView
    },
    {
      path: '/games/statistics',
      name: 'game-statistics',
      component: StatisticsView
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView
    }
  ]
})

export default router

