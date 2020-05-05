<template>
    <div>
        <q-card  
            elevated
            :style="'width:' + width"
            class="my-card text-black"
            v-bind:class="!selected ? recipe.available ? 'bg-white' : 'bg-grey-4' : 'bg-orange'"
            >
                <div 
                v-bind:class="size.sm ? 'text-h5' : 'text-h4'"
                class="q-pt-lg text-center text-weight-bolder text-no-wrap"
                >
                <div 
                    v-bind:style="selected ? 'color:white' : 'color:' + color_"
                    @click="updateSelected()"
                > 
                    {{ recipe.name }}
                </div>
                </div>
                <div 
                class="text-caption text-center text-no-wrap text-italic"
                v-if="pub != ''"
                >
                <div v-if="recipe.available"> Available at {{pub}}</div>
                <div v-else> Not Available at {{pub}} </div>
                </div>
                

                <q-card-section horizontal>
                <div v-if="!selected" class="q-ml-sm"
                    :style="!size.lg ? size.sm ? 'height:30vh;width:40vw' : 'height:20vh;width:20vw' : 'height:30vh;width:11vw'"
                    @click="updateSelected()"
                >
                    <Graphic
                    :graphic="recipe.graphic"
                    :id="recipe.name"
                    />
                </div>
                <q-card-section horizontal v-if="selected">
                    <q-card-section vertical>
                    <q-btn dense class="q-my-xs text-black" label="1x"
                    :color="mult==1 ? 'white':'orange'" @click="mult=1"/><br>
                    <q-btn dense class="q-my-xs text-black" label="2x"
                    :color="mult==2 ? 'white':'orange'" @click="mult=2"/><br>
                    <q-btn dense class="q-my-xs text-black" label="3x"
                    :color="mult==3 ? 'white':'orange'" @click="mult=3"/>
                    </q-card-section>
                    <q-card-section vertical>
                    <ul class="text-body1 text-weight-bold" v-for="(value,index) in recipe.ingredients" :key="index">
                        <div v-if="value != null">
                            <li v-if="value.measurement == null"> {{value.amount * mult}} {{value.name}} </li>
                            <li v-else> {{value.amount * mult}} {{value.measurement}} of {{value.name}} </li>
                        </div>
                    </ul>
                    </q-card-section>
                </q-card-section>
                    <q-card-section v-else>
                    <div 
                        class="text-body2 text-grey-9 text-weight-bold" 
                        style="line-height:2.00rem; letter-spacing: 0.02786em"
                        v-for="(value,index) in recipe.ingredients" :key="index" 
                        >
                        <div v-if="value != null">
                        <div :class="value.filter ? 'text-weight-bold' : 'text-weight-regular'"
                            class="text-black"
                        >
                            {{value.name}}
                        </div>
                        </div>
                    </div>
                    </q-card-section>
                </q-card-section>

                <q-card-actions align="center">
                <div 
                    class="text-caption" 
                    :class="change.like ? 'text-green' : 'text-black'"> 
                    {{recipe.likes}}
                </div>
                <q-btn flat 
                    :disable="!loggedIn"
                    :ripple="false"
                    :color="recipe.like ? 'green' : 'black'"
                    icon-right="thumb_up" @click="updateLike()" />
                <q-btn 
                    :disable="recipe.url == ''" 
                    flat @click="openPage()"
                    :class="recipe.url == '' ? selected ? 'text-orange' : 'text-white' : 'text-black'"
                >
                    Method
                </q-btn>
                <q-btn flat 
                    :disable="!loggedIn"
                    :ripple="false"
                    :color="recipe.dislike ? 'red' : 'black'"
                    icon="thumb_down" @click="updateDislike()"/>
                <div 
                    class="text-caption" :class="change.dislike ? 'text-red' : 'text-black'">
                    {{recipe.dislikes}}
                </div>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
import Graphic from 'components/Graphic'

export default {
    name: "Recipe",
    components: {
        Graphic
    },
    props: {
        loggedIn: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        },
        pub: {
            type: String,
            default: ''
        },
        recipe: Object,
        change: Object,
        width: String,
        size: Object,
    },
    data () {
        return {
            color_: "#000000",
            mult: 1
        }
    },
    methods: {
        updateSelected() {
            this.$emit('selected')
        },
        updateLike() {
            this.$emit('like')
        },
        updateDislike() {
            this.$emit('dislike')
        },
        openPage() {
            window.open(this.recipe.url)
        }
    },
    mounted () {
        if(this.recipe.graphic.color == '#FFFFFF' || this.recipe.graphic.color == '#FCEBD2') {
            this.color_ = "#3c3d40"
        }
        else this.color_ = this.recipe.graphic.color
    }
}
</script>