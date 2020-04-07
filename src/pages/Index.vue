<template>
  <q-page class="flex flex-left" style="background-color:#232323">
    <div class="full column justify-start items-start content-start">
      <div class="q-gutter-y-md">
        <q-toolbar style="width:100vw" class="bg-green text-white q-my-md shadow-2">
          <q-btn color="green-8" text-color="black" icon="shuffle" @click="randomize()" />
          <q-toolbar-title>Cîroc Recipes</q-toolbar-title>
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
      <div class="q-pa-md row justify-evenly items-start q-gutter-md">
        <q-card  
          style="width:31vw"
          v-for="drink in drinks" v-bind:key="drink"
          v-bind:class="selectedDrink == drink ? 'my-card text-white bg-orange' : 'my-card text-black bg-white'"
          >
          <div class="q-pt-lg text-center text-h4 text-weight-bold text-no-wrap">{{ drink }} </div>
          <div class="text-center text-italic text-subtitle1">Cîroc {{ recipes[drink].vodka }}</div>
          <q-card-section horizontal>
            <img 
              style="height:30vh;width:auto" 
              class="q-pt-lg q-pl-md"
              v-bind:src="'statics/img/'+drink+'.png'"
            />
            <q-card-section vertical>
              <q-card-section v-if="selectedDrink == drink">
                <ul class="text-body1" v-for="(val,key) in recipes[drink].ingredients" v-bind:key="key">
                  <li v-if="key == 'Vodka'"> {{val.oz}} oz. of Cîroc {{ recipes[drink].vodka }} </li>
                  <li v-else-if="val.amount"> {{val.amount}} {{key}} </li>
                  <li v-else-if="val.pieces"> {{val.pieces}} pieces of {{key}} </li>
                  <li v-else> {{val.oz}} oz. of {{ key}} </li>
                </ul>
              </q-card-section>
              <q-card-section v-else>
                <div class="text-body2">
                    {{ recipes[drink].description }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn v-if="selectedDrink == drink" flat @click="selectedDrink = ''">Unselect</q-btn>
            <q-btn v-else flat @click="selectedDrink = drink">Select</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      selectedDrink: '',

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
        this.drinks = this.drinks.sort();
        drinks = drinks.sort();

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
      juices = juices.sort();
      adds = adds.sort();
      garnishes = garnishes.sort();
      alcohols = alcohols.sort();

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
      this.drinks = this.drinks.sort()
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

    randomize(){
      let temp = this.drinks;
      this.drinks = [];
      var j, x, i;
      for (i = temp.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = temp[i];
        temp[i] = temp[j];
        temp[j] = x;
      }
      this.drinks = temp;
    }

  },
  mounted() {
    this.loadDrinks();
  }
}
</script>
