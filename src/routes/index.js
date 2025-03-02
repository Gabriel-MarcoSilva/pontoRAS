import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/pontoRAS/login', component: () => import('@/components/Login.vue'), name: 'Login', props: false },
    { path: '/pontoRAS/inicio', component: () => import('@/components/Dashboard.vue'), name: 'Home', props: false },
    { path: '/pontoRAS/dashboard-admin', component: () => import('@/components/DashboardAdmin.vue'), name: 'Dashboard', props: false },
    { path: '/pontoRAS/cadastro', component: () => import('@/components/Cadastro.vue'), name: 'Cadastro', props: false },
    { path: '/pontoRAS/:pathMatch(.*)*', component: () => import('@/components/Login.vue'), name: 'Login', props: false }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
