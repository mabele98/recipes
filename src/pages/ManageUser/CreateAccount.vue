<template>
    <q-page class="flex flex-center">
        <div class="q-mx-sm q-my-lg fit column wrap content-center">
            <div class="text-h4 text-white text-center">
                Fill out the below information
            </div>
            <q-input 
                class="q-mt-md"
                v-model="email"
                label="email"
                disable
                filled
                bg-color="white"
            />
            <q-input 
                class="q-mt-md"
                v-model="password" 
                filled :type="isPwd ? 'password' : 'text'"
                label="Password"
                error-message="MUST contain at least 8 characters, a letter and a number"
                :error="isValid()"
                :color="strength"
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
            <q-input 
                class="q-mt-md"
                v-model="verify" 
                filled :type="isVer ? 'password' : 'text'"
                label="Verify Password"
                error-message="Does not match password"
                :error="isVerified()"
                bg-color="white"
                >
                <template v-slot:append>
                <q-icon
                    :name="isVer ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isVer = !isVer"
                />
                </template>
            </q-input>
            <div class="q-mt-lg text-h6 text-white"> Display Name: </div>
            <q-input 
                class="q-mt-sm"
                v-model="first"
                label="First Name"
                filled
                bg-color="white"
            />
            <q-input 
                class="q-mt-md"
                v-model="last"
                label="Last Name"
                filled
                bg-color="white"
            />
            <q-btn :disable="disableSubmit()" class="q-mt-lg" label="submit" color="green" @click="submit()"/>
            <div v-if="disable" class="text-h6 text-center text-red"> To create account, please use link from email. </div>
        </div>
    </q-page>
</template>

<script>

import Graphic from 'components/Graphic.vue'

export default {
    name: "PageTesting",
    components: {Graphic},

    data () {
        return {
            disable: true,
            email: '',

            isPwd: true,
            password: '',
            isVer: true,
            verify: '',
            strength: 'black',

            first: '',
            last: '',

            error: false,
            message: ''
        }
    },

    methods: {
        submit() {
            var user = this.$auth.currentUser;
            user.updatePassword(this.password).then(() => {
            // Update successful.
                console.log('password success')
                this.$auth.signInWithEmailAndPassword(this.email, this.password).then(() =>{
                    var user_ = this.$auth.currentUser;
                    user_.updateProfile({
                        displayName: this.first + ' ' + this.last,
                        emailVerified: true
                    }).then(() => {
                        this.$router.push('/')
                    })
                })
            }).catch(function(error) {
                console.log('error')
            // An error happened.
            });
        },

        disableSubmit() {
            if(this.password == '' || this.verify == '' || this.bday == '') return true

            return !(!this.disable && !this.isValid() && !this.isVerified())
        },

        isValid() {
            if(this.password != ''){
                var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");

                if(strongRegex.test(this.password)) {
                    this.strength = 'green'
                    return false
                }
                else if(mediumRegex.test(this.password)) {
                    this.strength = 'orange'
                    return false
                }
                else{
                    this.strength = 'red'
                    return true  
                } 
            }
            this.strenght = 'black'
            return false
        },


        isVerified() {
            if(this.verify != ''){
                return this.password != this.verify
            }
            return false
        },
    },

    mounted() {
        if (this.$auth.isSignInWithEmailLink(window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            this.disable = false
            this.email = this.$q.localStorage.getItem('emailForSignIn');
            console.log(this.email)
            if (!this.email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                this.email = window.prompt('Please provide your email for confirmation');
            }
            this.$auth.signInWithEmailLink(this.email, window.location.href)
            .then(function(result) {
                // Clear email from storage.
                this.$q.localStorage.remove('emailForSignIn');
                console.log(result.user)
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
            })
            .catch(function(error) {
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
            });
        }
        
        
    }
}
</script>