<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white text-black">
        <q-toolbar-title>
          <q-avatar>
              <img src="statics/sam.jpg">
          </q-avatar>
          New Recipes
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',

  components: {
    
  },

  data () {
    return {
    }
  }
}
</script>
