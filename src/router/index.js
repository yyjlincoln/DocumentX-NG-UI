import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Main from '../views/Main.vue'
import AllDocuments from '../views/Main/AllDocuments.vue'
import Dashboard from '../views/Main/Dashboard.vue'
import SearchDocuments from '../views/Main/SearchDocuments.vue'
import UploadDocument from '../views/Main/UploadDocument.vue'
import EditDocument from '../views/Main/EditDocument.vue'
import NotFound from '../views/NotFound.vue'
import ViewDocument from '../views/ViewDocument.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Authentiation',
    component: Auth
  },
  {
    path:'/app',
    name: 'DocumentX',
    component: Main,
    children:[
      {
        path:'',
        component: Dashboard
      },
      {
        path:'all',
        component: AllDocuments
      },
      {
        path:'search',
        component: SearchDocuments
      },
      {
        path:'upload',
        component: UploadDocument
      },
      {
        path:'edit',
        component: EditDocument
      }
    ]
  },{
    path:'/view',
    component: ViewDocument
  },
  {
    path:'*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
