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
                <div class="row justify-center content-center text-h4 text-center text-green-10 text-weight-bold"> 
                    <div> {{type}} </div>
                    <div v-if="selected[type] != 0" class="q-ml-sm q-mt-xs text-h5"> ({{selected[type]}}) </div>         
                </div> 
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
                            v-bind:val="info.id" 
                            v-bind:label="info.name" 
                            @input="updateDatabase(type,i)"
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
            user: null,
            selected: {},
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
                            this.selected[type] = 0;
                        }
                    }
                }

                for(let type in this.options){
                    this.options[type].sort()
                }

                let ref = this.$database.ref("Users/" + this.user + "/Filter Ingredients")
                ref.orderByKey().once("value", data => {
                    if(data.exists()){
                        this.addLabels(data.val())
                    }
                    else this.addLabels(null)
                });
            });

        },

        addLabels(list) {
            let id = 0;
            for(let i in this.options){
                for(let j in this.options[i]){
                    let name = this.options[i][j]
                    let data = this.formatLabel(name)
                    let check = false;
                    if(list!=null && (i in list)){
                        if(name in list[i]) check = list[i][name];
                    }
                    if(check) {
                        this.check.push(id)
                        this.selected[i] += 1;
                    }
                    this.options[i][j] = {
                        'id': id,
                        'name': name,
                        'data': data,
                        "check": check
                    }
                    id += 1;
                }
            }
            this.loaded=true
        },

        formatLabel(item) {
            return { label: item, value: item, color: 'orange'}
        },

        updateDatabase(type, id) {
            let check = !this.options[type][id].check
            let name = this.options[type][id].name

            this.options[type][id].check = check

            if(check) this.selected[type] += 1
            else this.selected[type] -= 1

            let ref = this.$database.ref("Users/" + this.user + '/Filter Ingredients/' + type + "/include")
            if(this.selected[type] == 0) ref.set(false)
            else if(this.selected[type] == 1) ref.set(true)

            this.$database.ref("Users/" + this.user + '/Filter Ingredients/' + type + "/" + name).set(check)
        },

        loadRecipes() {
            this.$router.push('/CirocRecipes')
        }
    },

    mounted() {
        this.$auth.onAuthStateChanged(user => {
            this.user = user.uid
            this.loadIngredients();
        })
    }
}
</script>