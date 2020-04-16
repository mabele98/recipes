<template>
    <q-page class="flex flex-center">
        <div v-if="user!=''" class="fit column wrap justify-center content-center">
            <div class="fit row inline justify-center content-center">
                <div class="text-white text-h3 text-center">
                    Hi {{user}}!
                </div>
            </div>
            <div class="q-ma-lg row text-white text-h4 justify-center content-center text-center">
                What recipes would you like to look at?
            </div>
            <div class="row justify-center content-center" v-for="drink in recipes" :key="drink">
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
        <q-btn
            class="fixed-top-right q-ma-sm"
            text-color="white"
            :label="'Not '+user+'?'"
            @click="logOut()"
        />

        <q-footer class="transparent">
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
            user: '',
            recipes: [],
        }
    },
    methods: {
        logOut(signOut) {
            if(signOut) {
                this.$auth.signOut()
            }
            this.$router.push('/auth');
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
            if (user) this.user = user.displayName
            else this.logOut(true)
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