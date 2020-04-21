<template>
    <q-page class="flex flex-center">

        <q-card v-if="!confirm" style="width:500px;">
            <q-scroll-area
                style="height:90vh;width:500px;"
                class="rounded-borders"
            >
            <q-card-section vertical>
                <div class="text-black text-h3"> Add recipe! </div>

                <q-btn label="Submit" class="text-white" color="green" @click="submit(false)"/>

                <q-input v-model="name" label="Drink Name"/>
                <q-input v-model="type" label="Drink Type"/>
                <q-input v-model="description" label="Description"/>
                <q-input v-model="url" label="url"/>

                <div class="text-h4 text-black q-mt-md"> Ingredients </div>
                <div v-for="(value,key) in ingredients" :key="key">
                    <div class="text-subtitle2 text-black q-mt-md"> Ingredient #{{key + 1}} </div>
                    <q-input v-model="ingredients[key].name" label="Name"/>
                    <q-input v-model="ingredients[key].amount" label="Amount"/>
                    <q-card-section horizontal>
                    <q-btn-dropdown class="q-my-xs text-black" color="white" label="Measurement">
                        <q-list> <q-item 
                            clickable v-close-popup 
                            v-for="item in measurement" 
                            :key="item"
                            @click="ingredients[key].measurement = item"
                            > <q-item-section>
                                <q-item-label>{{item}}</q-item-label>
                            </q-item-section> </q-item></q-list>
                    </q-btn-dropdown> 
                    <div v-if="ingredients[key].measurement != ''" class="text-h5 q-ma-sm"> 
                        {{ingredients[key].measurement}} </div>
                    </q-card-section>
                    <q-card-section horizontal>
                    <q-btn-dropdown class="q-my-xs text-black" color="white" label="Type">
                        <q-list> <q-item 
                            clickable v-close-popup 
                            v-for="item in type_" 
                            :key="item"
                            @click="ingredients[key].type = item"
                            > <q-item-section>
                                <q-item-label>{{item}}</q-item-label>
                            </q-item-section> </q-item></q-list>
                    </q-btn-dropdown> 
                    <div v-if="ingredients[key].type != ''" class="text-h5 q-ma-sm"> 
                        {{ingredients[key].type}} </div>
                    </q-card-section>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-btn label="+" class="text-black" @click="add()" />

            </q-card-actions>
            </q-scroll-area>
        </q-card>

        <q-card v-if="confirm && loaded" style="width:600px;height:90vh">

            <div class="text-h4 q-mx-md text-blue"> Create a graphic! </div>

            <q-card-section horizontal>
                <q-card-section vertical style="width: 300px">

                <div v-for="(val, key) in data" :key="key">
                    <div v-if="key != 'whippedcream'">
                    <div class="q-mt-sm text-h6 text-green"> Choose a {{key}} </div>
                        <div v-if="key == 'color'">
                            <q-color
                                v-model="graphic[key]"
                                no-footer
                                default-view="palette"
                                :palette="val"
                                class="my-picker q-my-md"
                            />
                        </div>
                            <div v-else>  
                            <q-scroll-area
                                horizontal
                                style="height:40px;width:275px;"
                                class="rounded-borders"
                            >
                            <q-btn-toggle
                                class="q-mb-lg"
                                v-model="graphic[key]" 
                                push
                                toggle-color="blue"
                                :options="listOf(val)"
                            />
                            </q-scroll-area>
                        </div>
                    </div>
                </div>
                <div v-if="graphic['garnish'] == 'whippedcream'">
                    <div class="q-mt-md text-h6 text-orange"> Choose a whipped cream </div>
                    <q-scroll-area
                        horizontal
                        style="height:40px;width:275px;"
                        class="rounded-borders"
                    >
                    <q-btn-toggle
                        class="q-mb-lg"
                        v-model="graphic['whippedcream']" 
                        push
                        toggle-color="blue"
                        :options="listOf(data['whippedcream'])"
                    />
                    </q-scroll-area>
                </div>
                <q-checkbox 
                    v-if="graphic['garnish']!='whippedcream' && graphic['foam'] != true" 
                    v-model="graphic['ice']" label="Ice" />
                <q-checkbox 
                    v-if="graphic['garnish']!='whippedcream' && graphic['ice'] != true" 
                    v-model="graphic['foam']" label="Foam" />

                </q-card-section>
                <div v-if="loadGraphic">
                    <Graphic
                        id="1"
                        :graphic="graphic"
                    />
                </div>
            </q-card-section>
            <q-btn label="Cancel" class="q-ma-xs text-white" color="red" @click="cancel()" />
            <q-btn :disable="!loadGraphic" label="Submit" class="q-ma-xs text-white" color="green" @click="submit(true)"/>
            <q-btn label="Load Graphic" class="q-mx-lg text-white" color="blue" @click="loadGraphic=true"/>
        </q-card>

        <q-footer class="transparent">
            <q-toolbar>
                <q-btn push class="q-ma-sm" color="orange" label="Return Home" @click="returnHome"/>
            </q-toolbar>
        </q-footer>
    </q-page>
