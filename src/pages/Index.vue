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
            <q-btn
                push
                class="q-ma-lg text-white"
                color="green"
                label="Cîroc Drinks"
                @click="loadRecipes()"
            />
        </div>
        <q-btn
            class="fixed-top-right q-ma-sm"
            text-color="white"
            :label="'Not '+user+'?'"
            @click="logOut()"
        />
    </q-page>
</template>

<script>
export default {
    name: 'PageIndex',
    data () {
        return {
            user: '',
        }
    },
    methods: {
        logOut(signOut) {
            if(signOut) {
                this.$auth.signOut()
            }
            this.$router.push('/auth');
        },
        loadRecipes(){
            this.$router.push('/CirocRecipes')
        }
    },
    mounted() {
        this.$auth.onAuthStateChanged(user => {
            if (user == null) this.logOut
            this.user = user.displayName
        });
    }
}
</script>