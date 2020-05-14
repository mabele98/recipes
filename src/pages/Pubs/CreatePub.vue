<template>
    <q-page class="flex flex-center">
        <div v-if="!max">
            <div v-if="!created" class="fit column wrap justify-center items-center content-center">
                <div class="text-h6 text-white"> Enter name of Pub </div>
                <q-input 
                    class="q-mt-xs"
                    v-model="pub"
                    label="Pub Name"
                    filled
                    bg-color="white"
                    style="width: 300px"
                />
                <div class="row items-center q-mt-lg">
                    <q-btn class="q-ma-sm" color="green" label="Create Pub" @click="submit()"/>
                    <q-btn class="q-ma-sm" color="red" label="Cancel" @click="home()"/>
                </div>
            </div>

            <div v-if="created" class="text-center">
                <div class="text-h2 text-white"> Congrats! </div>
                <div class="text-h4 text-white"> 
                    <div class="text-weight-bold">{{pub}} </div> 
                    was created! 
                </div>
                <div class="text-h4 text-white"> The id is: {{id}} </div>
                <q-btn class="q-ma-sm" color="green" label="Manage pubs?" @click="$router.push('/managepubs')"/>
                <q-btn class="q-ma-sm" color="orange" label="Return Home" @click="home()"/>
            </div>
        </div>
        <div v-if="max" class="text-center text-white">
            <div class="q-ma-sm text-h3"> You have reached the maximum limit of owning three pubs. </div>
            <div class="q-ma-lg text-h5"> Please delete or edit one of your existing pubs. </div>
            <q-btn class="q-ma-sm" color="green" label="Manage pubs" @click="$router.push('/managepubs')"/>
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
            max: false
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
            this.$q.loading.show()

            var idExists = true
            var id = this.generateId(7)

            var data = {
                'name': this.pub,
                'id': id
            }
            var create = this.$functions.httpsCallable('createPub');
            create(data).then((result) => {
                this.$q.loading.hide()
                this.created = true
                this.id = id.slice(0, 3) + "-" + id.slice(3)
            }).catch((error) => {
                this.$q.loading.hide()
                console.log(error.message)
            })
        },

        home() {
            this.$router.push('/')
        }
    },
    mounted() {
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                this.$database.ref('users/' + user.uid + '/pubs/owner').once('value', data => {
                    let total = 0
                    for(let i in data.val()) total += 1
                    if(total >= 3) this.max = true
                })
            }
        });
    }
}
</script>