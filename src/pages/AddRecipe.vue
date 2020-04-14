<template>
    <q-page class="flex flex-center">

        <q-card v-if="!confirm" style="width: 500px">
            <q-card-section vertical>
                <div class="text-black text-h3"> Add recipe! </div>

                <q-btn label="Submit" class="text-white" color="green" @click="submit(false)"/>

                <q-input v-model="name" label="Drink Name"/>
                <q-input v-model="type" label="Drink Type"/>
                <q-input v-model="description" label="Description"/>
                <q-input v-model="color" label="Color"/>


                <div class="text-h4 text-black q-mt-md"> Ingredients </div>
                <div v-for="(value,key) in ingredients" :key="key">
                    <div class="text-subtitle2 text-black q-mt-md"> {{key}} </div>
                    <q-input v-model="ingredients[key].name" label="Name"/>
                    <q-input v-model="ingredients[key].amount" label="Amount"/>
                    <q-input v-model="ingredients[key].measurement" label="Measurement"/>
                    <q-input v-model="ingredients[key].type" label="Type"/>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-btn label="+" class="text-black" @click="add()" />

            </q-card-actions>

        </q-card>

        <q-card v-if="confirm">
            <q-btn label="Submit" class="text-white" color="green" @click="submit(true)"/>
            <QFirebaseUploader
                :path="type + '/'"
                />
            <q-btn label="Cancel" class="text-black" @click="cancel()" />
        </q-card>

    </q-page>
</template>

<script>
import QFirebaseUploader from 'components/QFirebaseUploader'

export default {
    name: "PageAddRecipe",
    components: {
        QFirebaseUploader
    },
    data () {
        return {

            name: '',
            type: '',
            color: '',
            description: '',
            ingredients: [
                {
                    "amount": 0,
                    "measurement": '',
                    "name": '',
                    "type": ''
                }
            ],

            confirm: false,

        }
    },

    methods: {
        add() {
            this.ingredients.push({
                "amount": 0,
                "measurement": '',
                "name": '',
                "type": ''
            });
            console.log(this.ingredients)
        },

        submit(done) {
            let data = {
                'name': this.name,
                'description': this.description,
                'color': this.color,
                'dislikes': 0,
                'likes': 0,
            }

            var check = data;

            if(done) {
                this.confirm = false;
                let ref = this.$database.ref('recipes/' + this.type)
                let key = ref.push().getKey()
                ref.push(data)

                
            }
            else this.confirm = true;

            check['ingredients'] = this.ingredients;

            console.log(check)

        },

        cancel() {
            this.confirm = false;
        }
    },

    mounted () {
        for(let item in this.ingredients){
            console.log(item)
        }
    }
}
</script>