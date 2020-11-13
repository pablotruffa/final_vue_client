import Vue from "vue";
import VueRouter from "vue-router";

import ClientLogin from "../views/auth/ClientLogin";

import Home from "../views/Home.vue";
import Products from "../views/Products.vue";
import Orders from "../views/Orders.vue";

import store from '../store'
Vue.use(VueRouter);

const routes = [
  
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth:true,
      level:'client',
    }
  },
  {
    path: "/login",
    name: "login",
    component: ClientLogin,
  },
  {
    path: "/products",
    name: "products",
    component: Products,
    meta: {
      requiresAuth:true,
      level:'client',
    }
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
    meta: {
      requiresAuth:true,
      level:'client',
    }
  },


];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  
  store.state.notification.title   = null;
  store.state.notification.message = null;
  store.state.notification.bClass  = null;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.auth.logged) {
        if(to.meta.level == 'client') {
          next({
            path: '/login',
          })
        }
      
    }else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router;
