<template>
    <q-page class="flex flex-center">
        <div class="fit column wrap items-center content-center justify-center">
            <div class="q-mt-md text-white text-h3 text-center">
                <div v-if="loggedIn"> Dia duit {{user}}! </div>
                <div v-else> Fáilte to PubLuck!</div>
            </div>

            <div class="q-mb-lg">
                <q-btn 
                    size="sm" color="grey-9"
                    v-if="loggedIn && !own" 
                    class="q-mt-sm" 
                    label="Start your own pub?" 
                    @click="$router.push('/createpub')"/>
                <q-btn 
                    size="sm" color="grey-9"
                    v-if="loggedIn && own" 
                    class="q-mt-sm" 
                    label="Manage your pubs" 
                    @click="$router.push('/managepubs')"/>
            </div>
            <q-toggle v-model="view" @input="pubSearch()"
                label="Want to view available drinks at a pub?" 
                class="q-mb-md text-white text-italic" />
            <div v-if="view" class="q-my-sm">
                <div class="text-white text-h3 text-center"> ENTER PUB ID </div>
                <q-input 
                    style="width:310px"
                    filled item-alligned
                    class="q-ma-sm"
                    :class="size.sm ? 'text-h4' : 'text-h2'"
                    bg-color="white"
                    mask="XXX-XXXX" 
                    v-model="pub"
                    @input="loadPub()"
                />
                <div class="fit row wrap justify-center items-start content-center">
                    <div class="q-ma-md text-subtitle1 text-white"> Current Pub: {{current}}</div>
                    <q-btn 
                        v-if="current != ''"
                        dense class="self-center" 
                        size="xs"
                        icon="cancel"
                        @click="cancel()" />
                </div>
                <div class="column justify-center items-start">
                    <div class="q-mt-sm text-white text-center self-center caption"> Available pubs below </div>
                    <q-scroll-area
                        horizontal
                        style="height:40px;width:300px;"
                        class="rounded-borders"
                    >
                        <q-btn-toggle
                            class="text-no-wrap"
                            v-model="selected"
                            toggle-color="primary" flat
                            :options="listOf(available)"
                            @input="update()"
                        />
                    </q-scroll-area>
                </div>
            </div>
        </div>
        <div class="q-mb-lg column justify-center">
            <div class="q-mb-lg text-white text-h4 text-center">
                What recipes would you like to look at?
            </div>
            <div class="row justify-center items-start content-start wrap" >
                <div v-if="view && selected != ''">
                    <q-btn
                        push class="q-ma-sm text-white"
                        style="width:200px" color="green"
                        :label="available[selected] + ' Drinks'"
                        @click="loadRecipes(selected)"
                    />
                </div>
                <div v-for="drink in recipes" :key="drink">
                    <q-btn
                        push class="q-ma-sm text-white"
                        style="width:200px" color="green"
                        :label="drink + ' Drinks'"
                        @click="loadRecipes(drink)"
                    />
                </div>
            </div>
        </div>
        <q-footer v-if="admin" class="transparent">
            <q-toolbar>
                <q-btn push class="q-ma-sm" color="orange" label="Add Graphics" @click="loadGraphics"/>
            </q-toolbar>
        </q-footer>
    </q-page>
</template>

<script>
export default {
    name: 'PageIndex',
    data () {
        return {
            loggedIn: false,
            admin: false,
            user: '',
            size: this.$q.screen,
            
            available: {},

            view: false,
            recipes: [],
            current: '',
            own: false,
            pub: '',
            selected: ''
        }
    },
    methods: {
        listOf(list) {
            let res = []
            for(let item in list) {
                res.push({'label': list[item], 'value': item})
            }
            return res
        },
        loadPub() {
            if(this.pub.length < 8) return
            let pub = this.pub.replace('-', '')
            if(!(pub in this.available)){
                let ref = this.$database.ref('pubs/' + pub + '/name')
                ref.once('value', data => {
                    if(data.exists()) {
                        this.$set(this.available, pub, data.val())
                        this.current = data.val()
                        this.selected = this.pub.replace('-', '')
                        this.$q.sessionStorage.set('pub', {
                            'id': this.pub,
                            'name': this.current,
                            'selected': this.selected
                        })
                        this.$q.sessionStorage.set('available', this.available)
                    }
                })
            }
        },
        cancel() {
            this.current = ''
            this.pub = ''
            this.selected = ''

            this.$q.sessionStorage.remove('pub')
        },
        update() {
            this.pub = this.selected.slice(0, 3) + "-" + this.selected.slice(3)
            if(this.selected in this.available) this.current = this.available[this.selected]
            else this.current = this.available[this.selected]
            this.$q.sessionStorage.set('pub', {
                'id': this.pub,
                'name': this.current,
                'selected': this.selected
            })
        },
        pubSearch() {
            if(!this.view) {
                this.$q.sessionStorage.set('view', false)
                this.cancel()
            }
            else this.$q.sessionStorage.set('view', true)
        },
        loadRecipes(drink){
            this.$router.push({ name: 'recipes', params: { id: drink } }).then(() => {
                this.type = drink
            }).catch((error) => {
                console.log(error)
            })
        },
        loadGraphics(){
            this.$router.push('/graphics')
        },
    },
    mounted() {
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                this.loggedIn = true
                this.user = user.displayName
                let ref = this.$database.ref("users/" + user.uid + "/admin")
                ref.on("value", data => {
                    this.admin = data.val();
                })

                this.$database.ref('users/' + user.uid + '/pubs/owner').once("value", data => {
                    if(data.exists()) {
                        for(let key in data.val()){
                            this.$database.ref('pubs/' + key + '/name').once('value', snap => {
                                this.$set(this.available, key, snap.val())
                            })
                        }
                        this.own = true
                    }
                })
            }
        });

        let ref = this.$database.ref('recipes')
        ref.once("value", data => {
            for(let drink in data.val()) {
                this.recipes.push(drink)
            }
        })

        if(this.$q.sessionStorage.has('available')) {
            let available = this.$q.sessionStorage.getItem('available')
            for(let id in available) {
                this.$set(this.available, id, available[id])
            }
        }

        if(this.$q.sessionStorage.has('pub')) {
            let data = this.$q.sessionStorage.getItem('pub')
            this.pub = data.id
            this.current = data.name
            this.selected = data.selected
        }

        if(this.$q.sessionStorage.has('view')) this.view = this.$q.sessionStorage.getItem('view')
    }
}
</script>