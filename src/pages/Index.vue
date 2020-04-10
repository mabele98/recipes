<template>
    <q-page class="flex flex-center">
        <div class="fit column wrap justify-center content-center">
            <div class="fit row inline justify-center content-center">
                <div class="text-white text-h3 text-center">
                    Hi {{user[0]}} {{user[1]}}!
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
    </q-page>
</template>

<script>
export default {
    name: 'PageIndex',
    data () {
        return {
            user: [],
        }
    },
    methods: {
        capitalize(name) {
            return name.charAt(0).toUpperCase() + name.slice(1)
        },
        loadRecipes(){
            this.$router.push('/CirocRecipes')
        }
    },
    mounted() {
        let currentUser = this.$auth.currentUser
        console.log(currentUser)
        if(this.$auth.currentUser == null) this.$router.push('/auth');
        else{
            this.user = currentUser.email.slice(0, -8)
            this.user = this.user.split('_')
            
            for(let i in this.user) this.user[i] = this.capitalize(this.user[i]);
        }
        

    }
}
</script>