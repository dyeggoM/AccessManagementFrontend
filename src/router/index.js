import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: "*",
    component: () => import('../views/Login')
  },
  {
    path: '/',
    component: () => import('../views/Login')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/secured',
    name: 'Secured',
    component: () => import('../views/SecuredHome'),
    beforeEnter: (to, from, next) =>{
      requireAuth(to, from, next)
    }
  },
]

async function requireAuth (to, from, next) {
  // const app_token = Store.getters['shoppingCart/token']
  const app_token = window.localStorage.getItem("app_token")
  if(app_token==null)
  {
      next({
          path: '/login',
          query: { redirect: to.fullPath }
      })
  }
  else{
      next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
