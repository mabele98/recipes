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
            <q-btn :disable="nameLoading" class="q-mt-lg" color="green" label="Update Display Name" @click="updateName()"/>
            <div class="q-mt-lg text-h6 text-white"> Change password </div>
            <div v-if="!password">
                <div class="text-white text-caption text-italic"> Confirm your email address below </div>
                <q-input 
                    class="q-mt-xs" 
                    v-model="email"
                    label="Email"
                    filled bg-color="white" style="width: 300px"
                    :error="error" error-message="email does not match our records."
                />
                <q-btn class="q-mt-xs" style="width:300px" color="green" label="Reset Password" @click="reset()"/>
            </div>
            <div v-if="password">
                <div class="q-mt-sm text-white text-h7 text-italic"> A reset link has been sent to {{email}} </div>
            </div>
        </div>
    </q-page>
    
</template>

<script>
export default {
    name: 'PageSignIn',
    data () {
        return {
            nameLoading: false,
            first: '',
            last: '',
            id: '',

            password: false,
            email: '',
            error: false
        }
    },
    methods: {
        updateName() {
            this.$q.loading.show()
            this.nameLoading = true
            this.$database.ref('users/' + this.id + '/name').set(this.first + " " + this.last)
            let user = this.$auth.currentUser;
            user.updateProfile({
                displayName: this.first + ' ' + this.last,
            }).then(() => {
                this.nameLoading = false
                this.$q.loading.hide()
            })
        },
        reset() {
            const user = this.$auth.currentUser;
            if(user.email == this.email){
                this.error = false
                this.$q.loading.show()
                this.$auth.sendPasswordResetEmail(this.email).then(() => {
                    this.$q.loading.hide()
                    this.password = true
                }).catch((error) => {
                    this.$q.loading.hide()
                    console.log(error)
                });
            }
            else this.error = true
        },
    },
    mounted () {
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                this.id = user.uid
                const name = user.displayName.split(" ")

                this.first = name[0]
                if(name.length > 1) this.last = name[1]
            }
        })
    }
}
</script>