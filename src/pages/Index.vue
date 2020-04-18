<template>
    <q-page class="flex flex-center">
        <q-header reveal class="bg-orange">
        <q-toolbar>
            <q-avatar> <img src="statics/logo.png"/> </q-avatar>
            <q-toolbar-title class="text-weight-bold"> MyPub </q-toolbar-title>
            <q-btn-dropdown v-if="loggedIn" stretch flat dense label="Account">
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
        <div class="fit column wrap items-center content-center">
            <div v-if="loggedIn" class="q-mb-xl q-mt-md text-white text-h3 text-center">
                Dia duit {{user}}!
            </div>
            <div class="text-white text-h3 text-center"> ENTER PUB ID </div>
            <q-input 
                style="width:310px"
                filled item-alligned
                class="q-ma-sm text-h2"
                bg-color="white"
                mask="XXX-XXXX" 
                fill-mask
                v-model="pub"
            />
            <div v-if="loggedIn">
                <q-btn disable v-if="userPubs.length == 0" class="q-mt-sm" label="Start your own pub?" @click="loadPub"/>
                <div v-for="(value, key) in userPubs" :key="key" class="text-h6 text-white"> {{userPubs[key].name}}</div>
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
            

            recipes: [],
            current: '',
            userPubs: [],
            pub: ''
        }
    },
    methods: {
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
        loadPub() {
            this.$router.push('/createpub')
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
            console.log(user)
            if (user) {
                this.loggedIn = true
                this.user = user.displayName
                let ref = this.$database.ref("users/" + user.uid + "/admin")
                ref.on("value", data => {
                    this.admin = data.val();
                })

                this.$database.ref('users/' + user.uid + '/pubs/owner').once("value", data => {
                    if(data.exists()) {
                        this.userPubs = data.val();
                        console.log(this.userPubs)
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
    }
}
</script>