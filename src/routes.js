import Index from './pages/index.vue'
import vantTestPage from './pages/vantTestPage.vue'
import nutTestPage from './pages/nutTestPage.vue'


const routes = [
    { path: '', component: Index,meta:{title:'首页'}},
    { path: '/vant-test', component: vantTestPage,meta:{title:'vant 测试页面'}},
    { path: '/nut-test', component: nutTestPage,meta:{title:'nut 测试页面'}}
]
export default routes
