<template>
    <q-page class="flex flex-center">
        <div class="fit column wrap content-center">
            <div class="text-h6 text-white"> Enter email </div>
            <q-input 
                class="q-mt-xs"
                v-model="email"
                label="email"
                filled
                bg-color="white"
            />
            <div class="q-mt-lg text-h6 text-white"> Enter password </div>
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
            <q-btn :disable="this.email==''" class="q-mx-sm text-caption" dense color="transparent" label="Forgot password?" @click="reset()"/>
            <q-btn v-if="!forgot" class="q-mt-lg" color="green" label="Submit" @click="signin()"/>
            <div v-if="forgot" class="text-h6 text-white text-center"> A reset link was sent to {{this.email}} </div>
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

            forgot: false,

            error: false
        }
    },
    methods: {
        signin() {
            this.$auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
                this.index()
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                this.error = true
            });
        },
        reset() {
            this.$auth.sendPasswordResetEmail(this.email).then(() => {
                this.forgot = true
            }).catch((error) => {
                console.log(error)
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