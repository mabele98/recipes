<template>
  <q-layout view="lHh Lpr lFf" style="background-color:#232323">
    <q-header reveal class="bg-orange">
        <q-toolbar>
            <q-avatar @click="index"> <img src="statics/logo.png"/> </q-avatar>
            <q-toolbar-title class="text-weight-bold" @click="index"> MyPub </q-toolbar-title>
            <q-btn-dropdown v-if="loggedIn" stretch flat label="Account">
                <q-list>
                  <q-item clickable v-close-popup @click="$router.push('/managepubs')">
                        <q-item-section>
                            <q-item-label>Manage Pubs</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="$router.push('/createpub')">
                        <q-item-section>
                            <q-item-label>Open your own Pub</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="$router.push('/contributepub')">
                        <q-item-section>
                            <q-item-label>Contribute to a Pub</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="signOut()">
                        <q-item-section>
                            <q-item-label>Log Out</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="signOut()">
                        <q-item-section>
                            <q-item-label>Account Settings</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <q-btn v-else label="Sign In" @click="signIn()"/>
        </q-toolbar>
      </q-header>
    <q-page-container class="q-mt-sm">
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
      loggedIn: false,
    }
  },

  methods: {
    signOut() {
      this.$auth.signOut().then(() => {
        this.loggedIn = false
        this.user = ''
      }).catch(error => {
        console.log(error)
      });
    },
    index() {
      this.$router.replace('/')
    },
    test() {
      console.log('test')
    }
  },

  mounted () {
    this.$auth.onAuthStateChanged(user => {
      if (user) {
        this.loggedIn = true
      }
    })
    
  }
}
</script>
