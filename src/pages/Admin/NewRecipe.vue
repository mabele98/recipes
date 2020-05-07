<template>
    <q-page class="flex flex-center">
        <q-card style="width:95vw">
            <div v-if="step == 1">
                <q-card-section class="text-h4 text-bold">
                    Add the Recipe Info
                </q-card-section>
                <q-scroll-area class="q-mb-lg" style="height:78vh">
                    <q-card-section>
                        <q-card-section horizontal>
                            <q-input 
                                class="q-mb-lg" style="width:60vw"
                                square outlined v-model="recipe.name" 
                                :rules="[ val => val.length <= 30 || 'Please use maximum 30 characters']"
                                label="Recipe Name" />
                            <q-btn-dropdown class="q-ml-sm" :label="pub.id" style="height:55px">
                                <q-list>
                                    <q-item 
                                        clickable v-close-popup :class="pub.id == value.id ? 'bg-orange' : 'bg-white'"
                                        v-for="(value,key) in pubs" :key="key"
                                        @click="pub=value">
                                        <q-item-label>{{value.name}}</q-item-label>
                                    </q-item>
                                    <q-item
                                        v-if="admin" :class="pub.name == 'None' ? 'bg-orange' : 'bg-white'"
                                        clickable v-close-popup
                                        @click="pub={'id': 'None', 'name': 'None'}">
                                        <q-item-label>None</q-item-label>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </q-card-section>
                        <q-input 
                            class="q-mb-lg"
                            square outlined v-model="recipe.description"
                            :rules="[ val => val.length <= 100 || 'Please use maximum 100 characters']" 
                            label="Recipe Description" />
                        <div v-if="admin && pub.name == 'None'">
                            <q-input 
                                class="q-mb-lg"
                                square outlined v-model="recipe.id"
                                :rules="[ val => val.length <= 100 || 'Please use maximum 100 characters']" 
                                label="Drink Type" />
                            <q-input 
                                class="q-mb-lg"
                                square outlined v-model="recipe.url" 
                                hint="If your recipe links to another site, add url here!"
                                label="Recipe URL" />
                        </div>
                    </q-card-section>
                    <q-card-section class="text-h6 text-grey-10"> Ingredients </q-card-section>
                    <q-card-section v-for="(item,key) in ingredients" :key="key">
                        <div class="text-h7 text-grey-8"> Ingredient {{key + 1}} </div>
                        <q-input 
                            class="q-mb-sm"
                            square outlined v-model="item.name" 
                            :rules="[ val => val.length <= 30 || 'Please use maximum 30 characters']"
                            label="Ingredient Name" />
                        <q-card-section horizontal>
                            <q-input 
                                class="q-mb-sm q-mr-sm"
                                square outlined type="number" v-model="item.amount" 
                                :rules="[ val => val.length <= 30 || 'Please use maximum 30 characters']"
                                label="Amount" />
                            <q-btn-dropdown :label="item.measurement" style="height:55px">
                                <q-list>
                                    <q-item clickable v-close-popup @click="item.measurement = 'oz.'">
                                        <q-item-label>oz.</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.measurement = 'slice'">
                                        <q-item-label>slice</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.measurement = 'piece'">
                                        <q-item-label>piece</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.measurement = 'squeeze'">
                                        <q-item-label>squeeze</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.measurement = 'splash'">
                                        <q-item-label>splash</q-item-label>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </q-card-section>
                        <q-card-section horizontal>
                            <q-btn-dropdown :label="item.type" style="height:55px">
                                <q-list>
                                    <q-item clickable v-close-popup @click="item.type = 'MAIN'">
                                        <q-item-label>MAIN INGREDIENT</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.type = 'ADD. ALCOHOL'">
                                        <q-item-label>ADDITIONAL ALCOHOL</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.type = 'JUICE'">
                                        <q-item-label>JUICE</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.type = 'POP'">
                                        <q-item-label>POP</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.type = 'SYRUP'">
                                        <q-item-label>SYRUP</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.type = 'ADD IN'">
                                        <q-item-label>ADD IN</q-item-label>
                                    </q-item>
                                    <q-item clickable v-close-popup @click="item.type = 'GARNISH'">
                                        <q-item-label>GARNISH</q-item-label>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                            <q-btn class="q-ml-lg" color="green" icon="add_circle" @click="addIngredient()"/>
                            <q-btn v-if="key != 0" class="q-ml-lg" color="red" icon="clear" @click="removeIngredient(key)"/>
                        </q-card-section>
                    </q-card-section>
                    <q-card-actions class="q-mt-lg">
                        <q-btn 
                            style="margin:auto;width:50%"
                            unelevated color="orange" 
                            @click="step = 2"
                            label="Design the Graphic" />
                    </q-card-actions>
                </q-scroll-area>
            </div>
            <div v-if="step == 2">
                <q-card-section class="text-h4 text-bold">
                    Design a Graphic
                </q-card-section>
                <q-card-section style="height:35vh;margin:auto;width:50%">
                    <Graphic
                        id="design"
                        :graphic="{
                            'glass': graphic.glass,
                            'color': graphic.color,
                            'garnish': graphic.garnish,
                            'fill': graphic.fill,
                            'ice': graphic.ice,
                            'foam': graphic.foam
                        }"
                        size="height:30vh"
                    />
                </q-card-section>
                <q-card-section>
                    <div class="text-subtitle1"> Choose an option </div>
                    <q-scroll-area
                        horizontal
                        style="height:40px;width:90vw;"
                        class="rounded-borders"
                    >
                        <q-btn-toggle
                            v-model="choose" 
                            push class="text-no-wrap"
                            toggle-color="orange"
                            :options="available()"
                        />
                    </q-scroll-area>
                    <div class="text-subtitle1"> Choose a {{choose}} </div>
                    <q-scroll-area
                        horizontal
                        style="height:200px;width:90vw;"
                        class="rounded-borders"
                    >
                        <div class="fit row no-wrap justify-start items-start content-start">
                            <div 
                                v-for="item in data[choose]" :key="choose=='color' ? item.hex : item"
                                style="height:200px;width:130px"
                                @click="choose=='color' ? graphic[choose]=item.hex : graphic[choose]=item"
                            >
                                <Graphic
                                    :id="choose == 'color' ? choose + item.hex : choose + item"
                                    :graphic="createImage(choose,item)"
                                    size="height:175px;"
                                />
                            </div>
                        </div>
                    </q-scroll-area>
                </q-card-section>
                <q-card-actions>
                    <q-btn 
                        style="margin:auto;width:50%"
                        unelevated color="orange" 
                        @click="step = 3"
                        label="Check your Recipe" />
                </q-card-actions>
            </div>
            <div v-if="step == 3">
                <q-card-section class="text-h4 text-weight-bold">
                    Check your recipe!
                </q-card-section>
                <q-card-section>
                    <Recipe
                        :recipe="loadRecipe()"
                        :size="$q.screen" width="315px"
                        :pub="pub.name == 'None' ? '' : pub.name"
                        :selected="selected"
                        @selected="selected = !selected"
                    />
                </q-card-section>

                <q-card-actions>
                    <q-btn 
                        style="margin:auto;width:50%"
                        unelevated class="q-mx-xs" color="red" 
                        @click="step = 1"
                        label="Cancel" />
                    <q-btn 
                        style="margin:auto;width:50%"
                        unelevated class="q-mx-xs" color="green" 
                        @click="submit()"
                        label="Submit" />
                </q-card-actions>
            </div>
            <div v-if="step == 4">
                <q-card-section class="text-h4 text-weight-bold">
                    Your recipe has been submitted!
                </q-card-section>
                <q-card-actions>
                    <q-btn label="Add new recipe" @click="step = 1"/>
                    <q-btn label="Home Page" />
                </q-card-actions>
            </div>
        </q-card>
    </q-page>
