<template>
    <q-page>
        <q-header reveal class="bg-orange">
        <q-toolbar>
            <q-avatar> <img src="statics/logo.png"/> </q-avatar>
            <q-toolbar-title class="text-weight-bold"> MyPub </q-toolbar-title>
            <q-btn label="Return Home" @click="home()"/>
        </q-toolbar>
        </q-header>
        <div class="full column justify-start items-start content-start">
            <div class="q-pa-md row wrap justify-evenly items-start q-gutter-md">
                <q-card 
                    elevated
                    class="my-card text-black"
                    :style="!size.lg ? size.sm ? 'width:92vw' : 'width:47vw' : 'width:31vw'"
                    v-for="(value,key) in available" 
                    :key="key"
                >
                    <q-card-section class="text-center"> 
                        <div class="text-h4 text-weight-bolder"> {{value.name}} </div>
                        <div class="text-h6"> ID: {{value.lookup}} </div>
                    </q-card-section>
        
                    <q-card-section horizontal>
                        <q-btn-dropdown class="q-mx-sm" color="orange" :label="filter +' ('+selected[filter]+')'">
                            <q-item 
                                clickable v-close-popup
                                @click="filter = 'ALL'"
                            >
                                <q-item-section>
                                    <q-item-label> ALL </q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item 
                                clickable v-close-popup
                                v-for="(val,type) in options" :key="type"
                                @click="filter = type"
                            >
                                <q-item-section>
                                    <q-item-label> {{type}} </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-btn-dropdown>
                    </q-card-section>

                    <q-card-section class="q-mx-sm" v-if="loaded" horizontal>
                        <q-scroll-area
                            :style="!size.lg ? size.sm ? 'width:90vw' : 'width:45vw' : 'width:29vw'"
                            style="height:65vh"
                            class="rounded-borders q-mt-sm"
                        >
                            <div v-for="(val,type) in options" :key="type">
                                <div v-show="filter == type || filter == 'ALL'">

                                    <div class="text-h5 q-mt-sm text-weight-bold">
                                        <div v-if="type == 'ADDITIONAL ALCOHOL'"> ADD. ALCOHOL </div>
                                        <div v-else> {{type}} </div>
                                    </div>
                                    <div
                                        class="q-pa-sm text-subtitle1"
                                        v-for="(data,name) in options[type]" 
                                        v-bind:key="name"
                                    >   
                                        <div v-if="type == 'MAIN ALCOHOL'">
                                            <div class="text-h6 text-italic"> {{name}} </div>
                                            <div 
                                                class="q-pa-sm text-subtitle1"
                                                v-for="(info,drink) in options[type][name]" 
                                                v-bind:key="drink" 
                                            >
                                                <q-checkbox 
                                                    v-model="check" 
                                                    color="orange"
                                                    v-bind:val="info[value.id].id" 
                                                    v-bind:label="info[value.id].name" 
                                                    @input="updateDatabase(type,name,drink,value.id)"
                                                />
                                            </div>
                                        </div>
                                        <div v-else>
                                            <q-checkbox 
                                                v-model="check" 
                                                color="orange"
                                                class="text-subtitle1"
                                                v-bind:val="data[value.id].id" 
                                                v-bind:label="data[value.id].name" 
                                                @input="updateDatabase(type,'',name,value.id)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-scroll-area>
                    </q-card-section>
                </q-card>
            </div>
        </div>

    </q-page>
</template>

