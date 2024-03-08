import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/FrontView.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/AboutView.vue')
      },
      {
        path: 'products',
        name: '產品列表',
        component: () => import('../views/ProductsView.vue')
      },
      {
        path: 'cart',
        name: '購物車',
        component: () => import('../views/CartView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: '登入',
    component: () => import('../views/LoginView.vue')
  },
  { // 重新導向
    path: '/admin/:pathMatch(.*)*',
    redirect: { name: '登入' }
  },
  {
    path: '/admin',
    component: () => import('../views/admin/DashboardView.vue'),
    children: [
      {
        path: 'products',
        name: '後台產品列表',
        component: () => import('../views/admin/AdminProductsView.vue')
      },
      {
        path: 'order',
        name: '訂單',
        component: () => import('../views/admin/AdminOrderView.vue')
      },
      {
        path: 'coupon',
        name: '優惠券',
        component: () => import('../views/admin/AdminCouponView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
