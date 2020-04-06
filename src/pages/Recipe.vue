<template>
    <q-page class="flex flex-center">
        <div class="column  justify-start items-start content-start">
            <div class="text-h1"> {{ drink }} </div>
            <div class="text-h4"> Cîroc {{vodka}} </div>
            <div class="text-body2" v-for="(key, val) in ingredients" v-bind:key="val">
                <div v-if="key.type == 'main'"> {{key.oz}} of Cîroc {{vodka}}</div>
                <div v-if="key.oz"> {{key.oz}} oz. of {{val}}</div>
                <div v-if="key.amount"> {{key.amount}} Pieces of {{val}}</div>
                <div v-if="key.slice"> {{key.slice}} Slice of {{val}}</div>
                <div v-if="key.type == 'garnish'"> {{amount}} {{val}}</div>
            </div>
            <q-btn color="white" text-color="black" label="Return" @click="index()"/>
        </div>
    </q-page>
</template>  


<script>
export default {
    name: "PageRecipe",
    data() {
        return {
            drink: '',
            vodka: '',
            ingredients: [],
        }
    },
    methods: {
        index() {
            this.$router.push('/')
        },
    },
    mounted() {
        this.drink = (this.$router.currentRoute.params.id).split('+').join(' ');


        this.$axios.get("statics/recipes/ciroc.json")
        .then(response => {
            let recipes = response.data;
            this.vodka = recipes[this.drink].vodka
            this.ingredients = recipes[this.drink].ingredients
        })
    }
}
</script>
