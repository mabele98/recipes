<template>
    <q-page class="flex flex-center">
        <div class="fit column wrap content-center q-pa-md">
            <div v-if="!error">
            <div class="q-gutter-md" style="max-width: 300px">
                <div class="text-h4 text-white text-center"> Please fill out the information </div>
                <q-input 
                    v-for="(value,key) in data"
                    :key="key"
                    filled
                    label-color="green"
                    bg-color="white"
                    v-model="data[key]" 
                    :label="key" />
            </div>
            <q-btn 
                push 
                :disable="data['First Name']=='' || data['Last Name'] == ''"
                color="white" 
                class="q-mt-lg text-black" 
                label="Submit"
                @click="authenticate()"/>
            </div>
            <div v-if="error">
                <q-card class="q-pa-lg bg-color-white" elevated>
                    <div class="text-orange text-h4 text-width-bold text-center"> {{data['First Name']}} {{data['Last Name']}}</div>
                    <div class="q-ma-lg text-h5 text-center"> The above name caused an error. </div>
                    <q-btn push color="orange" class="q-mt-xl text-white" label="Try again." @click="error=false"/>
                </q-card>
            </div>
        </div>

    </q-page>
</template>

<script>
export default {
    name: 'PageIndex',
    data () {
        return {
            error: false,
            data: {
                'First Name': '',
                'Last Name': '',
            },
        }
    },
    methods: {
        authenticate() {
            let email = this.data['First Name'] + '_' + this.data['Last Name'] + '@pub.com'
            this.$auth.createUserWithEmailAndPassword(email, 'maye-okeefe')
            .then( () => {
                let user = this.$auth.currentUser;
                let name = this.data['First Name'] + ' ' + this.data['Last Name'];
                this.$database.ref('Users/' + user.uid).set({
                    'admin': false,
                    'name': name
                })
                user.updateProfile({
                    displayName: name,
                }).then(() => {
                    this.$router.push('/')
                }).catch(error => {
                    console.log(error.code)
                    console.log(error.message)
                    this.error = true;
                });
            })
            .catch(error => {
                console.log(error.code)
                console.log(error.message)
                if(error.code = "auth/email-already-in-use"){
                    this.$auth.signInWithEmailAndPassword(email, 'maye-okeefe')
                    .then(() => {
                        this.$router.push('/')
                    })
                }
                else this.error = true;
            })
        }
    },
    mounted() {
       
    }
}
</script>