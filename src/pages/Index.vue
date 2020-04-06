<template>
  <q-page class="flex flex-left">
    <div class="full column justify-start items-start content-start">
      <div class="q-gutter-y-md">
        <q-toolbar class="bg-green text-white q-my-md shadow-2">
          <q-btn-dropdown auto-close stretch flat label="Cîroc Vodka">
            <div class="q-pa-md">
              <q-option-group
                :options="vodka"
                label="Vodka"
                type="checkbox"
                v-model="checkVodka"
                @input="updateDrinks()"
              />
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown auto-close stretch flat label="Additional Alcohol">
            <div class="q-pa-md">
              <q-option-group
                :options="alcohol"
                label="Alcohol"
                type="checkbox"
                v-model="checkAlcohol"
                @input="updateDrinks()"
              />
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown auto-close stretch flat label="Juice and Pop">
            <div class="q-pa-md">
              <q-option-group
                :options="juice"
                label="Juice"
                type="checkbox"
                v-model="checkJuice"
                @input="updateDrinks()"
              />
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown auto-close stretch flat label="Add Ins">
            <div class="q-pa-md">
              <q-option-group
                :options="add"
                label="Add"
                type="checkbox"
                v-model="checkAdd"
                @input="updateDrinks()"
              />
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown auto-close stretch flat label="Garnishes">
            <div class="q-pa-md">
              <q-option-group
                :options="garnish"
                label="Garnish"
                type="checkbox"
                v-model="checkGarnish"
                @input="updateDrinks()"
              />
            </div>
          </q-btn-dropdown>
        </q-toolbar>
      </div>
      
      <div class="q-pa-md q-gutter-sm" v-for="drink in drinks" v-bind:key=drink>
        <q-btn color="white" text-color="black" v-bind:label="drink" @click="loadRecipe(drink)"/>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      recipes: {},

      vodka: [],
      checkVodka: [],

      juice: [],
      checkJuice: [],

      add: [],
      checkAdd: [],

      garnish: [],
      checkGarnish: [],

      alcohol: [],
      checkAlcohol: [],

      drinks: [],
    }
  },
  methods: {
    loadDrinks(){
      let drinks = [];
      this.$axios.get("statics/recipes/ciroc.json")
      .then(response => {
        this.loadIngredients(response);

        this.recipes = response.data;

        for(let i in response.data){
          this.drinks.push(i);
          let vodka = response.data[i].vodka
          if(drinks.includes(vodka) == false){
            drinks.push(vodka)
          }
        }

        for(let i in drinks) {
          this.vodka.push(
            { label: drinks[i], value: drinks[i], color: 'green'}
          )
        }
      })
    },

    loadIngredients(response){
      let juices = [];
      let adds = [];
      let garnishes = [];
      let alcohols = [];

      for(let i in response.data){
        for(let j in response.data[i].ingredients){
          let item = response.data[i].ingredients[j];
          if(item.type === "juice" || item.type === "pop"){
            if(juices.includes(j) == false) juices.push(j);
          }
          else if(item.type === "add" || item.type === "syrup") {
            if(adds.includes(j) == false) adds.push(j);
          }
          else if(item.type === "garnish") {
            if(garnishes.includes(j) == false)  garnishes.push(j);
          }
          else if(item.type === "alcohol"){
            if(alcohols.includes(j) == false) alcohols.push(j);
          }
        }
      }

      for(let i in juices) {
        this.juice.push(
          { label: juices[i], value: juices[i], color: 'orange'}
        )
      }
      for(let i in adds) {
        this.add.push(
          { label: adds[i], value: adds[i], color: 'red'},
        )
      }
      for(let i in garnishes) {
        this.garnish.push(
          { label: garnishes[i], value: garnishes[i], color: 'purple'},
        )
      }
      for(let i in alcohols) {
        this.alcohol.push(
          { label: alcohols[i], value: alcohols[i], color: 'yellow'},
        )
      }
    },

    updateDrinks(){
      let drinks = {};

      let _alc = [];
      let _juice = [];
      let _add = [];
      let _garnish = [];

      for(let i in this.recipes){
        drinks[i] = true;
        _alc.push(i);
        _juice.push(i);
        _add.push(i);
        _garnish.push(i);
        if(this.checkVodka.length!=0){
          let vodka = this.recipes[i].vodka
          if(this.checkVodka.includes(vodka) == false) {
            drinks[i] = false
          }
        }
      }
  
      if(this.checkAlcohol.length!=0) _alc=this.checkIngredients("alcohol", "", this.checkAlcohol);
      if(this.checkJuice.length!=0) _juice=this.checkIngredients("juice", "pop", this.checkJuice);
      if(this.checkAdd.length!=0) _add=this.checkIngredients("add", "syrup", this.checkAdd);
      if(this.checkGarnish.length!=0) _garnish=this.checkIngredients("garnish","", this.checkGarnish);
      
      for(let i in drinks){
        if(_alc.includes(i) == false) drinks[i] = false;
        if(_juice.includes(i) == false) drinks[i] = false;
        if(_add.includes(i) == false) drinks[i] = false;
        if(_garnish.includes(i) == false) drinks[i] = false;
      }

      this.drinks = [];
      for(let i in drinks){
        if(drinks[i]) this.drinks.push(i)
      }
    },

    checkIngredients(type1, type2, array){
      let options = [];
      for(let i in this.recipes){
        for(let j in this.recipes[i].ingredients){
          let item = this.recipes[i].ingredients[j];
          if(item.type == type1 || item.type == type2){
            if(array.includes(j)){
              options.push(i);
              break;
            }
          }
        }
      }
      return options;
    },

    loadRecipe(drink){
      let _drink = drink;
      if(drink == "Cîroc Colada") _drink = "pina-colada"
      else if(drink == "Cîroc Appletini") _drink = "appletini"
      else if(drink == "Cîroc Apple Smash") _drink = "vodka-cranberry"
      else{
        let _drink = drink.replace(' &', '')
        _drink = _drink.replace('.', '')
        _drink = _drink.replace('î', 'i')
        _drink = _drink.split(' ').join('-');
        _drink = _drink.toLowerCase();
      }
      let link = "https://www.ciroc.com/en-us/vodka-drinks/"+_drink+'#'
      window.open(link);
    }


    
  },
  mounted() {
    this.loadDrinks();
  }
}
</script>
