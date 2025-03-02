import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/components/Login.vue'), name: 'Login', props: false },
    { path: '/inicio', component: () => import('@/components/Dashboard.vue'), name: 'Home', props: false },
    { path: '/dashboard-admin', component: () => import('@/components/DashboardAdmin.vue'), name: 'Dashboard', props: false },
    { path: '/cadastro', component: () => import('@/components/Cadastro.vue'), name: 'Cadastro', props: false },
    { path: '/:catchAll(.*)*', component: () => import('@/components/Error.vue'), name: 'Error', props: false }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
