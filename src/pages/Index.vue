<template>
  <q-page class="flex flex-left">
    <q-header reveal>
      <q-scroll-area
      horizontal
      style="height: 50px; width: 100vw;"
      class="rounded-borders"
      >
      <div class="q-gutter-y-md">
        <q-toolbar>
          
          <q-toolbar-title> <div class="text-weight-bold q-px-md"> Cîroc Recipes </div> </q-toolbar-title>
          <q-btn class="q-mx-md" color="green-8" text-color="black" label="Choose Ingredients" @click="loadSelect()" />
          <q-btn color="green-8" text-color="black" icon="shuffle" @click="randomize()" />
        </q-toolbar>
      </div>
      </q-scroll-area>
    </q-header>
    <div class="full column justify-start items-start content-start">
      <div v-if="loaded" class="q-pa-md row wrap justify-evenly items-start q-gutter-md">
          <q-card  
          v-for="key in index" v-bind:key="key"
          v-show="recipes[key].available"
          v-bind:style="!size.lg ? size.sm ? 'width:92vw' : 'width:47vw' : 'width:31vw'"
          elevated
          v-bind:class="selectedDrink == key ? 'my-card text-white bg-orange' : 'my-card text-black bg-white'"
          >
            <div 
              v-bind:class="size.sm ? 'text-h5' : 'text-h4'"
              class="q-pt-lg text-center text-weight-bold text-no-wrap"
            >
              <div v-bind:style="selectedDrink == key ? 'color: white' : recipes[key].color"> 
                {{ recipes[key].name }}
              </div>
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
                      <div v-if="val.type == 'CÎROC VODKA'"> Cîroc {{val.name}} </div>
                      <div v-else> {{val.name}} </div>
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
    <div v-if="noResults" class="fixed-center text-h4 text-white"> No available recipes. </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      loaded: false,
      size: this.$q.screen,

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
      ref.orderByKey().on("value", data => {
        this.recipes = data.val();
        
        for(let i in this.recipes){
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

        this.availableItems();
        this.loaded = true;
      })
    },

    availableItems(){
      let ref = this.$database.ref("Ciroc Ingredients")
      ref.orderByKey().on("value", data => {
        let list = data.val();
        let filter = [];
        for(let i in list) {
          if(list[i].include) filter.push(i)
        }
        
        for(let i in this.recipes){
          this.index.push(i);
          this.recipes[i].available = true;
          let types = [];

          for(let j in this.recipes[i].ingredients){
            let item = this.recipes[i].ingredients[j];
            types.push(item.type)
            if(list[item.type].include){
              if(!list[item.type][item.name]) this.recipes[i].available = false;
            }
          }
          for(let item in filter){
            if(!types.includes(filter[item])) this.recipes[i].available = false;
          }

          if(this.recipes[i].available) this.noResults = false;
        }
      })

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

    loadSelect(){
      this.$router.push({ path: `/select` })
    }
  },
  mounted() {
    this.loadDrinks();
    this.$q.screen.setSizes({sm: 300, md: 500, lg: 1000, xl: 2000 })
  }
}
</script>
