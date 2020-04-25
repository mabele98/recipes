<template>
    <q-page flex flex-center>
        <q-card
            class="text-center absolute-center"
            :style="size.sm ? 'width:95vw' : 'width:60vw'"
        >
            <q-card-section>
                <div class="text-h4"> Print a Menu </div>
            </q-card-section>
            <q-card-section>
                <div class="text-subtitle1"> Which recipes would you like to print? </div>
                <q-btn-dropdown color="green" :label="drink">
                    <q-list>
                        <q-item 
                        v-for="item in recipes"
                        :key="item"
                        clickable v-close-popup
                        @click="drink = item"
                        >
                        <q-item-section>
                            <q-item-label>{{item}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
                <div class="q-mt-lg text-subtitle1"> Select a Pub to print from </div>
                <q-btn-dropdown color="green" :label="pub.name">
                    <q-list>
                        <q-item 
                        v-for="item in pubs"
                        :key="item.id"
                        clickable v-close-popup
                        @click="pub = {'id': item.id, 'name': item.name}"
                        >
                        <q-item-section>
                            <q-item-label>{{item.name}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
                <div class="q-mt-lg text-subtitle1"> How do you want to filter the recipes? </div>
                <q-checkbox 
                    v-model="like" 
                    :label="user + '\'s Liked Recipes'" 
                    color="green" /> <br>
                <q-checkbox 
                    :disable="pub.name == 'None' || pub.name == ''" 
                    v-model="available" 
                    :label="'Available Recipes at '+ pub.name" 
                    color="green" />
                <div class="q-mt-lg text-subtitle1"> Do you want to include the recipe? </div>
                <q-btn-toggle
                    v-model="ingredients"
                    toggle-color="green"
                    :options="[
                        {label: 'Just Ingredients', value: 'ingredients'},
                        {label: 'Include Recipe', value: 'recipe'}
                    ]"
                    />
            </q-card-section>

            <q-btn class="q-ma-lg" label="submit" color="orange" @click="submit()"/>

        </q-card>
    </q-page>
</template>

<script>
export default {
    name: "PageMenu",
    data () {
        return {
            user: null,
            size: this.$q.screen,

            recipes: [],
            drink: '',

            pubs: [{'id': 'none', 'name': 'None'}],
            pub: {'id': 'none', 'name': 'None'},


            available: false,
            like: false,

            ingredients: 'ingredients',
        }
    },
    methods: {
        loadRecipes() {
            this.$database.ref('recipes').once('value', data => {
                for(let drink in data.val()) {
                    this.recipes.push(drink)
                }
            })
        },
        loadPubs(user) {
            this.$database.ref('users/' + user + '/pubs').once('value', data => {
                if(data.exists()) {
                    for(let type in data.val()) {
                        for(let id in data.val()[type]){
                            this.pubs.push({'id': id, 'name': data.val()[type][id]})
                        }
                    }
                    this.pubs.reverse()
                    console.log(this.pubs)
                }
            })
        },
        submit() {
            let routeData = this.$router.resolve({ name: 'print', params: { 
                drink: this.drink,
                pub: this.pub.id,
                like: this.like,
                available: this.available,
                ingredients: this.ingredients
            } })

            window.open(routeData.href, '_blank')
        }
    },
    mounted () {
        //window.print()
        this.loadRecipes()
        this.$auth.onAuthStateChanged(user => {
            if (user) {
                this.user = user.displayName
                this.loadPubs(user.uid)
            }
        })
    }
}
</script>