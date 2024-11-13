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
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
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
        component: () => import('@/views/Paws.vue')
      },
      {
        path: '/paws/:id',
        name: 'Paw',
        component: () => import('@/views/Paw.vue')
      },
    ],
    // isAdmin?: boolean
    // requiresAuth: boolean
  },
  {
    path: '/account',
    component: () => import('@/layouts/smallPaw/SmallPawLayout.vue'),
    children: [
      {
        path: '',
        name: 'Account',
        component: () => import('@/views/Account.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
