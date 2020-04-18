const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/create', component: () => import('pages/ManageUser/Email.vue')},
      { path: '/create/update', component: () => import('pages/ManageUser/CreateAccount.vue')},
      { path: '/signin', component: () => import('pages/ManageUser/SignIn.vue')},
      { path: '/createpub', component: () => import('pages/CreatePub.vue') },
      { path: '/recipes/:id', component: () => import('pages/Recipes.vue')},
      { path: '/select/:id', component: () => import('pages/Select/Personal.vue') },
      { path: '/available/:id', component: () => import('pages/Select/Available.vue') },
      { path: '/add', component: () => import('pages/Admin/AddRecipe.vue')},
      { path: '/graphics', component: () => import('pages/Admin/Graphics.vue')}
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
