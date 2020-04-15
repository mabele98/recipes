<template>
    <q-page class="flex flex-center">

        <q-card v-if="!confirm" style="width: 500px">
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

        </q-card>

        <q-card v-if="confirm" style="min-width:300px">
            <div class="text-h4 q-ma-sm"> Upload an image below </div>
            <QFirebaseUploader
                :path="type + '/'"
                auto-upload
                />

            <div class="text-h4"> Or create a graphic </div>

            <q-card-section horizontal>
                <q-card-section vertical>
                <q-btn-dropdown class="q-mt-lg q-mb-xs text-black" color="white" :label="glass_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="(value, key) in glass" 
                        :key="key"
                        @click="glass_ = value">
                        <q-item-section><q-item-label>{{value}}</q-item-label>
                        </q-item-section></q-item>
                    </q-list></q-btn-dropdown> <br>
                <q-btn-dropdown class="q-mt-lg q-mb-xs text-black" :style="'background-color:' + color_" :label="color_">
                    <q-list><q-item 
                        clickable v-close-popup 
                        v-for="(value, key) in color" 
                        :key="key"
                        @click="color_ = value.hex"
                        >
                        <q-item-section :style="'background-color:'+value.hex">
                            <q-item-label :style="'background-color:white'">{{value.name}}</q-item-label>
                        </q-item-section>
                        </q-item></q-list>
                </q-btn-dropdown><br>
                <q-btn-dropdown class="q-mt-lg q-mb-xs text-black" color="white" :label="fill_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="(value, key) in fill" 
                        :key="key"
                        @click="fill_ = value">
                        <q-item-section><q-item-label>{{value}}</q-item-label>
                        </q-item-section></q-item>
                    </q-list></q-btn-dropdown> <br>
                <q-btn-dropdown class="q-mt-lg q-mb-xs text-black" color="white" :label="garnish_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="(value, key) in garnish" 
                        :key="key"
                        @click="garnish_ = value">
                        <q-item-section><q-item-label>{{value}}</q-item-label>
                        </q-item-section></q-item>
                    </q-list></q-btn-dropdown> <br>
                <q-btn-dropdown class="q-mt-lg q-mb-xs text-black" v-if="garnish_=='whippedcream'" color="white" :label="whippedCream_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="(value, key) in whippedcream" 
                        :key="key"
                        @click="whippedCream_ = value">
                        <q-item-section><q-item-label>{{value}}</q-item-label>
                        </q-item-section></q-item>
                    </q-list></q-btn-dropdown> <br>
                <q-checkbox v-if="garnish_ != 'whippedcream' && foam_ == false" v-model="ice_" label="Ice"/>
                <q-checkbox v-if="garnish_ != 'whippedcream' && ice_ == false" v-model="foam_" label="Foam"/><br>
                </q-card-section>
                <img
                    v-if="loadGraphic"
                    style="height:30vw;width:auto"
                    :src="link"
                />
            </q-card-section>
            <q-btn label="Cancel" class="q-ma-xs text-white" color="red" @click="cancel()" />
            <q-btn :disable="!loadGraphic" label="Submit" class="q-ma-xs text-white" color="green" @click="submit(true)"/>
            <q-btn label="Load Graphic" class="q-mx-lg text-white" color="blue" @click="createPath"/>
        </q-card>

    </q-page>
</template>

<script>
import QFirebaseUploader from 'components/QFirebaseUploader'

export default {
    name: "PageAddRecipe",
    components: {
        QFirebaseUploader
    },
    data () {
        return {

            confirm: false,

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

            path: 'graphics/',
            link: '',

            loadGraphic: false,
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

            

            glass_: 'Glass Style',
            color_: 'Color',
            garnish_: 'Garnish',
            top_: 'Top Fill',
            fill_: 'Fill In',
            whippedCream_: 'Topping',
            ice_: false,
            foam_: false,

            glass: null,
            color: null,
            garnish: null,
            whippedcream: null,
            fill: null,

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
                'color': '#' + this.color_,
                'dislikes': 0,
                'likes': 0,
                'image': this.path
            }

            var check = data;

            if(done) {
                this.confirm = false;
                let ref = this.$database.ref('recipes/' + this.type)
                let newRef = ref.push(data)
                let key = newRef.key;


                ref = this.$database.ref('recipes/' + this.type + '/' + key + '/ingredients')
                for(let item in this.ingredients) {
                    if(this.ingredients[item].type == "MAIN INGREDIENT") {
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

            console.log(check)
        },

        createPath() {
            this.path = 'graphics/'
            let hex = this.color_.slice(1)
            this.path += this.glass_ + '/' + hex + '/' + this.fill_ + '/' + this.garnish_ + '/';
            if(this.garnish_ == 'whippedcream'){
                this.path += this.whippedCream_ + '/'
            }
            else if(this.ice_){
                this.path += 'ice/'
            }
            else if(this.foam_){
                this.path += 'foam/'
            }
            this.path += 'graphic.png'

            let imageRef = this.$storage.ref().child(this.path);
            imageRef.getDownloadURL().then(url => {
                this.link = url;
                this.loadGraphic = true;
            })
        },

        cancel() {
            this.confirm = false;
        }
    },

    mounted () {

        this.$database.ref('graphics/glass').once("value", data => {
            this.glass = data.val();
        })
        
        this.$database.ref('graphics/color').once("value", data => {
            this.color = data.val();
        })

        this.$database.ref('graphics/garnish').once("value", data => {
            this.garnish = data.val();
        })

        this.$database.ref('graphics/fill').once("value", data => {
            this.fill = data.val();
        })

        this.$database.ref('graphics/whippedcream').once("value", data => {
            this.whippedcream = data.val();
        })
    }
}
</script>