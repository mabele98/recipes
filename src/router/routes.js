const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') },
      { path: '/recipes/:id', component: () => import('pages/Recipes.vue')},
      { path: '/select/:id', component: () => import('pages/Select/Personal.vue') },
      { path: '/available/:id', component: () => import('pages/Select/Available.vue') },
      { path: '/add', component: () => import('pages/AddRecipe.vue')},
      { path: '/test', component: () => import('pages/test.vue')},
      { path: '/graphics', component: () => import('pages/Graphics.vue')}
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
