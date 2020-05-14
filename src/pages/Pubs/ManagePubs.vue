<template>
    <q-page>
        <div v-if="loaded" class="full column justify-start items-start content-start">
            <div class="fixed-center text-h3 text-center text-white">
                <div v-if="show == 'owner' && !owner_"> 
                    You do not own any pubs. <br>
                    <q-btn class="q-mt-md" label="Open one now!" color="green" @click="$router.push('/createpub')"/>
                </div>
                <div v-if="show == 'contribute' && !contribute_"> 
                    You are not a contributor for any pubs. <br> 
                    <q-btn class="q-mt-md" label="Request to contribute now!" color="green" @click="$router.push('/contributepub')"/>
                </div>
            </div>
            <div class="q-pa-md row wrap justify-evenly items-start q-gutter-md">
            <div v-for="(value,key) in available" :key="key">
                <q-card 
                    elevated
                    class="my-card text-black"
                    :style="!size.lg ? size.sm ? 'width:92vw' : 'width:47vw' : 'width:31vw'"
                    v-if="value.type == show"
                >
                    <q-card-section class="text-center"> 
                        <div class="text-h4 text-weight-bolder"> {{value.name}} </div>
                        <div class="text-h6"> ID: {{value.lookup}} </div>
                        <q-btn-toggle
                            v-model="value.edit"
                            class="q-mt-xs" toggle-color="primary"
                            :options="value.type == 'owner' ?
                            [ {label: 'Edit', value: 'edit'},
                            {label: 'Filter', value: 'filter'},
                            {label: 'Your Recipes', value: 'custom'}]
                            : [{label: 'Filter', value: 'filter'},
                            {label: 'Your Recipes', value: 'custom'}]"
                        />
                    </q-card-section>
                    <div v-if="value.edit == 'edit'">
                        <q-card-section>
                            <q-input 
                            rounded outlined 
                            v-model="value.name" 
                            hint="Pub Name" 
                            :rules="[ val => val.length <= 50 || 'Please use maximum 50 characters']"
                            @input="pubName(key)"
                            />
                            <q-input 
                            rounded outlined disable class="q-mt-lg"
                            v-model="value.owner" 
                            hint="Owner" 
                            />
                            <div class="q-pa-md q-gutter-md">
                                <q-list bordered class="rounded-borders">
                                    <q-item v-if="value.info">
                                        <div v-if="value.info" class="q-gutter-sm">
                                            <q-banner inline-actions rounded class="bg-green text-white">
                                            Friends can request to have access to filtering available ingredients.
                                            <template v-slot:action>
                                                <q-btn flat dense label="Dismiss" @click="value.info=false"/>
                                            </template>
                                            </q-banner>
                                        </div>
                                    </q-item>
                                <q-item>
                                    <q-item-label header>Contributors</q-item-label>
                                    <q-item-section side>
                                        <q-btn dense unelevated icon="info" class="text-green" @click="value.info=true"/>
                                    </q-item-section>
                                </q-item>

                                <q-scroll-area style="height:200px;">
                                <div v-if="value.contributors != null" >
                                    <q-item 
                                        v-for="(user, id) in value.contributors" :key="id"
                                        class="text-green"
                                    >
                                        <q-expansion-item
                                            :default-opened="false"
                                            group="friends"
                                            expand-separator
                                            icon="check"
                                            :label="user"
                                            style="width:300px"
                                        >
                                            <q-btn class="q-ma-xs" label="Remove" color="red" @click="removeContributor(value.id,id,true)"/>
                                        </q-expansion-item>
                                    </q-item>
                                </div>
                                <div v-if="value.pending != null" >
                                    <q-item 
                                        v-for="(user, id) in value.pending" :key="id"
                                        class="text-orange"
                                    >   
                                        <q-expansion-item
                                            group="friends"
                                            expand-separator
                                            icon="person_add"
                                            :label="user"
                                            style="width:300px"
                                        >
                                            <q-btn class="q-ma-xs" label="Remove" color="red" @click="removeContributor(value.id,id,false)"/>
                                            <q-btn class="q-ma-xs" label="Add" color="green" @click="addContributor(value.id,value.name,id,user)"/>
                                        </q-expansion-item>
                                    </q-item>
                                </div>
                                </q-scroll-area>
                                <q-item>
                                    <q-btn dense unelevated 
                                        :label="available[key].disable ? 'Enable Future Requests' : 'Disable Future Requests'" 
                                        :class="available[key].disable ? 'text-green' : 'text-red'"
                                        @click="disable(key)"/>
                                </q-item>
                                </q-list>
                            </div>
                        </q-card-section>
                    </div>
                    <div v-if="value.edit == 'filter'">
                        <q-card-section class="text-center">
                            <q-btn-dropdown color="orange" 
                            :label="filter != 'ALL' ? filter +' ('+selected[value.id][filter]+')' : filter">
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
                                        <q-item-label> {{type}} ({{selected[value.id][type]}})</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-btn-dropdown>
                        </q-card-section>

                        <q-card-section class="q-mx-lg" v-if="loaded" horizontal>
                            <q-scroll-area
                                :style="!size.lg ? size.sm ? 'width:90vw' : 'width:45vw' : 'width:29vw'"
                                style="height:65vh"
                                class="rounded-borders q-mt-sm q-mb-lg"
                            >
                                <div v-for="(val,type) in options" :key="type">
                                    <div v-show="filter == type || filter == 'ALL'">

                                        <div class="text-h5 q-mt-sm text-weight-bold">
                                            {{type}}
                                        </div>
                                        <div
                                            class="q-pa-sm text-subtitle1"
                                            v-for="(data,name) in options[type]" 
                                            v-bind:key="name"
                                        >   
                                            <div v-if="type == 'MAIN ALCOHOL'">
                                                <div class="text-h6 text-italic text-grey-9"> {{name}} </div>
                                                <div 
                                                    class="q-pa-sm text-subtitle1"
                                                    v-for="(info,drink) in options[type][name]" 
                                                    v-bind:key="drink" 
                                                >
                                                    <q-checkbox 
                                                        v-model="check[value.id]" 
                                                        color="orange"
                                                        v-bind:val="info[value.id].id" 
                                                        v-bind:label="info[value.id].name" 
                                                        @input="updateDatabase(type,name,drink,value.id)"
                                                    />
                                                </div>
                                            </div>
                                            <div v-else>
                                                <q-checkbox 
                                                    v-model="check[value.id]" 
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
                    </div>
                    <q-card-section v-if="value.type == 'owner' && value.edit=='edit'">
                        <q-btn label="DELETE PUB" color="red" @click="remove(key)"/>
                    </q-card-section>
                    <div v-if="value.edit=='custom'">
                        <q-card-section>
                            <div v-for="(i, type) in custom[key]" :key="type">
                                <div class="text-h5 q-mt-sm text-weight-bold"> {{type}} </div>
                                <q-list padding bordered class="rounded-borders">
                                    <q-expansion-item
                                        v-for="(recipe, id) in custom[key][type]" :key="id"
                                        dense dense-toggle expand-separator switch-toggle-side
                                        :style="'color:' + recipe.graphic.color"
                                        :label="recipe.name"
                                    >
                                        <Recipe
                                            :size="$q.screen" :width="!size.lg ? size.sm ? '80vw' : '40vw' : '27vw'"
                                            :recipe="recipe" :pub="{'id': value.id, 'name': value.name}" class="q-my-sm"
                                            :selected="select == id" @selected="select==id ? select = '' : select = id"
                                        /> 
                                        <q-card-actions v-if="available[key].type == 'owner'">
                                            <q-btn label="remove" color="red" style="margin:auto" 
                                            @click="type=='pending' ? removeRecipe(key,id,'pending') : removeRecipe(key,id,'available')"/>
                                            <q-btn v-if="type=='pending'" label="add" color="green" style="margin:auto" @click="addRecipe(key,id)"/>
                                        </q-card-actions>
                                    </q-expansion-item>
                                </q-list>
                            </div>
                        </q-card-section>
                    </div>
                </q-card>
            </div>
            </div>
        </div>
        <q-footer class="transparent">
            <q-toolbar>
                <q-btn-toggle
                    dense push rounded
                    v-model="show"
                    class="q-mx-xs"
                    toggle-color="orange"
                    color="green-8"
                    text-color="black"
                    :options="[
                    {label: 'Owner', value: 'owner'},
                    {label: 'Contributor', value: 'contribute'}
                    ]" />
            </q-toolbar>
        </q-footer>
    </q-page>
