<template>
    <q-page class="flex flex-center">
        <div v-if="!loaded" class="text-h2">
            LOADING PAGE...
        </div>
            <q-header reveal>
                <div class="q-gutter-y-md">
                    <q-toolbar>
                    <div :class="size.sm ? 'text-h6' : 'text-h5'"
                        class="text-weight-bold text-no-wrap q-mx-sm"> Choose Ingredients </div>
                    <q-btn push color="green-8 q-mx-sm" text-color="black" 
                        :label="size.sm ? 'Recipes' : 'Load Recipes'" @click="loadRecipes()" />
                    </q-toolbar>
                </div>
            </q-header>
        <div v-if="loaded" class="fit row wrap justify-center items-start content-center">
            <q-card
                elevated
                square
                class="q-pa-sm q-ma-xs my-card"
                style="width:300px;height:400px"
                v-for="(value,type) in options"
                v-bind:key="type"
            >
                <div class="text-h4 text-center text-green-10 text-weight-bold"> {{type}} </div> 
                <q-scroll-area
                    style="width:275px;height:300px"
                    class="rounded-borders q-mt-sm"
                >
                    <div
                        class="q-pa-sm text-subtitle1"
                        v-for="(info,i) in options[type]" 
                        v-bind:key="i"
                    >
                        <q-checkbox 
                            v-model="check" 
                            v-bind:val="info.name" 
                            v-bind:label="info.name" 
                            @input="info.check = !info.check"
                        />
                    </div>
                </q-scroll-area>
            </q-card>
        </div>
    </q-page>
</template>

<script>
export default {
    name: 'PageSelect',
    
    data () {
        return {
            loaded: false,
            size: this.$q.screen,
            check: [],
            options: {},
        }
    },

    methods: {
        loadIngredients() {
            let ref = this.$database.ref("Ciroc Recipes")
            ref.orderByKey().on("value", data => {
                let recipes = data.val();

                for(let drink in recipes){
                    for(let i in recipes[drink].ingredients){
                        let name = recipes[drink].ingredients[i].name
                        let type = recipes[drink].ingredients[i].type

                        if(type in this.options) {
                            if(!this.options[type].includes(name)) this.options[type].push(name)
                        }
                        else{
                            this.options[type] = [name]
                        }
                    }
                }

                for(let type in this.options){
                    this.options[type].sort()
                }

                this.addLabels();

                this.loaded=true
            });

        },

        addLabels() {
            let ref = this.$database.ref("Ciroc Ingredients")
            ref.orderByKey().on("value", data => {
                let list = data.val();
                for(let i in this.options){
                    for(let j in this.options[i]){
                        let name = this.options[i][j]
                        let data = this.formatLabel(name)
                        let check = list[i][name];
                        if(check) this.check.push(name)
                        this.options[i][j] = {
                            'name': name,
                            'data': data,
                            "check": check
                        }
                    }
                }
            })
        },

        formatLabel(item) {
            return { label: item, value: item, color: 'orange'}
        },

        loadRecipes() {
            let items= {};
            for(let type in this.options){
                items[type] = {"include": false};
                for(let i in this.options[type]){
                    items[type][this.options[type][i].name] = this.options[type][i].check;
                    if(this.options[type][i].check) items[type]["include"] = true;
                }
            }

            this.$database.ref('Ciroc Ingredients').set(items)

            this.$router.push('/')
        }
    },

    mounted() {
        this.loadIngredients();
    }
}
</script>