<template>
  <q-page v-if="loadedAvailable && loadedFilter" class="flex flex-left">
    <div class="full column justify-start items-start content-start">
      <div class="q-pa-md row wrap justify-evenly items-start q-gutter-md">
        <Recipe
          v-for="key in index" :key="key" v-show="display(key)"
          :size="$q.screen" :width="!size.lg ? size.sm ? '92vw' : '46vw' : '31vw'"
          :pub="pub" :selected="selectedDrink == key"
          :recipe="recipes[key]"
          :loggedIn="loggedIn" :user="user" :id="id"
          @selected="selectedDrink==key ? selectedDrink = '' : selectedDrink = key"
        />
      </div>
    </div>
    <q-footer class="transparent">
      <q-toolbar>
        <q-scroll-area
          horizontal
          style="height:37px;width:100vw;"
          class="rounded-borders"
        >
        <q-btn-toggle
            dense push rounded
            v-if="pub != ''"
            v-model="filterAvailable"
            class="q-mx-xs"
            toggle-color="orange"
            color="green-8"
            text-color="black"
            :options="[
              {label: 'All', value: false},
              {label: 'Available', value: true}
            ]" />
          <q-btn-toggle
            v-if="loggedIn"
            dense push rounded
            class="q-mx-xs"
            v-model="filterLiked"
            toggle-color="orange"
            color="green-8"
            text-color="black"
            :options="[
              {label: 'All', value: false},
              {label: 'Liked', value: true}
            ]" />
          <q-btn 
            dense push
            class="q-mx-xs"
            color="green-8"
            text-color="black" 
            icon="shuffle" 
            @click="randomize()" />
        </q-scroll-area>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import Graphic from 'components/Graphic.vue'
import Recipe from 'components/Recipe'

export default {
  name: 'PageRecipes',
  components: {
    Graphic,
    Recipe
  },
  data () {
    return {
      loggedIn: false,
      user: null,
      admin: false,
      size: this.$q.screen,
      id: this.$route.params.id,
      pub: '',
      
      loadedAvailable: false,
      loadedFilter: true,
      loadedOpinion: true,

      filterLiked: false,
      filterAvailable: false,

      selectedDrink: '',
      mult: 1,
      
      recipes: {},
      index: [],
    }
  },

  methods: {
    loadDrinks(){
      let ref = this.$database.ref("recipes/" + this.id)
      ref.orderByKey().once('value', data => {
        this.recipes = data.val();
        this.index = [];
        
        for(let drink in this.recipes){
          this.index.push(drink);
          this.recipes[drink].show = {
            'available': true,
            'filter': true
          }
          
          this.recipes[drink]['key'] = drink
          this.recipes[drink]["like"] = false
          this.recipes[drink]["dislike"] = false

          this.selectedDrink = null
        }

        this.loadedAvailable = true
        if(this.$q.sessionStorage.has('pub')){
          this.pub = this.$q.sessionStorage.getItem('pub').name
          let pub = this.$q.sessionStorage.getItem('pub').id
          pub = pub.replace('-', '')
          let ref = this.$database.ref("pubs/" + pub + '/available')
          ref.on("value", data => {
            this.availableItems(data.val());
          });
        }

        if(this.loggedIn){
          this.loadedFilter = false
          ref = this.$database.ref("users/" + this.user + "/filter/" + this.id)
          ref.orderByKey().on("value", data => {
            this.filterItems(data.val());
          });

          this.loadedOpinion = false
          ref = this.$database.ref("users/" + this.user + "/recipes/" + this.id)
          ref.on("value", data => {
            this.opinion(data.val());
          })
        }
        else {
          this.filterItems(null)
        }
      })
    },

    filterItems(list) {
      this.loadedFilter = false;
      let noFilter = true

      for(let drink in this.recipes) {
        this.recipes[drink].show.filter = false
        for(let id in this.recipes[drink].ingredients) {
          this.recipes[drink].ingredients[id].filter = false

          if(this.loggedIn){
            if(list != null && id in list) {
              this.recipes[drink].ingredients[id].filter = list[id]
              if(list[id]) {
                this.recipes[drink].show.filter = true
                noFilter = false
              }
            }
          }
          else {
            if(this.$q.sessionStorage.has(id)) {
              let check = this.$q.sessionStorage.getItem(id)
              this.recipes[drink].ingredients[id].filter = check
              if(check) {
                this.recipes[drink].show.filter = true
                noFilter = false
              }
            }
          }
        }
      }
      if(noFilter){
        for(let i in this.recipes) this.recipes[i].show.filter = true;
      }

      this.loadedFilter = true;
    },

    availableItems(list){
      this.loadedAvailable = false;

      for(let drink in this.recipes) {
        this.recipes[drink].show.available = true
        for(let id in this.recipes[drink].ingredients) {
          let type = this.recipes[drink].ingredients[id].type
          if(list != null && type in list) {
            if(id in list) {
              if(list[type] && !list[id]) this.recipes[drink].show.available = false
            }
            else if(list[type]) this.recipes[drink].show.available = false
          }
        }
      }

      this.loadedAvailable = true;
    },

    opinion(list) {
      this.loadedOpinion = false;
      for(let drink in this.recipes){

        this.recipes[drink]["like"] = false
        this.recipes[drink]["dislike"] = false

        if(list != null){
          if(drink in list){ 
            this.recipes[drink]["like"] = list[drink].like
            this.recipes[drink]["dislike"] = list[drink].dislike
          }
        }
      }
      this.loadedOpinion = true;
    },

    display(key) {
      let available = true;
      let liked = true;
      let filter = this.recipes[key].show.filter;
      if(this.filterAvailable) {
        available = this.recipes[key].show.available;
      }
      if(this.filterLiked) {
        liked = this.recipes[key].like
      }

      return (available && liked && filter);
    },

    randomize(){
      let temp = this.index;
      this.index = [];
      var j, x, i;
      for (i = temp.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = temp[i];
        temp[i] = temp[j];
        temp[j] = x;
      }
      this.index = temp;
    },
  },
  mounted() {
    this.$auth.onAuthStateChanged(user => {
      if(user) {
        this.loggedIn = true
        this.user = user.uid
        let ref = this.$database.ref("users/" + user.uid + "/admin")
        ref.on("value", data => {
          this.admin = data.val();
        })
      }
      this.loadDrinks();
    });
    this.$q.screen.setSizes({sm: 300, md: 500, lg: 1100, xl: 2000 })
  },
  watch: {
    $route (to, from) {
      if(to.fullPath != from.fullPath) {
        this.id = to.params.id
        this.index = []
        this.loadDrinks()
      }
    }
  }
}
</script>
