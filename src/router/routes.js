const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/create', component: () => import('pages/ManageUser/Email.vue')},
      { path: '/create/update', component: () => import('pages/ManageUser/CreateAccount.vue')},
      { path: '/signin', component: () => import('pages/ManageUser/SignIn.vue')},
      { path: '/createpub', component: () => import('pages/Pubs/CreatePub.vue') },
      { path: '/managepubs', component: () => import('pages/Pubs/ManagePubs.vue')},
      { path: '/contributepub', component: () => import('pages/Pubs/ContributePub.vue')},
      { path: '/add', component: () => import('pages/Admin/AddRecipe.vue')},
      { path: '/graphics', component: () => import('pages/Admin/Graphics.vue')}
    ]
  },
  {
    path: '/recipes/:id',
    name: 'recipes',
    component: () => import('layouts/RecipesLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Recipes.vue')},
      { path: 'select', component: () => import('pages/Select/Personal.vue') },
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
