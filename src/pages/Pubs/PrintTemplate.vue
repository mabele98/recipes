<template>
    <q-layout view="lHh Lpr lFf">
        <q-header class="bg-white" style="height:100px">
            <div class="row absolute-center text-black">
                <q-avatar size="75px">
                    <img src="statics/logo.png">
                </q-avatar>
                <div class="self-center text-h5 text-weight-bold"> 
                    {{pub}} 
                    <q-badge align="top" outline color="primary">PubLuck</q-badge>    
                </div>
            </div>
        </q-header>
        <q-page-container>
            <div v-if="loaded" class="full column justify-start items-start content-start">
                <div class="q-pa-md row wrap justify-evenly items-start q-gutter-md">
                    <q-card  
                    elevated
                    v-for="(value, key) in recipes" v-bind:key="key"
                    style="width:46vw;height:275px;"
                    class="my-card text-black"
                    :style="value.index % 6 == 0  || (value.index + 1) % 6 == 0? 'margin-bottom:120px' : ''"
                    >

                    <q-card-section class="text-h5 text-weight-bold text-center">
                        {{value.name}}
                    </q-card-section>

                    <q-card-section horizontal>
                        <div
                            class="q-mr-sm q-ml-lg"
                            style="height:200px;width:100px"
                        >
                            <Graphic
                            :graphic="recipes[key].graphic"
                            :id="key"
                            size="height:150px"
                            />
                        </div>
                        <q-card-section vertical>
                            <div 
                                v-for="(item, id) in value.ingredients" :key="id"
                                class="text-h7"
                            >
                                <div v-if="ingredients == 'recipe'">
                                    <div v-if="item.measurement == null"> {{item.amount}} {{item.name}} </div>
                                    <div v-else> {{item.amount}} {{item.measurement}} of {{item.name}} </div>
                                </div>
                                <div v-else>
                                    {{item.name}}
                                </div>
                            </div>
                        </q-card-section>
                    </q-card-section>
                    </q-card>
                </div>
            </div>
        </q-page-container>
    </q-layout>
</template>

<script>
import Graphic from 'components/Graphic.vue'

export default {
    name: 'PageTemplate',
    components: {
        Graphic
    },
    data () {
        return {
            loaded: false,

            drink: this.$route.params.drink,
            ingredients: this.$route.params.ingredients,
            likes: null,
            pub: null,
            available: null,
            recipes: {},

        }
    },
    methods: {
        loadUser() {
            if(this.$route.params.like){
                this.$auth.onAuthStateChanged(user => {
                    this.$database.ref('users/' + user.uid + '/recipes/' + this.drink).once('value', data => {
                        if(data.exists()) {
                            this.likes = data.val()
                        }
                        this.loadPub()
                    })
                })
            }
            else this.loadPub()
        },
        loadPub() {
            let pub = this.$route.params.pub
            if(pub != 'none') {
                this.$database.ref('pubs/' + pub).once('value', data => {
                    this.pub = data.val().name
                    if(this.$route.params.available) {
                        this.available = data.val().available
                    }
                    this.loadRecipes()
                })
            }
            else this.loadRecipes()
        },
        loadRecipes() {
            this.$database.ref('recipes/' + this.drink).once('value', data => {
                let total = 1
                for(let id in data.val()) {
                    if(this.likes != null && id in this.likes) {
                        if(!this.likes[id].like) continue
                    }
                    
                    if(this.available != null){
                        let check = true
                        for(let item in data.val()[id].ingredients) {
                            let type = data.val()[id].ingredients[item].type
                            if(type in this.available) {
                                if(item in this.available) {
                                    if(this.available[type] && !this.available[item]) check = false
                                }
                                else if(this.available[type]) check = false
                            }
                        }
                        if(!check) continue
                    }
                    this.recipes[id] = data.val()[id]
                    this.recipes[id]['index'] = total
                    total += 1
                }
                this.loaded = true
                console.log(this.recipes)
            })
        }

    },
    mounted () {
        this.loadUser()
    },
}
</script>