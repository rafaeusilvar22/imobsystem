const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/home/:userId',
        name: 'Home',
        component: () => import('../pages/HomePage.vue')
      },
      {
        path: 'property/:id',
        name: 'property-details',
        component: () => import('../pages/PropertyDetails.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../pages/LoginPage.vue')
      }
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import('../pages/RegisterPage.vue')
      // }
    ]
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../pages/admin/DashboardPage.vue')
      },
      {
        path: 'properties',
        name: 'admin-properties',
        component: () => import('../pages/admin/PropertyList.vue')
      },
      {
        path: 'properties/create',
        name: 'admin-property-create',
        component: () => import('src/pages/admin/PropertyForm.vue')
      },
      {
        path: 'properties/edit/:id',
        name: 'admin-property-edit',
        component: () => import('src/pages/admin/PropertyForm.vue')
      },
      {
        path: 'update-profile',
        name: 'admin-update-profile',
        component: () => import('src/pages/admin/UpdateProfile.vue')
      }
    ]
  }
]
export default routes
