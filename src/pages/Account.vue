<template>
    <q-page class="flex flex-center">
        <div v-if="!send" class="fit column wrap content-center">
            <div class="text-h5 text-white text-center"> Enter your email below! </div>
            <q-input 
                class="q-mt-md"
                v-model="email"
                label="email"
                filled
                bg-color="white"
                style="width: 300px"
            />
            <q-btn color="green" label="Submit" @click="signup()"/>
        </div>
        <div v-if="send" class="text-h5 text-white text-center">
            A verification link was sent to your email.
        </div>
    </q-page>
</template>

<script>
export default {
    name: "PageAccount",
    data() {
        return {
            email: '',
            send: false
        }
    },
    methods: {
        signup() {
            this.send = true
            var actionCodeSettings = {
                url: window.location.href + '/test',
                handleCodeInApp: true,
                // When multiple custom dynamic link domains are defined, specify which
                // one to use.
            };
            this.$auth.sendSignInLinkToEmail(this.email, actionCodeSettings)
            .then(() => {
                this.$q.localStorage.set('emailForSignIn', this.email);
            })
            .catch(function(error) {
                console.log(error)
            }); 
        }
    },
    mounted() {
        console.log(window.location.href)
    }
}
</script>