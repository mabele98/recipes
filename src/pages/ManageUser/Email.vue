<template>
    <q-page class="flex flex-center">
        <div v-if="!send" class="fit column wrap content-center">
            <div class="text-h5 text-white"> Enter email </div>
            <q-input 
                class="q-mt-md"
                v-model="email"
                label="email"
                filled
                bg-color="white"
                style="width: 300px"
            />
            <div class="q-mt-lg text-h6 text-white"> Enter birthday </div>
            <q-input 
                class="q-my-sm"
                v-model="bday" 
                filled bg-color="white" 
                type="date" 
                error-message="You must be over 21"
                :error="bdayValid()"
            />
            <q-btn class="q-mt-lg" :disable="bdayValid()" color="green" label="Submit" @click="signup()"/>
        </div>
        <div v-if="send" class="text-h5 text-white text-center">
            A verification link was sent to {{email}}
        </div>
    </q-page>
</template>

<script>
export default {
    name: "PageAccount",
    data() {
        return {
            email: '',
            bday: '',
            send: false
        }
    },
    methods: {
        bdayValid() {
            let timestamp = new Date()
            let bday = new Date(this.bday)

            if(timestamp.getYear() - bday.getYear() > 21) return false
            else if(timestamp.getYear() - bday.getYear() === 21) {
                if(timestamp.getMonth() - bday.getMonth() > 0) return false
                else if(timestamp.getMonth() - bday.getMonth() === 0) {
                    if(timestamp.getDay() - bday.getDay() >= 0) return false
                    return true
                }
                return true
            }
            return true
        },
        signup() {
            this.send = true
            var actionCodeSettings = {
                url: window.location.href + '/update',
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