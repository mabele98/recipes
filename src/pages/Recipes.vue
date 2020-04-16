<template>
  <q-page v-if="loadedAvailable && loadedFilter" class="flex flex-left">
    <q-header reveal>
      <q-toolbar>
        <q-scroll-area
          horizontal
          style="height:40px;width:100vw;"
          class="rounded-borders"
        >
        <div class="q-mt-xs row inline no-wrap">
          <div :class="size.sm ? 'text-h6' : 'text-h5'" class="text-weight-bold q-px-md text-no-wrap">  Cîroc Recipes </div>
          <q-btn 
            v-show="admin"
            dense push
            class="q-mx-md text-no-wrap"
            color="white" 
            text-color="green-8" 
            :label="size.sm ? 'Filter Available' : 'Filter Available Ingredients'" 
            @click="loadPage('/available/' + id)" />
          <q-btn 
            dense push
            class="q-mx-sm text-no-wrap"
            color="green-8" 
            text-color="black" 
            :label="size.sm ? 'Ingredients' : 'Filter Ingredients'" 
            @click="loadPage('/select/' + id)" />
          <q-btn 
            dense push
            class="q-mx-sm text-no-wrap"
            color="green-8" 
            text-color="black" 
            :label="size.sm ? 'Return' : 'Return Home'" 
            @click="loadPage('/')" />
        </div>
        </q-scroll-area>
      </q-toolbar>
      <div class="q-ml-lg text-caption text-italic">
          Bolded ingredients are your filter choices.
      </div>
    </q-header>
    <div class="full column justify-start items-start content-start">
      <div class="q-pa-md row wrap justify-evenly items-start q-gutter-md">
          <q-card  
          elevated
          v-for="key in index" v-bind:key="key"
          v-show="display(key)"
          v-bind:style="!size.lg ? size.sm ? 'width:92vw' : 'width:47vw' : 'width:31vw'"
          class="my-card text-black"
          v-bind:class="selectedDrink != key ? recipes[key].show.available ? 'bg-white' : 'bg-grey-4' : 'bg-orange'"
          >
            <div 
              v-bind:class="size.sm ? 'text-h5' : 'text-h4'"
              class="q-pt-lg text-center text-weight-bolder text-no-wrap"
            >
              <div v-bind:style="selectedDrink == key ? 'color: white' : 'color: ' + recipes[key].color"> 
                {{ recipes[key].name }}
              </div>
            </div>
            <div 
              class="text-caption text-center text-no-wrap text-italic">
              <div v-if="recipes[key].show.available"> Available </div>
              <div v-else> Not Available </div>
            </div>
              

            <q-card-section horizontal>
              <img 
                :id="'img' + key"
                v-if="selectedDrink != key"
                style="height:30vh;width:auto"
                class="q-ml-md"
              />
              <q-card-section horizontal v-if="selectedDrink == key">
                <q-card-section vertical>
                  <q-btn dense class="q-my-xs text-black" label="1x"
                  :color="mult==1 ? 'white':'orange'" @click="mult=1"/><br>
                  <q-btn dense class="q-my-xs text-black" label="2x"
                  :color="mult==2 ? 'white':'orange'" @click="mult=2"/><br>
                  <q-btn dense class="q-my-xs text-black" label="3x"
                  :color="mult==3 ? 'white':'orange'" @click="mult=3"/>
                </q-card-section>
                <q-card-section vertical>
                  <ul class="text-body1 text-weight-bold" v-for="(val,i) in recipes[key].ingredients" v-bind:key="i">
                    <div v-if="val != null">
                    <li v-if="val.measurement == null"> {{val.amount * mult}} {{val.name}} </li>
                    <li v-else> {{val.amount * mult}} {{val.measurement}} of {{val.name}} </li>
                    </div>
                  </ul>
                </q-card-section>
              </q-card-section>
                <q-card-section v-else>
                  <div 
                    class="text-body2 text-grey-9 text-weight-bold" 
                    style="line-height:2.00rem; letter-spacing: 0.02786em"
                    v-for="(val,i) in recipes[key].ingredients" v-bind:key="i" 
                    >
                    <div v-if="val != null">
                      <div :class="recipes[key].ingredients[i].filter ? 'text-weight-bold' : 'text-weight-regular'"
                        class="text-black"
                      >
                        {{val.name}}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card-section>

            <q-card-actions align="center">
              <div 
                class="text-caption" 
                :class="change.likes.id == key ? change.likes.change ? 'text-green' : 'text-black' : 'text-black'"> 
                {{recipes[key].likes}}
              </div>
              <q-btn flat 
                v-show="loadedOpinion"
                :ripple="false"
                :color="recipes[key].like ? 'green' : 'black'"
                icon-right="thumb_up" @click="like(key, true)" />
              <q-btn v-if="selectedDrink == key" flat icon="clear" @click="selectedDrink = ''"/>
              <q-btn v-else flat @click="selectedDrink = key">Recipe</q-btn>
              <q-btn flat 
                v-show="loadedOpinion"
                :ripple="false"
                :color="recipes[key].dislike ? 'red' : 'black'"
                icon="thumb_down" @click="like(key, false)"/>
              <div 
                class="text-caption" :class="change.dislikes.id == key ? change.dislikes.change ? 'text-red' : 'text-black' : 'text-black'">
                {{recipes[key].dislikes}}
              </div>
            </q-card-actions>
          </q-card>
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
export default {
  name: 'PageRecipes',
  data () {
    return {
      user: null,
      admin: false,
      size: this.$q.screen,
      id: this.$route.params.id,
      
      loadedAvailable: false,
      loadedFilter: false,
      loadedOpinion: false,

      change: {
        'likes': {id: '', change: false, add: true},
        'dislikes': {id: '', change: false, add: true}
      },

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

          this.selectedDrink = null
          let imageRef = this.$storage.ref().child(this.recipes[drink].image)
          imageRef.getDownloadURL().then(url => {
            let img = document.getElementById('img' + drink);
            img.src = url; 
          })

          ref = this.$database.ref("recipes/" + this.id + "/" + drink + '/likes')
          ref.on("value", data => { this.opinionChange(drink, data.val(), 'likes') })

          ref = this.$database.ref("recipes/" + this.id + "/" + drink + '/dislikes')
          ref.on("value", data => { this.opinionChange(drink, data.val(), 'dislikes') })
        }

        let ref = this.$database.ref("/available/" + this.id)
        ref.on("value", data => {
          this.availableItems(data.val());
        });

        ref = this.$database.ref("users/" + this.user + "/filter/" + this.id)
        ref.orderByKey().on("value", data => {
          this.filterItems(data.val());
        });

        ref = this.$database.ref("users/" + this.user + "/recipes/" + this.id)
        ref.on("value", data => {
          this.opinion(data.val());
        })

        console.log(this.recipes)
      })
    },

    filterItems(list) {
      this.loadedFilter = false;
      let noFilter = true

      for(let drink in this.recipes) {
        this.recipes[drink].show.filter = false
        for(let id in this.recipes[drink].ingredients) {
          this.recipes[drink].ingredients[id].filter = false
          if(list != null && id in list) {
            this.recipes[drink].ingredients[id].filter = list[id]
            if(list[id]) {
              this.recipes[drink].show.filter = true
              noFilter = false
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
          if(list != null) {
            if(type in list && id in list) {
              if(list[type] && !list[id]) this.recipes[drink].show.available = false
            }
          }
        }
      }

      this.loadedAvailable = true;
    },

    opinion(list) {
      this.liked = false;
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

    opinionChange(key, data, like) {
      if(data > this.recipes[key][like]) {
        this.change[like] = {
          id: key,
          change: true,
          add: true
        }
      }
      else if(data < this.recipes[key][like]) {
        this.change[like] = {
          id: key,
          change: true,
          add: false
        }
      }

      this.recipes[key][like] = data;
          
      setTimeout(() => {
        this.change[like].change = false;
      }, 1000)
    },

    like(key, like) {
      this.loadedOpinion = false;
      let prev = null

      if(like) {
        this.liked = false;
        prev = this.recipes[key].dislike
      }
      else {
        this.dislike = false;
        prev = this.recipes[key].like
      }

      let ref = this.$database.ref("users/" + this.user + "/recipes/" + this.id + "/" + key)
      ref.once("value", data => {
        let _like = false;
        let _dislike = false;

        if(like) {
          if(!data.exists() || data.val()['like'] == false) _like = true;
        }
        else {
          if(!data.exists() || data.val()['dislike'] == false) _dislike = true;
        }

        ref.set({"dislike": _dislike, "like": _like})
        
        let recipe = this.$database.ref("recipes/" + this.id + "/" + key)
        recipe.once("value", info => {
          let _likes = info.val()["likes"];
          let _dislikes = info.val()["dislikes"];

          if(like) {
            if(prev) _dislikes -= 1;

            if(_like) _likes += 1;
            else _likes -= 1;
          }
          else {
            if(prev) _likes -= 1;

            if(_dislike) _dislikes += 1;
            else _dislikes -= 1;
          }

          recipe.update({
            "dislikes": _dislikes,
            "likes": _likes
          });

          this.recipes[key].like = _like;
          this.recipes[key].dislike = _dislike;
          this.loadedOpinion = true;
        })
      })
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

    loadPage(link){
      this.$router.push(link)
    }
  },
  mounted() {
    this.$auth.onAuthStateChanged(user => {
      if (user == null) this.loadPage('/auth');
      this.user = user.uid
      let ref = this.$database.ref("users/" + user.uid + "/admin")
      ref.on("value", data => {
        this.admin = data.val();
      })
      this.loadDrinks();
    });
    this.$q.screen.setSizes({sm: 300, md: 500, lg: 1000, xl: 2000 })
  }
}
</script>
