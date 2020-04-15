<template>
    <q-page class="flex flex-center">
        <div v-if="!loaded" class="text-h2">
            LOADING PAGE...
        </div>
            <q-header reveal class="bg-deep-orange-5">
                <div class="q-gutter-y-md">
                    <q-toolbar>
                    <q-scroll-area
                    horizontal
                    style="height:40px;width:100vw;"
                    class="rounded-borders"
                    >
                    <div class="q-mt-xs row inline no-wrap">
                    <div :class="size.sm ? 'text-h6' : 'text-h5'"
                        class="text-weight-bold text-no-wrap q-mx-sm"> Choose Available Ingredients </div>
                    <q-btn push color="deep-orange-8 q-mx-sm" text-color="black" 
                        class="text-no-wrap" :label="size.sm ? 'Recipes' : 'Load Recipes'" @click="loadRecipes()" />
                    <q-btn push color="deep-orange-8 q-mx-sm" text-color="black"
                        class="text-no-wrap" label="Select All" @click="select(true)" />
                    <q-btn push color="deep-orange-8 q-mx-sm" text-color="black"
                        class="text-no-wrap" label="Select None" @click="select(false)" />
                    </div>
                    </q-scroll-area>
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
                <q-card-section horizontal class="row text-deep-orange-9 no-wrap">
                    <div class="text-h4 text-weight-bold"> {{type}} </div>
                    <div v-if="selected[type] != 0" corner="top-right" class="q-ml-sm q-mt-xs text-h5"> ({{selected[type]}}) </div>         
                </q-card-section> 
                <q-scroll-area
                    style="width:275px;height:300px"
                    class="rounded-borders q-mt-sm"
                >
                    <div
                        class="q-pa-sm text-subtitle1"
                        v-for="(data,name) in options[type]" 
                        v-bind:key="name"
                    >
                        <q-checkbox 
                            v-model="check" 
                            v-bind:val="data.info.id" 
                            v-bind:label="data.info.name" 
                            @input="updateDatabase(type,name)"
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
            id: this.$route.params.id,

            loaded: false,
            size: this.$q.screen,
            selected: {},
            check: [],
            options: {},
        }
    },

    methods: {
        loadIngredients() {
            let ref = this.$database.ref("recipes/" + this.id)
            ref.orderByKey().on("value", data => {
                for(let drink in data.val()){
                    for(let id in data.val()[drink].ingredients){
                        let name = data.val()[drink].ingredients[id].name;
                        let type = data.val()[drink].ingredients[id].type;

                        if (type in this.options) {
                            if(name in this.options[type]) this.options[type][name].ingredients.push(id);
                            else this.options[type][name] = { 'ingredients': [id] }
                        }
                        else {
                            this.options[type] = {}
                            this.options[type][name] = { 'ingredients': [id] }
                            this.selected[type] = 0;
                        }
                    }
                }

                for(let type in this.options) {
                    const ordered = {}
                    Object.keys(this.options[type]).sort().forEach(key => {
                        ordered[key] = this.options[type][key]; 
                    })
                    this.options[type] = ordered;
                }

                
                let available = this.$database.ref("available/" + this.id)
                available.orderByKey().once("value", info => {
                    if(info.exists()){
                        this.addLabels(info.val())
                    }
                    else this.addLabels(null)
                });
            });

        },

        addLabels(list) {
  
            for(let type in this.options){
                for(let name in this.options[type]){
                    let data = this.formatLabel(name)
                    let check = false
                    let id = this.options[type][name].ingredients[0]

                    if(list != null) check = list[id]

                    if(check) {
                        this.check.push(id)
                        this.selected[type] += 1
                    }

                    this.options[type][name]['info'] = {
                        'id': id,
                        'name': name,
                        'data': data,
                        'check': check
                    }
                }
            }
            this.loaded=true;
        },

        select(all){
            this.check = [];
            let value = {};

            for (let type in this.options) {
                this.$database.ref("available/" + this.id + "/" + type).set(all);
                let total = 0
                for (let name in this.options[type]) {
                    for (let i in this.options[type][name].ingredients) {
                        let id = this.options[type][name].ingredients[i]
                        this.$database.ref("available/" + this.id + "/" + id).set(all)
                    }
                    if(all) this.check.push(this.options[type][name].ingredients[0])
                    total += 1
                }
                if(all) this.selected[type] = total
                else this.selected[type] = 0
            }
        },

        formatLabel(item) {
            return { label: item, value: item, color: "orange"}
        },

        updateDatabase(type, name) {
            let check = !this.options[type][name].info.check
            this.options[type][name].info.check = check

            if(check) this.selected[type] += 1
            else this.selected[type] -= 1

            for (let i in this.options[type][name].ingredients) {
                let id = this.options[type][name].ingredients[i]
                this.$database.ref("available/" + this.id + "/" + id).set(check)
            }
            
            if(this.selected[type] == 0) this.$database.ref("available/" + this.id + "/" + type).set(false)
            else if(this.selected[type] == 1) this.$database.ref("available/" + this.id + "/" + type).set(true)
        },

        loadRecipes() {
            this.$router.push('/recipes/' + this.id)
        }
    },

    mounted() {
        this.loadIngredients();
        this.$auth.onAuthStateChanged(user => {
            if (user == null) this.$router.push('/auth')
            let ref = this.$database.ref('users/' + user.uid + '/admin');
            ref.on("value", data => {
                if(!data.val()) this.loadRecipes();
            })
        });
    }
}
</script>