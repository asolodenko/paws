// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/bigPaw/BigPawLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/paws',
    component: () => import('@/layouts/smallPaw/SmallPawLayout.vue'),
    children: [
      {
        path: '',
        name: 'Paws',
        component: () => import(/* webpackChunkName: "paws" */ '@/views/Paws.vue'),
        // children: [
        //   {
        //     path: ':id',
        //     name: 'Paw',
        //     component: () => import(/* webpackChunkName: "paw" */ '@/views/Paw.vue'),
        //   }
        // ]
      },
      {
        path: '/paws/:id',
        name: 'Paw',
        component: () => import(/* webpackChunkName: "paw" */ '@/views/Paw.vue'),
      },
    ],
    // isAdmin?: boolean
    // requiresAuth: boolean
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
