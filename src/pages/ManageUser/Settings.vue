<template>
    <q-page class="flex flex-center">
        <div class="fit column wrap content-center">
            <div class="text-h6 text-white text-center"> Change display name </div>
            <q-input 
                class="q-mt-xs q-mx-sm"
                v-model="first" style="width:300px"
                label="First Name"
                filled bg-color="white" 
                :error="errorFirst()" error-message="Spaces are not allowed."
            />
            <q-input 
                class="q-mt-sm q-mx-sm"
                v-model="last" style="width:300px"
                label="Last Name"
                filled bg-color="white"
                :error="errorLast()" error-message="Spaces are not allowed."
            />
            <q-btn :disable="nameLoading || errorFirst() || errorLast()" class="q-mt-sm" color="green" label="Update Display Name" @click="updateName()"/>
            <div class="q-mt-xl text-h6 text-white text-center"> Change password </div>
            <div v-if="!password">
                <div class="text-white text-caption text-italic text-center"> Confirm your email address below </div>
                    <q-input 
                        class="q-mt-xs q-mx-sm" 
                        v-model="email" style="width:300px"
                        label="Email"
                        filled bg-color="white"
                        :error="error" error-message="email does not match our records."
                    />
                <q-btn class="q-mt-xs self-stretch" color="green" size="md" label="Reset Password" @click="reset()"/>
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
        errorFirst(){
            return /\s/.test(this.first)
        },
        errorLast() {
            return /\s/.test(this.last)
        }
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