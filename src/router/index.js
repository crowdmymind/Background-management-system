import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Goods from '../views/Goods.vue'
import Order from '../views/Order.vue'
import Category from '../views/Category.vue'
import Purview from '../views/Purview.vue'
import Maps from '../views/Maps.vue'
import GoodsAdd from '../views/GoodsAdd.vue'
// const User = () => import(/* webpackChunkName: "group-User" */ '../views/User.vue')

Vue.use(VueRouter)

const routes = [
  {
    path:"/login",
    name:"login",
    component:Login
  },{
    path:"/home",
    name:"home",
    component:Home,
    children:[
      {
        path:"maps",
        name:"maps",
        component:Maps
      },
      {
        path:"user",
        name:"user",
        component:User
      },
      {
        path:"goods",
        name:"goods",
        component:Goods
      },
      {
        path:"order",
        name:"order",
        component:Order
      },
      {
        path:"category",
        name:"category",
        component:Category
      },
      {
        path:"purview",
        name:"purview",
        component:Purview
      },
      {
        path:"goodsadd",
        name:"goodsadd",
        component:GoodsAdd
      },
    ]
  },
    //默认页面  
  {
    path:"/",
    redirect:"/login"
  },
]
//解决路由跳转的时候两次push的path地址相同
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode:'hash',
  routes
})

export default router
