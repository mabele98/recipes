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
            @click="loadPage('/CirocRecipes/selectAvailable')" />
          
          <q-btn-toggle
            dense push rounded
            v-model="showAvailable"
            toggle-color="orange"
            color="green-8"
            text-color="black"
            :options="[
              {label: 'All', value: false},
              {label: 'Available', value: true}
            ]" />
          <q-btn 
            dense push
            class="q-mx-md text-no-wrap"
            color="green-8" 
            text-color="black" 
            :label="size.sm ? 'Ingredients' : 'Filter Ingredients'" 
            @click="loadPage('/CirocRecipes/select')" />  
          <q-btn
            dense push
            class="q-mx-md text-no-wrap"
            color="green-8"
            text-color="black"
            :label="size.sm ? 'Return' : 'Return to Home'"
            @click="loadPage('/')" />
          <q-btn 
            v-if="!size.sm"
            dense push
            class="q-mx-md"
            color="green-8"
            text-color="black" 
            icon="shuffle" 
            @click="randomize()" />
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
          v-for="key in index" v-bind:key="key"
          v-show="showAvailable ? recipes[key].show.available && recipes[key].show.filter : recipes[key].show.filter"
          v-bind:style="!size.lg ? size.sm ? 'width:92vw' : 'width:47vw' : 'width:31vw'"
          elevated
          v-bind:class="selectedDrink == key ? 'my-card text-white bg-orange' : 'my-card text-black bg-white'"
          >
            <div 
              v-bind:class="size.sm ? 'text-h5' : 'text-h4'"
              class="q-pt-lg text-center text-weight-bolder text-no-wrap"
            >
              <div v-bind:style="selectedDrink == key ? 'color: white' : recipes[key].color"> 
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
                v-if="selectedDrink != key"
                style="height:30vh;width:auto"
                class="q-pt-lg q-pl-md"
                v-bind:src="'statics/img/'+recipes[key].image+'.png'"
              />
              <q-card-section vertical>
                <q-card-section v-if="selectedDrink == key">
                  <ul class="text-body1 text-weight-bold" v-for="(val,i) in recipes[key].ingredients" v-bind:key="i">
                    <div v-if="val != null">
                    <li v-if="val.type == 'CÎROC VODKA'"> {{val.oz}} oz. of Cîroc {{ val.name }} </li>
                    <li v-else-if="val.amount"> {{val.amount}} {{val.name}} </li>
                    <li v-else-if="val.pieces"> {{val.pieces}} pieces of {{val.name}} </li>
                    <li v-else> {{val.oz}} oz. of {{val.name}} </li>
                    </div>
                  </ul>
                </q-card-section>
                <q-card-section v-else>
                  <div 
                    class="text-body2 text-grey-9 text-weight-bold" 
                    style="line-height:2.00rem; letter-spacing: 0.02786em"
                    v-for="(val,i) in recipes[key].ingredients" v-bind:key="i" 
                    >
                    <div v-if="val != null">
                      <div :class="filter[key][val.name] ? 'text-weight-bold' : 'text-weight-regular'"
                        class="text-black"
                      >
                        <div v-if="val.type == 'CÎROC VODKA'"> Cîroc {{val.name}}</div>
                        <div v-else> {{val.name}} </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn v-if="selectedDrink == key" flat icon="clear" @click="selectedDrink = ''"/>
              <q-btn v-else flat @click="selectedDrink = key">Recipe</q-btn>
            </q-card-actions>
          </q-card>
      </div>
    </div>
    <q-btn 
      v-if="size.sm"
      push
      class="fixed-bottom-right q-mr-md q-mb-md"
      color="green-8"
      text-color="black" 
      icon="shuffle" 
      @click="randomize()" />
    <div v-if="noResults" class="fixed-center text-h4 text-white"> No available recipes. </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageRecipes',
  data () {
    return {
      user: null,
      admin: false,
      
      loadedAvailable: false,
      loadedFilter: false,
      
      filter: {},

      size: this.$q.screen,

      showAvailable: false,

      selectedDrink: '',
      recipes: {},
      
      index: [],

      noResults: true
    }
  },
  methods: {
    loadDrinks(){
      let drinks = [];
      let ref = this.$database.ref("Ciroc Recipes")
      ref.orderByKey().once('value', data => {
        this.recipes = data.val();
        this.index = [];
        
        for(let i in this.recipes){
          this.index.push(i);
          this.recipes[i].show = {
            'available': true,
            'filter': true
          }

          let image = this.recipes[i].name
          if(image.includes("î")) image = image.replace("î","i");
          if(image.includes("ñ")) image = image.replace("ñ","n")
          this.recipes[i]["image"] = image;

          let vodka = this.recipes[i].ingredients["1"].name;
          if(vodka == "Vodka") this.recipes[i]["color"] = 'color:#243090'
          else if(vodka == "Pineapple") this.recipes[i]["color"] = 'color:#FAC300'
          else if(vodka == "Amaretto") this.recipes[i]["color"] = 'color:#6B0F05'
          else if(vodka == "French Vanilla") this.recipes[i]["color"] = 'color:#EA9F42'
          else if(vodka == "Coconut") this.recipes[i]["color"] = 'color:#5B5957'
          else if(vodka == "Peach") this.recipes[i]["color"] = 'color:#F28500'
          else if(vodka == "Red Berry") this.recipes[i]["color"] = 'color:#A60000'
          else if(vodka == "Apple") this.recipes[i]["color"] = "color:#00B939"
          else if(vodka == "White Grape Vodka") this.recipes[i]["color"] = 'color:#E0CFAF'
          else this.recipes[i]["color"] = 'color:black'
        }
        //this.randomize();

        let ref = this.$database.ref("Ciroc Ingredients")
        ref.on("value", data => {
          console.log('recieved')
          this.filterItems("available", data.val());
          console.log('complete', this.recipes)
        });

        ref = this.$database.ref("Users/" + this.user + "/Filter Ingredients")
        ref.orderByKey().on("value", data => {
          this.filterItems("filter", data.val());
        });
      })
    },

    filterItems(type, list){
      if(type == "filter")this.loadedFilter = false;
      else this.loadedAvailable = false;

      let filter = [];
      for(let i in list) {
        if(list[i].include) filter.push(i)
      }

      
      for(let i in this.recipes){
        let types = [];
        this.recipes[i].show[type] = true
        for(let j in this.recipes[i].ingredients){
          let item = this.recipes[i].ingredients[j];
          types.push(item.type)
          
          if(type=="filter"){
            if(!(i in this.filter)) this.filter[i] = {}
            this.filter[i][item.name] = false
          }
          if(list != null && item.type in list){
            if(list[item.type].include){
              if(item.name in list[item.type]){
                if(!list[item.type][item.name]) this.recipes[i].show[type] = false;
                else{
                  if(type=="filter") this.filter[i][item.name] = true;
                }
              }
              else this.recipes[i].show[type] = false;
            }
          }
        }
        for(let item in filter){
          if(!types.includes(filter[item])) this.recipes[i].show[type] = false;
        }

        if(this.recipes[i].show[type]) this.noResults = false;
      }
      if(type == "filter") this.loadedFilter = true;
      else this.loadedAvailable = true;
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
      let ref = this.$database.ref("Users/" + user.uid + "/admin")
      ref.on("value", data => {
        this.admin = data.val();
      })
      this.loadDrinks();
    });
    this.$q.screen.setSizes({sm: 300, md: 500, lg: 1000, xl: 2000 })
  }
}
</script>
