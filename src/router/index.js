import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { useEnterpriseStore } from "../stores/enterprise";
import { supabase } from '../supabase'
import routes from './routes'


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !session) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      const enterpriseStore = useEnterpriseStore()

      if (!enterpriseStore.enterpriseUrl && to.params.enterpriseUrl) {
        await enterpriseStore.fetchEnterprise(to.params.enterpriseUrl)
      } else if (!enterpriseStore.enterpriseUrl && localStorage.getItem('enterpriseUrl')) {
        await enterpriseStore.fetchEnterprise(localStorage.getItem('enterpriseUrl'))
      }
      next()
    }
  })

  return Router
})
