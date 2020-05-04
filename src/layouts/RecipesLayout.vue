<template>
  <q-layout view="lHh Lpr lFf" style="background-color:#232323">
    <q-header reveal class="bg-green">
        <q-toolbar>
            <q-avatar @click="$router.push('/')"> <img src="statics/logo.png"/> </q-avatar>
            <q-toolbar-title 
                v-if="size.sm" 
                class="text-weight-bold"
                @click="$router.push('/')"
            > 
                {{type}}
            </q-toolbar-title>
            <q-toolbar-title 
                v-else 
                class="text-weight-bold"
                @click="$router.push('/')"
            > 
                {{type}} recipes 
            </q-toolbar-title>
            <q-btn-dropdown v-if="!select" stretch flat label="Recipes">
                <q-list v-for="drink in recipes" :key="drink">
                  <q-item
                    :class="drink == type ? 'bg-green-3' : 'bg-white'"
                    clickable 
                    v-close-popup
                    @click="goTo(drink)"
                  >
                    <q-item-section>
                        <q-item-label>{{drink}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
            </q-btn-dropdown>
            <q-btn v-if="select" unelevated label="Return" @click="goTo(type)"/>
        </q-toolbar>
        <div v-if="!select" class="q-ml-md row">
            <div class="q-mr-md text-italic"
                :class="size.sm ? 'text-caption' : 'text-subtitle2'"
            > Bolded ingredients are your filter choices. </div>
            <q-btn dense unelevated size="sm" label="Filter Here" @click="filter(type)"/>
        </div>
    </q-header>
    <q-page-container class="q-mt-sm">
        <PageRecipes v-if="!select" />
      <router-view> </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import PageRecipes from 'pages/Recipes.vue'

export default {
    name: "RecipesLayout",
    components: {
        PageRecipes,
    },
    data () {
        return {
            recipes: [],
            type: this.$route.params.id,
            size: this.$q.screen,
            select: false,
        }
    },
    methods: {
        goTo(drink) {
            this.$router.push({ name: 'recipes', params: { id: drink } }).then(() => {
                this.type = drink
            }).catch((error) => {
                console.log(error)
            })
        },
        filter(drink) {
            this.$router.push('/recipes/' + drink + '/select')
        },

    },
    mounted () {
        let ref = this.$database.ref('recipes')
        ref.once("value", data => {
            for(let drink in data.val()) {
                this.recipes.push(drink)
            }
        })
        if(window.location.hash.includes('select')) {
            this.select = true
        }
    },
    beforeRouteUpdate (to, from, next) {
        if(to.path.includes('select')) this.select = true
        else this.select = false
        next()
    }
    
}
</script>
            
