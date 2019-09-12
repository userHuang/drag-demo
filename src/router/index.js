import Vue from 'vue'
import Router from 'vue-router'
import DragDemo from '@/components/DragDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DragDemo',
      component: DragDemo
    }
  ]
})
