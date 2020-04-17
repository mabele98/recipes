<template>
    <q-page class="flex flex-center">
        <div class="fit column wrap content-center">
            <div class="text-h6 text-white"> Change display name </div>
            <q-input 
                class="q-mt-xs"
                v-model="first"
                label="First Name"
                filled
                bg-color="white"
                style="width: 300px"
            />
            <q-input 
                class="q-mt-xs"
                v-model="last"
                label="Last Name"
                filled
                bg-color="white"
                style="width: 300px"
            />
            <q-btn class="q-mt-lg" color="green" label="Update Display Name" @click="signin()"/>
            <div class="q-mt-lg text-h6 text-white"> Change password? </div>
            <q-input 
                class="q-mt-xs"
                v-model="password" 
                filled :type="isPwd ? 'password' : 'text'"
                label="password"
                bg-color="white"
                >
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            <q-btn class="q-mt-lg" color="green" label="Submit" @click="signin()"/>
            <div class="row items-center q-mt-lg">
                <q-btn class="q-mx-sm" color="transparent" label="Cancel" @click="index()"/>
                <q-btn class="q-mx-sm" color="transparent" label="Create Account" @click="create()"/>
            </div>
            
            <div v-if="error" class="text-h7 text-red"> There was an error logging in. </div>
        </div>
    </q-page>
    
</template>

<script>
export default {
    name: 'PageSignIn',
    data () {
        return {
            email: '',
            password: '',
            isPwd: true,

            error: false
        }
    },
    methods: {
        signin() {
            this.$auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
                this.index()
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                this.error = true
            });
        },
        index() {
            this.$router.replace('/')
        },
        create() {
            this.$router.replace('/create')
        },
    },
}
</script>