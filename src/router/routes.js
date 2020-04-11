const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') },
      { path: '/CirocRecipes', component: () => import('pages/Recipes.vue') },
      { path: '/test', component: () => import('pages/Select.vue') },
      { path: '/CirocRecipes/select', component: () => import('pages/Select/Personal.vue') },
      { path: '/CirocRecipes/selectAvailable', component: () => import('pages/Select/Available.vue') }
    ]
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
