<template>
    <q-page class="flex flex-center">
        <div v-if="!loaded" class="text-h2">
            LOADING PAGE...
        </div>
        <div v-if="check.length != 0">
            <q-header>
                <div class="row wrap">
                    <div 
                        class="col q-pr-sm text-white text-center"
                        v-for="(value,type) in options"
                        v-bind:key="type"
                    >   
                        <div class="text-weight-bold"> {{type}} </div>
                        <div
                            v-for="(info,i) in value"
                            v-bind:key="i"
                        >
                            <div v-if="info.check"> {{info.name}} </div>
                        </div>
                    </div>
                </div>
            </q-header>
        </div>
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
       
        <q-btn class="fixed-bottom-left" color="grey" text-color="black" label="RECIPES" @click="loadRecipes" />
    </q-page>
</template>

<script>
export default {
    name: 'PageSelect',
    
    data () {
        return {
            loaded: false,
            check: [],
            options: {},
        }
    },

    methods: {
        loadIngredients() {
            this.$axios.get("statics/recipes/ciroc.json")
            .then(response => {
                for(let drink in response.data["Ciroc Recipes"]){
                    for(let i in response.data["Ciroc Recipes"][drink].ingredients){
                        let name = response.data["Ciroc Recipes"][drink].ingredients[i].name
                        let type = response.data["Ciroc Recipes"][drink].ingredients[i].type
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
            let include = false;
            let list = null;
            if(this.$q.localStorage.has("Available Items")){
                list = this.$q.localStorage.getItem("Available Items");
            }
            for(let i in this.options){
                for(let j in this.options[i]){
                    let name = this.options[i][j]
                    let data = this.formatLabel(name)
                    if(list != null) {
                        include = list[i][name];
                        if(include) this.check.push(name)
                    }
                    this.options[i][j] = {
                        'name': name,
                        'data': data,
                        'check': include,
                    }
                }
            }
        },

        formatLabel(item) {
            return { label: item, value: item, color: 'green'}
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

            this.$q.localStorage.set("Available Items", items)

            this.$router.push('/')
        }
    },

    mounted() {
        this.loadIngredients();
    }
}
</script>