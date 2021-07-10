import { createRouter, createWebHistory } from 'vue-router'
import ToDo from '../components/ToDo.vue'
import Home from '../components/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/todo',
        name: 'todo',
        component: ToDo
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router