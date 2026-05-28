import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import EditorView from '../views/EditorView.vue'
import ReviewQueueView from '../views/ReviewQueueView.vue'
import PreviewView from '../views/PreviewView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/releases' },
    { path: '/releases', component: DashboardView },
    { path: '/releases/new', component: EditorView },
    { path: '/releases/:id/edit', component: EditorView },
    { path: '/review', component: ReviewQueueView },
    { path: '/preview', component: PreviewView },
  ],
})

export default router
