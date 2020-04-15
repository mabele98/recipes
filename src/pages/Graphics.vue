<template>
    <q-page class="flex flex-center">
        <q-card style="width: 500px">
            <q-card-section vertical v-if="!check && !submit">
                <div class="text-h4"> Upload a Graphic! </div>
                <q-btn-dropdown class="q-mt-lg q-mb-xs text-black" color="white" :label="glass_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="item in glass" 
                        :key="item"
                        @click="glass_ = item"
                        >
                        <q-item-section>
                            <q-item-label>{{item}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown> <br>

                <q-btn-dropdown class="q-my-xs text-black" :style="'background-color:#' + color_" :label="color_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="item in color" 
                        :key="item"
                        @click="color_ = item"
                        >
                        <q-item-section :style="'background-color:#'+item">
                            <q-item-label :style="'background-color:white'">{{item}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown><br>

                <q-btn-dropdown class="q-my-xs text-black" color="white" :label="fill_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="item in fill" 
                        :key="item"
                        @click="fill_ = item"
                        >
                        <q-item-section>
                            <q-item-label>{{item}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown><br>

                <q-btn-dropdown class="q-my-xs text-black" color="white" :label="garnish_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="item in garnish" 
                        :key="item"
                        @click="garnish_ = item"
                        >
                        <q-item-section>
                            <q-item-label>{{item}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown><br>

                <q-btn-dropdown class="q-my-xs text-black" v-if="garnish_=='whippedcream'" color="yellow" :label="whippedCream_">
                    <q-list>
                        <q-item 
                        clickable v-close-popup 
                        v-for="item in whippedCream" 
                        :key="item"
                        @click="whippedCream_ = item"
                        >
                        <q-item-section>
                            <q-item-label>{{item}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown><br>

                <q-checkbox v-if="garnish_ != 'whippedcream' && foam_ == false" v-model="ice_" label="Ice"/>
                <q-checkbox v-if="garnish_ != 'whippedcream' && ice_ == false" v-model="foam_" label="Foam"/><br>

                <q-btn class="q-my-sm" color="green" label="Check" @click="check = true"/>
            </q-card-section>
            <q-card-section v-if="check && !submit">
                <div class="text-h4 q-mb-lg"> Check the correct choices: </div>
                <div class="text-subtitle1"> Glass: {{glass_}} </div>
                <div class="text-subtitle1" :style="'background-color:#' + color_"> Color: {{color_}} </div>
                <div class="text-subtitle1"> Fill In: {{fill_}} </div>
                <div class="text-subtitle1"> Garnish: {{garnish_}} </div>
                <div class="text-subtitle1" v-if="garnish_ == 'whippedcream'"> Whipped Cream: {{whippedCream_}} </div>
                <div class="text-subtitle1" v-if="garnish_ != 'whippedcream'"> Ice: {{ice_}} </div>
                <div class="text-subtitle1" v-if="garnish_ != 'whippedcream'"> Foam: {{foam_}} </div>

                <q-btn class='q-ma-md' color="red" label="Cancel" @click="check = false"/>
                <q-btn class='q-ma-md' color="green" label="Add Photo" @click="createPath()"/>


            </q-card-section>
            <q-card-section v-if="!check && submit">
                <QFirebaseUploader :path="path" auto-upload/>
                <q-btn color="green" label="Next graphic!" @click="restart()"/>
            </q-card-section>
        </q-card>


    </q-page>
</template>

<script>

import QFirebaseUploader from 'components/QFirebaseUploader'

export default {
    name: "PageGraphics",
    components: {
        QFirebaseUploader
    },

    data () {
        return {
            path: 'graphics/',

            check: false,
            submit: false,

            glass_: 'Glass Style',
            color_: 'Color',
            garnish_: 'Garnish',
            top_: 'Top Fill',
            fill_: 'Fill In',
            whippedCream_: 'Whipped Cream',
            ice_: false,
            foam_: false,

            glass: [
                "champagne",
                "margarita",
                "martini",
                "shot",
                "short",
                "tall",
                "wine"
            ],
            color: [
                'FFA6C9',
                'F7468A',
                'C40850',
                'FE6F5E',
                'E81717',
                '9E1030',
                'E58E73',
                'B33B24',
                '77212E',
                'D2A679',
                'AC7339',
                '734D26',
                'FEAF4D',
                'F28600',
                'CB6601',
                'FFE999',
                'FFCD1A',
                'E6B400',
                '1E1E1E',
                'FCEBD2'
            ],
            garnish: [
                'apple',
                'cherry',
                'grapes',
                'watermellon',
                'lemon',
                'lime',
                'leaves',
                'pineapple',
                'orange',
                'strawberry',
                'whippedcream',
                'none'
            ],
            whippedCream: [
                'chocolate',
                'cherry',
                'sprinkes',
                'plain',
            ],
            fill: [
                'blackberries',
                'blueberries',
                'leaves',
                'mixedBerries',
                'raspberries',
                'none'
            ]
        }
    },

    methods: {
        createPath() {
            this.check = false
            this.submit = true

            this.path += this.glass_ + '/' + this.color_ + '/' + this.fill_ + '/' + this.garnish_ + '/';
            if(this.garnish_ == 'whippedcream'){
                this.path += this.whippedCream_ + '/'
            }
            else if(this.ice_){
                this.path += 'ice/'
            }
            else if(this.foam_){
                this.path += 'foam/'
            }

            console.log(this.path);
        },

        restart() {
            this.submit = false

            this.path = 'graphics/'
        },

        test() {
            let imageRef = this.$storage.ref().child('graphics/shot/F7468A/none/none/graphic.png');

          imageRef.getDownloadURL().then(url => {
            this.link = url;
          })
        }

    }
}
</script>