<template>
    <q-page class="flex flex-center">
        <q-card v-if="loaded" style="width:750px; height: 85vh">
            <q-card-section vertical v-if="!check && !submit">
                <div class="text-h4"> Upload a Graphic! </div>
                <div class="q-mt-lg text-h6"> Choose a glass </div>
                <q-btn-toggle
                    class="q-mb-lg"
                    v-model="glass" 
                    push
                    toggle-color="blue"
                    :options="listOf('glass')"
                />

                <div class="q-mt-lg text-h6"> What is it? </div>
                <q-btn-toggle
                    v-model="type" 
                    push
                    toggle-color="red"
                    :options="options"
                /><br>

                <div v-if="type!='' && type!='ice' && type!='foam'" class="q-mt-lg">
                    <q-scroll-area
                        horizontal
                        style="height:40px;width:700px;"
                        class="rounded-borders"
                    >
     
                        <div v-if="type!='glass'">
                            <q-btn-toggle
                                v-model="choose" 
                                push
                                color="grey"
                                class="text-no-wrap"
                                toggle-color="purple"
                                :options="listOf(type)"
                            />
                        </div>
                    </q-scroll-area>
                    <br>
                    <div v-if="type=='color'" :style="'background-color:' + choose"  class="text-h5">
                        CHOOSEN COLOR: {{choose}}
                    </div> 
                </div>
            </q-card-section>
            <q-btn 
                v-if="!check && !submit"
                style="position:absolute;bottom:10px;right:10px" 
                color="green" label="check" @click="check = true"/>
            <q-card-section v-if="check && !submit">
                <div class="text-h4 q-mb-lg"> Check the correct choices: </div>
                <div class="text-h6"> Glass: {{glass}} </div>

                <div class="text-h6"> Type of image uploading: {{type}} </div>

                <div v-if="type!='glass' && type!='ice' && type !='foam'">
                    <div v-if="choose!=''" class="text-h6"> 
                        <div v-if="type=='color'"
                            :style="'background-color:' + choose"
                        >   Item: {{choose}} </div>
                        <div v-else> Item: {{choose}} </div>
                    </div>
                </div>
            </q-card-section>
            <q-btn 
                v-if="check && !submit"
                style="position:absolute;bottom:10px;left:10px" 
                class='q-ma-md' 
                color="red" label="Cancel" 
                @click="check = false"/>
            <q-btn 
                v-if="check && !submit"
                style="position:absolute;bottom:10px;right:10px" 
                class='q-ma-md' 
                color="green" label="Add Photo" 
                @click="createPath()"/>
            <q-card-section v-if="!check && submit">
                <QFirebaseUploader 
                    class="q-ma-lg" 
                    :path="path" 
                    auto-upload
                />
            </q-card-section>
            <q-btn 
                v-if="!check && submit"
                style="position:absolute;bottom:10px;left:10px" 
                class='q-ma-md' 
                color="red" label="Cancel" 
                @click="submit = false"/>
            <q-btn 
                v-if="!check && submit"
                style="position:absolute;bottom:10px;right:10px" 
                class='q-ma-md' 
                color="green" label="Next Graphic" 
                @click="submit = false"/>
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

export default {
    name: "PageGraphics",
    components: {
        QFirebaseUploader
    },

    data () {
        return {
            path: 'artwork/',
            loaded: false,

            data: {},
            type: '',
            options: [],

            choose: '',

            color: 'white',
            colors_: [],
            glass: '',


            check: false,
            submit: false,
        }
    },

    methods: {
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
        createPath() {
            this.check = false
            this.submit = true

            this.path = 'artwork/'

            this.path += this.glass + '/' + this.type + '/'

            if(this.type != 'glass' && this.type != 'ice' && this.type != 'foam') {
                if(this.type == 'color') this.path += this.choose.slice(1) + '/'
                else this.path += this.choose + '/'
            }

            console.log(this.path);
        },

        returnHome() {
            this.$router.push('/')
        },

        test() {
            console.log(this.data)
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
            this.data['ice'] = []

            this.options.push({'label': 'foam', 'value': 'foam'})
            this.data['foam'] = []

            this.loaded = true
        })
    }
}
</script>