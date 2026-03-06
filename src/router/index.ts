import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('@/views/home.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/login.vue')
        }
    ]
})

export default router
