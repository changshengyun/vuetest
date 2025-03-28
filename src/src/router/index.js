import { createRouter, createWebHistory } from 'vue-router'
// 登录页面
const LoginView = () => import('@/views/Login/Login.vue')

// 各角色布局组件
const AdminLayout = () => import('@/views/Admin/Layout/Layout.vue')
const SellerLayout = () => import('@/views/Seller/Layout/Layout.vue')
const BuyerLayout = () => import('@/views/Buyer/Layout/Layout.vue')

// 各角色默认首页（后续开发时创建）
const AdminDashboard = () => import('@/views/Admin/DashBoard/DashBoard.vue')
const SellerDashboard = () => import('@/views/Seller/DashBoard/DashBoard.vue')
const BuyerHome = () => import('@/views/Buyer/Home/Home.vue')

// 404页面
const NotFound = () => import('@/views/NotFound.vue')


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      // meta: { requiresAuth: false, title: '登录' }
    },
    // 管理员路由
    {
      path: '/admin',
      component: AdminLayout,
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: AdminDashboard,
          meta: { title: '管理中心' }
        }
        // 后续可以在这里添加更多管理员页面路由
      ]
    },
    // 卖家路由
    {
      path: '/seller',
      component: SellerLayout,
      redirect: '/seller/dashboard',
      meta: { requiresAuth: true, role: 'seller' },
      children: [
        {
          path: 'dashboard',
          name: 'SellerDashboard',
          component: SellerDashboard,
          meta: { title: '卖家中心' }
        },
        {
          path: 'homeview',
          name: 'SellerHome',
          component: () => import('@/views/Seller/Page/homeviewPage/homeview.vue'), // 引入 Home 组件
          meta: { title: '首页' }
        },
        {
          path: 'productManagement',
          name: 'productManagement',
          component: () => import('@/views/Seller/Page/productManagementPage/productManagement.vue'), 
          meta: { title: '商品管理' }
        },
        {
          path: 'orderManagement',
          name: 'orderManagement',
          component: () => import('@/views/Seller/Page/orderManagementPage/orderManagement.vue'), 
          meta: { title: '订单管理' }
        }
        // 后续可以在这里添加更多卖家页面路由
      ]
    },
    // 买家路由
    {
      path: '/buyer',
      component: BuyerLayout,
      redirect: '/buyer/home',
      meta: { requiresAuth: true, role: 'buyer' },
      children: [
        {
          path: 'home',
          name: 'BuyerHome',
          component: BuyerHome,
          meta: { title: '买家中心' }
        }
        // 后续可以在这里添加更多买家页面路由
      ]
    },
    // 404路由
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token')
//   const userRole = localStorage.getItem('userRole')

//   // 检查路由是否需要认证
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // 如果需要认证但用户未登录，重定向到登录页
//     if (!isAuthenticated) {
//       next({ name: 'Login', query: { redirect: to.fullPath } })
//     } 
//     // 检查用户角色是否匹配
//     else if (to.matched.some(record => record.meta.role && record.meta.role !== userRole)) {
//       // 角色不匹配，根据用户角色重定向到对应的首页
//       if (userRole === 'seller') {
//         next({ name: 'SellerDashboard' })
//       } else if (userRole === 'buyer') {
//         next({ name: 'BuyerHome' })
//       } else if (userRole === 'admin') {
//         next({ name: 'AdminDashboard' })
//       } else {
//         next({ name: 'Login' })
//       }
//     } else {
//       // 认证和角色都匹配，允许访问
//       next()
//     }
//   } else {
//     // 不需要认证的路由，直接通过
//     next()
//   }
// })


export default router