</template>

<script>
import QFirebaseUploader from 'components/QFirebaseUploader'
import Graphic from 'components/Graphic'
import Recipe from 'components/Recipe'

export default {
    name: "PageNewRecipe",
    components: {
        QFirebaseUploader,
        Graphic,
        Recipe
    },
    data () {
        return {
            admin: false,
            step: 1,
            pubs: [],
            pub: {'id': 'Pub', 'name': 'Pub'},
            recipe: {
                'name': '',
                'description': '',
                'url': '',
                'id': ''
            },
            ingredients: [
                {
                    'name': '',
                    'amount': '',
                    'measurement': 'Measurement',
                    'type': 'Type'
                }
            ],
            graphic: {
                'glass': 'tall',
                'color': '#FFFFFF',
                'garnish': 'none',
                'fill': 'none',
                'ice': false,
                'foam': false
            },
            choose: 'glass',
            options: [],
            data: {},
            selected: false
        }
    },

    methods: {
        addIngredient() {
            this.ingredients.push(
                {
                    'name': '',
                    'amount': '',
                    'measurement': 'Measurement',
                    'type': 'Type'
                }
            )
        },
        removeIngredient(key) {
            this.ingredients.splice(key)
        },
        listOf(item) {
            let res = [];
            if(item != 'color'){
                for(let id in this.data[item]) {
                    let name = this.data[item][id]
                    res.push({'label': name, 'value': name})
                }
            }
            else {
                for(let id in this.data[item]) {
                    let name = this.data[item][id]
                    res.push({'label': name.name, 'value': name.hex})
                }
            }
            return res
        },
        available() {
            let res = []
            for(let key in this.options) {
                let item = this.options[key]
                if(item.label == 'whippedcream') {
                    if(this.graphic.garnish != 'whippedcream') continue
                }
                res.push(item)
            }
            return res
        },
        createImage(choose, item) {
            let image = {}
            for(let type in this.graphic) {
                image[type] = this.graphic[type]
            }

            if(choose == 'color') image[choose] = item.hex
            else image[choose] = item

            return image
        },
        loadRecipe() {
            let recipe = {}
            recipe['name'] = this.recipe.name
            recipe['url'] = this.recipe.url
            recipe['graphic'] = this.graphic
            recipe['ingredients'] = this.ingredients
            recipe['likes'] = 0
            recipe['like'] = false
            recipe['dislikes'] = 0
            recipe['dislike'] = false
            recipe['show'] = {'available': true}

            return recipe
        },
        submit() {
            let ingredients = {}
            for(let id in this.ingredients) {
                let item = this.ingredients[id]
                ingredients[id] = item
                if(item.type == 'MAIN') {
                    if(this.pub.name == 'None') ingredients[id].type = this.recipe.id.toUpperCase()
                    else ingredients[id].type = this.pub.name.toUpperCase()
                }
                if(item.type == 'ADD. ALCOHOL') {
                    ingredients[id].type = 'ADDITIONAL ALCOHOL'
                }
            }


            let recipe = {}
            recipe['name'] = this.recipe.name
            recipe['url'] = this.recipe.url
            recipe['graphic'] = this.graphic
            recipe['likes'] = 0
            recipe['dislikes'] = 0

            let data = {}
            data['id'] = this.recipe.id
            data['recipe'] = recipe
            data['ingredients'] = ingredients
            data['pub'] = null

            if(this.pub.name != 'None') data['pub'] = this.pub.id
            var create = this.$functions.httpsCallable('createRecipe');
            create(data).then((result) => {
                this.step = 4
            })
            .catch((error) => {
                console.log(error)
            })
        }
    },
    mounted () {
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                let ref = this.$database.ref("users/" + user.uid)
                ref.on("value", data => {
                    this.admin = data.val().admin;
                    for(let type in data.val().pubs) {
                        for(let id in data.val().pubs[type]) {
                            this.pubs.push({
                                'id': id,
                                'name': data.val().pubs[type][id] 
                            })
                        }
                    }
                })
            }
        })

        this.$database.ref('graphics').once("value", data => {
            for(let type in data.val()){
                this.options.push({'label': type, 'value': type})
                this.data[type] = []

                for(let item in data.val()[type]){
                    this.data[type].push(data.val()[type][item]);
                }
            } 
            this.options.push({'label': 'ice', 'value': 'ice'})
            this.data['ice'] = [true, false]

            this.options.push({'label': 'foam', 'value': 'foam'})
            this.data['foam'] = [true, false]
        })
    }
}
</script>