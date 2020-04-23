<template>
    <q-page class="flex flex-center">
        <div v-if="!requested" class="fit column wrap justify-center items-center content-center">
            <div class="text-h6 text-white"> Enter Pub ID </div>
            <q-input 
                class="q-mt-xs"
                v-model="pub"
                label="Pub ID"
                filled
                mask="XXX-XXXX" 
                bg-color="white"
                :error-message="message"
                :error="error"
                style="width: 300px"
            />
            <div class="row items-center q-mt-sm">
                <q-btn :disable="user==null || loading" class="q-ma-sm" color="green" label="Send Request" @click="check()"/>
                <q-btn class="q-ma-sm" color="red" label="Cancel" @click="home()"/>
            </div>
         </div>

        <div v-if="requested" class="text-center">
            <div class="text-h2 text-white"> A contribution request was sent to </div>
            <div class="text-h2 text-white text-weight-bold"> {{pub}} </div>
            <q-btn class="q-ma-md" color="green" label="Another request?" @click="requested = false"/>
            <q-btn class="q-ma-md" color="orange" label="Return Home" @click="home()"/>
        </div>

        

    </q-page>
</template>

<script>
export default {
    name: "PageCreatePub",
    data () {
        return {
            pub: '',
            submitted: '',
            requested: false,
            id: '',
            user: null,
            loading: false,
            error: false,
            message: '',
        }
    },
    methods: {
        generateId(length) {
            var id = ''
            var characters = 'ABCDEFGHJKMPQRSTVWXYZ23456789';
            var charactersLength = characters.length;
            let prev = ''
            for ( var i = 0; i < length; i++ ) {
                let index = Math.floor(Math.random() * charactersLength)
                if(characters.charAt(index) === prev) {
                    if(index !== characters.length - 1) index += 1
                    else index = 0
                }
                prev = characters.charAt(index)
                id += prev;
            }
            return id
        },

        check() {
            this.loading = true
            let ref = this.$database.ref('/pubs/' + this.pub.replace('-', '') )
            ref.once('value', data => {
                if(!data.exists()) {
                    this.loading = false
                    this.submitted = this.pub
                    this.error = true
                    this.message = 'The id (' + this.submitted + ') does not exist'
                }
                else {
                    if(data.val().disable) {
                        this.loading = false
                        this.submitted = this.pub
                        this.error = true
                        this.message = 'This pub (' + this.submitted + ') is not taking requests'
                    }
                    else{
                        let contributors = {}
                        let pending = {}
                        if(data.val().contributors != null) contributors = data.val().contributors
                        if(data.val().pending != null) pending = data.val().pending
                        if(this.user.uid in contributors ||  this.user.uid in pending) {
                            this.loading = false
                            this.submitted = this.pub
                            this.error = true
                            this.message = 'You have already sent a request to (' + this.submitted + ')'
                        }
                        else {
                            this.error = false
                            this.submit(pending)
                        }
                    }
                }
            })
        },
        submit(pending) {
            
            pending[this.user.uid] = this.user.displayName
            this.$database.ref('pubs/' + this.pub.replace('-', '') + '/pending').set(pending).then(() => {
                this.loading = false
                this.requested = true
            })
        },

        home() {
            this.$router.push('/')
        }
    },
    mounted() {
        this.$auth.onAuthStateChanged(user => {
            this.user = user
        })
        
    }
}
</script>