</template>

<script>
import QFirebaseUploader from 'components/QFirebaseUploader'
import Graphic from 'components/Graphic'

export default {
    name: "PageAddRecipe",
    components: {
        QFirebaseUploader,
        Graphic
    },
    data () {
        return {

            confirm: false,
            loaded: false,

            name: '',
            type: '',
            description: '',
            url: '',
            ingredients: [
                {
                    "amount": 0,
                    "measurement": '',
                    "name": '',
                    "type": ''
                }
            ],

            measurement: [
                "oz.",
                "slice(s)",
                "piece(s)",
                "squeeze(s)",
                "splash(es)",
            ],

            type_: [
                "MAIN INGREDIENT",
                "ADDITIONAL ALCOHOL",
                "JUICE",
                "POP",
                "SYRUP",
                "ADD IN",
                "GARNISH",
            ],

            data: {
                'glass': [],
                'color': [],
                'garnish': [],
                'fill': [],
                'whippedcream': []
            },
            options: {},

            path: 'artwork/',
            link: '',

            graphic: {},

            glass: '',
            color: '',
            garnish: '',
            fill: '',
            whippedcream: '',
            ice: false,
            foam: false,

            loadGraphic: false,

            glass: '',
            type: '',
            choose: '',
            hex: '#1E1E1E',

        }
    },

    computed: {

    },

    methods: {
        add() {
            console.log(this.color)
            this.ingredients.push({
                "amount": 0,
                "measurement": '',
                "name": '',
                "type": ''
            });
            console.log(this.ingredients)
        },

        submit(done) {
            let data = {
                'name': this.name,
                'description': this.description,
                'url': this.url,
                'color': this.graphic.color,
                'dislikes': 0,
                'likes': 0,
                'graphic': this.graphic
            }

            var check = data;

            if(done) {
                this.confirm = false;
                let ref = this.$database.ref('recipes/' + this.type)
                let newRef = ref.push(data)
                let key = newRef.key;


                ref = this.$database.ref('recipes/' + this.type + '/' + key + '/ingredients')
                for(let item in this.ingredients) {
                    let type = this.ingredients[item].type
                    if(type == "MAIN INGREDIENT") {
                        this.ingredients[item].type = this.type.toUpperCase();
                        
                    }
                    ref.push(this.ingredients[item]);
                }

                

                this.name = ''
                this.type = ''
                this.color = ''
                this.description = ''
                this.url = ''
                this.ingredients = [
                    {
                        "amount": 0,
                        "measurement": '',
                        "name": '',
                        "type": ''
                    }
                ]

                this.path = 'graphics/'
                this.link = ''
            }
            else this.confirm = true;

            check['ingredients'] = this.ingredients;
        },

        listOf(data) {
            let res = []
            for(let item in data) {
                res.push({"label": data[item], "value": data[item]})
            }
            return res
        },

        createPath() {
            this.graphic = this.graphic
        },

        cancel() {
            this.confirm = false;
        },

        returnHome() {
            this.$router.push('/')
        }
    },

    mounted () {

        this.$database.ref('graphics').once("value", data => {
            for(let type in data.val()){
                this.$set(this.graphic, type, '')

                for(let item in data.val()[type]){
                    if(type == 'color') this.data[type].push(data.val()[type][item].hex)
                    else this.data[type].push(data.val()[type][item]);
                }
            } 
            this.$set(this.graphic, 'ice', false)
            this.$set(this.graphic, 'foam', false)

            this.loaded = true
            console.log(this.data)
        })
    }
}
</script>