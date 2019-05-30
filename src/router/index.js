import Vue from 'vue'
import Router from 'vue-router'
import kc from '@/plugin/keycloak-config.js'
import Index from '@/pages/index/index.vue'
import Program from '@/pages/program/program.vue'
Vue.use(Router)
const router_data = new Router({
    routes: [
        {
            path: '/',
            name: 'homepage',
            component: Index
        },
        {
        path: '/index',
        name: 'index',
        component: Index,
        redirect: '/index/program',
        children: [{
            path: 'program',
            name: 'program',
            component: Program,
        }]
    }]
})
router_data.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('access_token')) {
        next()
    } else {
        kc.init({onLoad: 'login-required'}).success(function (authenticated) {
            if (!authenticated) {
                alert('无权访问!')
            } else {
                kc.loadUserProfile().success(data => {
                    console.info(data)
                    sessionStorage.setItem('access_token', kc.token)
                    sessionStorage.setItem('username', data.username)
                    // window.sessionStorage.setItem('access_token', kc.token)
                    // window.sessionStorage.setItem('username', data.username)
                    next(from.path)
                })
            }
        }).error(function () {
            alert('failed to initialize')
        })
    }
})
export default router_data
