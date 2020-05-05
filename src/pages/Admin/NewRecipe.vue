<template>
    <q-page class="flex flex-center">
        <q-card style="width:95vw">
            <div v-if="step == 1">
                <q-card-section class="text-h4 text-bold">
                    Add the Recipe Info
                </q-card-section>
                <q-scroll-area class="q-mb-lg" style="height:78vh">
                    <q-card-section>
                        <q-input 
                            class="q-mb-lg"
                            square outlined v-model="recipe.name" 
                            :rules="[ val => val.length <= 30 || 'Please use maximum 30 characters']"
                            label="Recipe Name" />
                        <q-input 
                            class="q-mb-lg"
                            square outlined v-model="recipe.description"
                            :rules="[ val => val.length <= 100 || 'Please use maximum 100 characters']" 
                            label="Recipe Description" />
                        <q-input 
                            class="q-mb-lg"
                            square outlined v-model="recipe.url" 
                            hint="If your recipe links to another site, add url here!"
                            label="Recipe URL" />
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

                <q-card-actions>
                    <q-btn 
                        style="margin:auto;width:50%"
                        unelevated class="q-mx-xs" color="red" 
                        @click="step = 1"
                        label="Cancel" />
                    <q-btn 
                        style="margin:auto;width:50%"
                        unelevated class="q-mx-xs" color="green" 
                        @click="step = 1"
                        label="Submit" />
                </q-card-actions>
            </div>
        </q-card>
    </q-page>
</template>

<script>
import QFirebaseUploader from 'components/QFirebaseUploader'
import Graphic from 'components/Graphic'

export default {
    name: "PageNewRecipe",
    components: {
        QFirebaseUploader,
        Graphic
    },
    data () {
        return {
            step: 2,
            recipe: {
                'name': '',
                'description': '',
                'url': ''
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
        }
    },
    mounted () {
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