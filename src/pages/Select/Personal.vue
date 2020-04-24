<template>
    <q-page class="flex flex-center">
        <div v-if="!loaded" class="text-h2">
            LOADING PAGE...
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
                <q-card-section horizontal class="row text-green-10 no-wrap">
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
            user: null,
            loggedIn: false,

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

                if(this.loggedIn) {
                    let filter = this.$database.ref("users/" + this.user + "/filter/" + this.id)
                    filter.orderByKey().once("value", info => {
                        if(info.exists()){
                            this.addLabels(info.val())
                        }
                        else this.addLabels(null)
                    });
                }
                else {
                    this.addLabels(null)
                }
            });

        },

        addLabels(list) {
            for(let type in this.options){
                for(let name in this.options[type]){
                    let data = this.formatLabel(name)
                    let check = false
                    let id = this.options[type][name].ingredients[0]

                    if(this.loggedIn){
                        if(list != null) check = list[id]
                    }
                    else {
                        if(this.$q.sessionStorage.has(id)) check = this.$q.sessionStorage.getItem(id)
                    }

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
                let total = 0
                for (let name in this.options[type]) {
                    for (let i in this.options[type][name].ingredients) {
                        let id = this.options[type][name].ingredients[i]
                        this.$database.ref("users/" + this.user + "/filter/" + this.id + "/" + id).set(all)
                    }
                    if(all) this.check.push(this.options[type][name].ingredients[0])
                    total += 1
                }
                if(all) this.selected[type] = total
                else this.selected[type] = 0
            }
        },

        formatLabel(item) {
            return { label: item, value: item, color: 'orange'}
        },

        updateDatabase(type, name) {
            let check = !this.options[type][name].info.check
            this.options[type][name].info.check = check

            if(check) this.selected[type] += 1
            else this.selected[type] -= 1

            for (let i in this.options[type][name].ingredients) {
                let id = this.options[type][name].ingredients[i]
                if(this.loggedIn){
                    this.$database.ref("users/" + this.user + "/filter/" + this.id + "/" + id).set(check)
                }
                else {
                    this.$q.sessionStorage.set(id, check)
                }
            }
        },

        loadRecipes() {
            this.$router.push('/recipes/' + this.id)
        }
    },

    mounted() {
        this.$auth.onAuthStateChanged(user => {
            if(user){
                this.loggedIn = true
                this.user = user.uid
            }
            this.loadIngredients();
        })
    }
}
</script>