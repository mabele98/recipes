<template>
    <q-page class="flex flex-center">
        <q-header reveal class="bg-orange">
        <q-toolbar>
            <q-avatar> <img src="statics/logo.png"/> </q-avatar>
            <q-toolbar-title class="text-weight-bold"> MyPub </q-toolbar-title>
            <q-btn-dropdown v-if="loggedIn" stretch flat label="Account">
                <q-list>
                    <q-item clickable v-close-popup @click="signOut()">
                        <q-item-section>
                            <q-item-label>Log Out</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="signOut()">
                        <q-item-section>
                            <q-item-label>Settings</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <q-btn v-else label="Sign In" @click="signIn()"/>
        </q-toolbar>
        </q-header>
        <div class="fit column wrap items-center content-center justify-center">
            <div v-if="loggedIn" class="q-mt-md text-white text-h3 text-center">
                Dia duit {{user}}!
            </div>
            <div class="q-mb-xl">
                <q-btn 
                    size="sm" color="grey-9"
                    v-if="loggedIn && !own" 
                    class="q-mt-sm" 
                    label="Start your own pub?" 
                    @click="createPub"/>
                <q-btn 
                    size="sm" color="grey-9"
                    v-if="loggedIn && own" 
                    class="q-mt-sm" 
                    label="Manage your pubs" 
                    @click="managePubs"/>
            </div>
            <div class="text-white text-h3 text-center"> ENTER PUB ID </div>
            <q-input 
                style="width:310px"
                filled item-alligned
                class="q-ma-sm"
                :class="size.sm ? 'text-h4' : 'text-h2'"
                bg-color="white"
                mask="XXX-XXXX" 
                fill-mask
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
            <div class="fit column wrap justify-center items-start content-center">
                <div class="q-mt-sm text-white text-center caption"> Pubs to choose from... </div>
                <q-btn-toggle
                    class="self-center"
                    v-model="selected"
                    toggle-color="primary"
                    flat dense
                    :options="listOf(available)"
                    @input="update()"
                />
            </div>
           
        </div>

        <div class="q-mb-lg column justify-center">
            <div class="q-mb-lg text-white text-h4 text-center">
                What recipes would you like to look at?
            </div>
            <div class="row justify-center items-start content-start wrap" >
                <div v-for="drink in recipes" :key="drink">
                    <q-btn
                        push
                        class="q-ma-sm text-white"
                        style="width:200px"
                        color="green"
                        :label="drink + ' Drinks'"
                        @click="loadRecipes(drink)"
                    />
                </div>
            </div>
        </div>
        <q-btn
            class="fixed-top-right q-ma-sm"
            text-color="white"
            :label="'Not '+user+'?'"
            @click="logOut()"
        />

        <q-footer v-if="admin" class="transparent">
            <q-toolbar>
                <q-btn push class="q-ma-sm" color="orange" label="Add Graphics" @click="loadGraphics"/>
                <q-btn push class="q-ma-sm" color="orange" label="Add Recipe" @click="loadAdd"/>
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
            users: {},

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
            for(let item in this.users) {
                res.push({'label': this.users[item], 'value': item})
            }
            return res
        },
        loadPub() {
            let pub = this.pub.replace('-', '')
            if(!(pub in this.users)){
                let ref = this.$database.ref('pubs/' + pub)
                ref.once('value', data => {
                    if(data.exists()) {
                        this.$set(this.available, pub, data.val().name)
                        this.current = data.val().name
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
            else {
                this.selected = this.pub.replace('-', '')
                this.current = this.users[this.selected]
                this.$q.sessionStorage.set('pub', {
                    'id': this.pub,
                    'name': this.current,
                    'selected': this.selected
                })
            }
        },
        cancel() {
            this.current = ''
            this.pub = ''

            this.$q.sessionStorage.remove('pub')
        },
        update() {
            this.pub = this.selected.slice(0, 3) + "-" + this.selected.slice(3)
            this.current = this.available[this.selected]
        },
        signIn() {
            this.$router.push('/signin');
        },
        signOut() {
            this.$auth.signOut().then(() => {
                this.loggedIn = false
                this.user = ''
            }).catch(error => {
                console.log(error)
            });
        },
        createPub() {
            this.$router.push('/createpub')
        },
        managePubs() {
            this.$router.push('/managepubs')
        },
        loadRecipes(id){
            this.$router.push('/recipes/' + id)
        },
        loadGraphics(){
            this.$router.push('/graphics')
        },
        loadAdd(){
            this.$router.push('/add')
        }
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
                            this.users[data.val()[key].id] = data.val()[key].name
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

        //this.$q.sessionStorage.remove('available')

        if(this.$q.sessionStorage.has('available')) this.available = this.$q.sessionStorage.getItem('available')

        if(this.$q.sessionStorage.has('pub')) {
            let data = this.$q.sessionStorage.getItem('pub')
            this.pub = data.id
            this.current = data.name
            this.selected = data.selected
        }
    }
}
</script>