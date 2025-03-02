import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/login', component: () => import('@/components/Login.vue'), name: 'Login', props: false },
    { path: '/inicio', component: () => import('@/components/Dashboard.vue'), name: 'Home', props: false },
    { path: '/dashboard-admin', component: () => import('@/components/DashboardAdmin.vue'), name: 'Dashboard', props: false },
    { path: '/cadastro', component: () => import('@/components/Cadastro.vue'), name: 'Cadastro', props: false },
    { path: '/:pathMatch(.*)*', component: () => import('@/components/Login.vue'), name: 'Login', props: false }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