<script>
export default {
    name: "PageManagePubs",
    data() {
        return {
            size: this.$q.screen,
            loaded: false,

            all: {},
            names: {},
            main: {},

            filter: 'ALL',

            options: {},
            selected: {'ALL': 0},
            check: [],


            available: null,
            pub: '',
            current: '',
            teal: false,
        }
    },
    methods: {
        loadIngredients() {
            let ref = this.$database.ref("ingredients")
            ref.orderByKey().on("value", data => {
                for(let key in data.val()){
                    let type = key.substring(2)
                    this.options[type] = {}
                    this.selected[type] = 0;
                    for(let id in data.val()[key]){
                        let name = data.val()[key][id]

                        if(type == "MAIN ALCOHOL") {
                            if(!(id in this.options[type])) this.options[type][id] = {}
                            for(let alc in data.val()[key][id]) {
                                let name = data.val()[key][id][alc]
                                if(name in this.options[type][id]) this.options[type][id][name].ingredients.push(alc)
                                else this.options[type][id][name] = { 'ingredients': [alc]}
                            }
                        }
                        
                        else {
                            let name = data.val()[key][id]
                            if(name in this.options[type]) this.options[type][name].ingredients.push(id);
                            else this.options[type][name] = { 'ingredients': [id] }
                        }
                    }
                }

                for(let type in this.options) {
                    this.options[type] = this.alphabetize(this.options[type]);

                    if(type == 'MAIN ALCOHOL') {
                        for(let id in this.options[type]) {
                            this.options[type][id] = this.alphabetize(this.options[type][id])
                        }
                    }
                }

                for(let pub in this.available) {
                    let id = this.available[pub].id
                    let available = this.$database.ref("pubs/" + id + "/available")
                    available.orderByKey().once("value", info => {
                        if(info.exists()){
                            this.addLabels(info.val(), id)
                        }
                        else this.addLabels(null, id)
                    });
                }

                console.log(this.options)
            });

        },

        addLabels(list, pub) {
  
            for(let type in this.options){
                for(let name in this.options[type]){
                    let check = false
                    if(type == "MAIN ALCOHOL"){
                        for(let i in this.options[type][name]) {
                            let data = this.formatLabel(i)
                            let id = this.options[type][name][i].ingredients[0]

                            if(list != null) check = list[id]

                            if(check) {
                                this.check.push(id)
                                this.selected[type] += 1;
                                this.selected['ALL'] += 1;
                            }

                            this.options[type][name][i][pub] = {
                                'id': id,
                                'name': i,
                                'data': data,
                                'check': check
                            }
                        }
                    }
                    else {
                        let data = this.formatLabel(name)
                        let id = this.options[type][name].ingredients[0]

                        if(list != null) check = list[id]

                        if(check) {
                            this.check.push(id)
                            this.selected[type] += 1
                            this.selected['ALL'] += 1
                        }

                        this.options[type][name][pub] = {
                            'id': id,
                            'name': name,
                            'data': data,
                            'check': check
                        }
                    }
                }
            }
            console.log(this.options)
            this.loaded=true;
        },
        formatLabel(item) {
            return { label: item, value: item, color: "orange"}
        },
        alphabetize(list) {
            let ordered = {}
            Object.keys(list).sort().forEach(key => {
                ordered[key] = list[key]; 
            })
            return ordered
        },
        updateDatabase(type, main, name, pub) {
            let check = false
            console.log(type, main, name, pub)
            if(main != ''){
                check = !this.options[type][main][name][pub].check
                this.options[type][main][name][pub].check = check
            } 
            else {
                check = !this.options[type][name][pub].check
                this.options[type][name][pub].check = check
            }

            if(check) {
                this.selected[type] += 1
                this.selected['ALL'] += 1
            }
            else {
                this.selected[type] -= 1
                this.selected['ALL'] -= 1
            }

            if(main != '') {
                for (let i in this.options[type][main][name].ingredients) {
                    let id = this.options[type][main][name].ingredients[i]
                    this.$database.ref('pubs/' + pub + '/available/' + id).set(check)
                }
            }
            else {
                for (let i in this.options[type][name].ingredients) {
                    let id = this.options[type][name].ingredients[i]
                    this.$database.ref('pubs/' + pub + '/available/' + id).set(check)
                }
            }

            let id = type
            if(main != '') id = main

            if(this.selected[type] == 0) this.$database.ref("pubs/" + pub + "/available/" + id).set(false)
            else if(this.selected[type] == 1) this.$database.ref("pubs/" + pub + "/available/" + id).set(true)
        },
        home() {
            this.$router.push('/')
        }
    },
    mounted() {
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                let ref = this.$database.ref('users/' + user.uid + '/pubs/owner')
                ref.once('value', data => {
                    this.available = data.val()
                    for(let i in data.val()){
                        this.available[i]['lookup'] = data.val()[i].id.slice(0, 3) + "-" + data.val()[i].id.slice(3)
                    }

                    this.loadIngredients()
                })
            }
        })
        this.$q.screen.setSizes({sm: 300, md: 500, lg: 1000, xl: 2000 })
        console.log(this.size)

        this.$database.ref('ingredients').once('value', data => {
            for(let type in data.val()) {
                let name = type.substring(2)
                this.all[name] = data.val()[type]
            }
        })
    }
}
</script>