</template>

<script>
import Recipe from 'components/Recipe.vue'

export default {
    name: "PageManagePubs",
    components: {
        Recipe
    },
    data() {
        return {
            user: null,
            size: this.$q.screen,
            loaded: false,

            filter: 'ALL',
            show: 'owner',

            options: {
                'MAIN ALCOHOL': {},
                'ADDITIONAL ALCOHOL': {},
                'JUICE': {},
                'POP': {},
                'HOT BEVERAGE': {},
                'ADD IN': {},
                'SYRUP': {},
                'GARNISH': {}
            },
            custom: {},
            selected: {},
            check: {},

            edit: {},
            name: '',
            info: false,
            select: '',


            available: null,
            total: 0,
            pub: '',

            owner_: false,
            contribute_: false
        }
    },
    methods: {
        owner(id) {
            this.$database.ref('/pubs/' + id).on('value', data => {
                this.$set(this.available[id], 'contributors', data.val().contributors)
                this.$set(this.available[id], 'pending', data.val().pending)

                let owner = data.val().owner
                this.$database.ref('/users/' + owner + '/name').once('value', user => {
                    this.$set(this.available[id], 'owner', user.val())
                })
            })
        },
        loadIngredients() {
            let ref = this.$database.ref("ingredients")
            ref.orderByKey().on("value", data => {
                for(let key in data.val()){
                    const name = data.val()[key].name
                    const type = data.val()[key].type
                    const keys = []
                    for(let id in data.val()[key].keys){
                        keys.push(data.val()[key].keys[id])
                    }
                    if(type in this.options) {
                        this.options[type][name] = {}
                        this.options[type][name]['ingredients'] = keys
                    }
                    else {
                        if(!(type in this.options['MAIN ALCOHOL'])){
                            this.options['MAIN ALCOHOL'][type] = {}
                        }
                        this.options['MAIN ALCOHOL'][type][name] = {}
                        this.options['MAIN ALCOHOL'][type][name]['ingredients'] = keys
                    }
                }

                for(let type in this.options) {
                    this.options[type] = this.alphabetize(this.options[type]);

                    if(type == 'MAIN ALCOHOL') {
                        for(let drink in this.options[type]) {
                            this.options[type][drink] = this.alphabetize(this.options[type][drink])
                        }
                    }
                }
                this.loadCustom()

                for(let pub in this.available) {
                    const id = this.available[pub].id
                    let available = this.$database.ref("pubs/" + id + "/available")
                    available.orderByKey().on("value", info => {
                        if(info.exists()){
                            this.addLabels(info.val(), id)
                        }
                        else this.addLabels(null, id)
                    });
                }
            });

        },

        addLabels(list, pub) {
            this.$set(this.check, pub, [])
            for(let type in this.options){
                this.selected[pub][type] = 0
                for(let name in this.options[type]){
                    let check = false
                    if(type == "MAIN ALCOHOL"){
                        for(let i in this.options[type][name]) {
                            let data = this.formatLabel(i)
                            let id = this.options[type][name][i].ingredients[0]

                            if(list != null) check = list[id]

                            if(check) {
                                this.check[pub].push(id)
                                this.selected[pub][type] += 1;
                                this.selected[pub]['ALL'] += 1;
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
                            this.check[pub].push(id)
                            this.selected[pub][type] += 1
                            this.selected[pub]['ALL'] += 1
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
            this.loaded = true
        },
        loadCustom() {
            for(let pub in this.available) {
                this.$database.ref('pubs/' + pub + '/recipes').on('value', data => {
                    this.$set(this.custom, pub, {})
                    this.$set(this.custom[pub], 'available', {})
                    this.$set(this.custom[pub], 'pending', {})
                    if(data.exists()){
                        this.custom[pub].available = data.val()['available']
                        this.custom[pub].pending = data.val()['pending']

                        /*for(let key in data.val()['available']){
                            for(let id in data.val()['available'][key].ingredients){
                                const item = data.val()['available'][key].ingredients[id]
                                const name = item.name
                                const type = item.type
                                if(type in this.options) {
                                    if(name in this.options[type]) {
                                        if(!(pub in this.options[type][name])) this.options[type][name][pub] = {'ingredients': []}
                                    }
                                    else {
                                        this.options[type][name] = {}
                                        this.options[type][name][pub] = {'ingredients': []}
                                    }
                                    this.options[type][name][pub]['ingredients'].push(id)
                                }
                                else {
                                    const pubName = this.available[pub].name
                                    if(!(pubName in this.options['MAIN ALCOHOL'])) this.options['MAIN ALCOHOL'][pubName] = {}
                                    if(name in this.options['MAIN ALCOHOL'][pubName]){
                                        if(!(pub in this.options['MAIN ALCOHOL'][pubName][name])){ 
                                            this.options['MAIN ALCOHOL'][pubName][name][pub] = {'ingredients': []}
                                        }
                                    }
                                    else {
                                        this.options['MAIN ALCOHOL'][pubName][name] = {}
                                        this.options['MAIN ALCOHOL'][pubName][name][pub] = {'ingredients': []}
                                    }
                                    this.options['MAIN ALCOHOL'][pubName][name][pub]['ingredients'].push(id)
                                }
                            }
                        }*/
                    }
                    /*this.$database.ref("pubs/" + pub + "/available").on("value", info => {
                        if(info.exists()){
                            this.addLabels(info.val(), pub)
                        }
                        else this.addLabels(null, pub)
                    });*/
                })
            }
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
        disable(key) {
            let check = !this.available[key].disable
            this.available[key].disable = check

            this.$database.ref('pubs/' + this.available[key].id + '/disable').set(check)
        },
        pubName(pub) {
            this.$database.ref('pubs/' + pub).update({'/name': this.available[pub].name})
            this.$database.ref('users/' + this.user + '/pubs/owner/' + pub).set(this.available[pub].name)
        },
        removeContributor(pub,uid,contributor) {
            let ref = null
            if(contributor) {
                ref = this.$database.ref('pubs/' + pub + '/contributors/' + uid)
                this.$database.ref('users/' + uid + '/pubs/contribute/' + pub).remove()
            }
            else ref = this.$database.ref('pubs/' + pub + '/pending/' + uid)

            ref.remove()
        },
        addContributor(pub,pubName,uid,uName) {
            this.$database.ref('pubs/' + pub + '/pending/' + uid).remove()
            this.$database.ref('pubs/' + pub + '/contributors/' + uid).set(uName)
            this.$database.ref('users/' + uid + '/pubs/contribute/' + pub).set(pubName)
        },
        updateDatabase(type, main, name, pub) {
            let check = false
            if(main != ''){
                check = !this.options[type][main][name][pub].check
                this.options[type][main][name][pub].check = check
            } 
            else {
                check = !this.options[type][name][pub].check
                this.options[type][name][pub].check = check
            }

            if(check) {
                this.selected[pub][type] += 1
                this.selected[pub]['ALL'] += 1
            }
            else {
                this.selected[pub][type] -= 1
                this.selected[pub]['ALL'] -= 1
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

            if(this.selected[pub][type] == 0) this.$database.ref("pubs/" + pub + "/available/" + id).set(false)
            else if(this.selected[pub][type] == 1) this.$database.ref("pubs/" + pub + "/available/" + id).set(true)
        },
        home() {
            this.$router.push('/')
        },
        remove(pub) {
            let friends = {}
            if('contributors' in this.available[pub]) friends = this.available[pub].contributors
            var data = {
                'id': pub,
                'contributors': friends
            }
            var remove = this.$functions.httpsCallable('removePub');
            remove(data).then((result) => {
                this.$delete(this.available, pub)
            }).catch((error) => {
                console.log(error.message)
            })
        },
        addRecipe(pub, id) {
            this.$database.ref('pubs/' + pub + '/recipes/pending/' + id).once('value', data => {
                let recipe = data.val()
                this.$database.ref('pubs/' + pub + '/recipes/available/' + id).set(recipe)
                this.removeRecipe(pub, id, 'pending')
            })
        },
        removeRecipe(pub, key, type) {
            console.log(pub, key, type, this.custom)
            console.log(this.custom[pub][type][key])
            for(let id in this.custom[pub][type][key]['ingredients']){
                this.$database.ref('pubs/available/' + id).remove()
            }
            this.$database.ref('pubs/' + pub + '/recipes/' + type + '/' + key).remove()
        }
    },
    mounted() {
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                this.user = user.uid
                let ref = this.$database.ref('users/' + user.uid + '/pubs')
                ref.once('value', data => {
                    if(data.exists()){
                        this.total += 1
                        this.available = {}
                        for(let type in data.val()){
                            for(let i in data.val()[type]) {
                                this.$set(this.available, i, {})
                                this.$set(this.available[i], 'type', type)
                                this.$set(this.available[i], 'id', i)
                                this.$set(this.available[i], 'name', data.val()[type][i])
                                this.$set(this.available[i], 'info', false)
                                this.$set(this.available[i], 'lookup', i.slice(0, 3) + "-" + i.slice(3))
                                this.$set(this.available[i], 'edit', 'filter')

                                if(type == 'owner') this.owner_ = true
                                else this.contribute_ = true

                                this.owner(i)
                                this.selected[i] = {}
                                this.selected[i]['ALL'] = 0
                                
                                this.$database.ref('pubs/' + i + '/disable').once('value', snapshot => {
                                    this.$set(this.available[i], 'disable', snapshot.val())
                                })
                            }
                        }
                        this.loadIngredients()
                    }
                    else this.loaded = true
                })
            }
        })
        this.$q.screen.setSizes({sm: 300, md: 500, lg: 1000, xl: 2000 })
    }
}
</script>