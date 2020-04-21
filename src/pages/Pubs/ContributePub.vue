<template>
    <q-page class="flex flex-center">
        <div v-if="!created" class="fit column wrap justify-center items-center content-center">
            <div class="text-h6 text-white"> Enter Pub ID </div>
            <q-input 
                class="q-mt-xs"
                v-model="pub"
                label="Pub ID"
                filled
                bg-color="white"
                style="width: 300px"
            />
            <div class="row items-center q-mt-lg">
                <q-btn :disable="user==null" class="q-ma-sm" color="green" label="Send Request" @click="submit()"/>
                <q-btn class="q-ma-sm" color="red" label="Cancel" @click="home()"/>
            </div>
         </div>

        <div v-if="created">
            <div class="text-h2 text-white"> Congrats! </div>
            <div class="text-h4 text-white"> {{pub}} was created! </div>
            <div class="text-h4 text-white"> The id is: {{id}} </div>
            <q-btn class="q-ma-sm" color="orange" label="Return Home" @click="home()"/>
        </div>

        

    </q-page>
</template>

<script>
export default {
    name: "PageCreatePub",
    data () {
        return {
            pub: '',
            created: false,
            id: '',
            user: null,
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

        submit() {
            console.log(this.user.displayName)

            var data = {
                'name': this.user.displayName,
                'pub': this.pub,
            }
            let ref = this.$database.ref('/pubs/' + this.pub + '/pending')
            ref.on('value', data => {
                console.log(data.val())
            })

            
            console.log(data)
            var contribute = this.$functions.httpsCallable('contributePub');
            contribute(data).then((result) => {
                console.log(result)
            }).catch((error) => {
                console.log('error', error)
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