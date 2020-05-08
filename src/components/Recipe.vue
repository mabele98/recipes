<template>
    <div v-if="loaded">
        <q-card  
            elevated
            :style="'margin:auto; width:' + width"
            class="my-card text-black"
            v-bind:class="!selected ? recipe.show.available ? 'bg-white' : 'bg-grey-4' : 'bg-orange'"
            >
                <div 
                v-bind:class="size.sm ? 'text-h5' : 'text-h4'"
                class="q-pt-lg text-center text-weight-bolder text-no-wrap"
                >
                <div 
                    v-bind:style="selected ? 'color:white' : 'color:' + color_"
                    @click="updateSelected()"
                > 
                    {{ recipe.name}}
                </div>
                </div>
                <div 
                class="text-caption text-center text-no-wrap text-italic"
                v-if="pub != ''"
                >
                <div v-if="recipe.show.available"> Available at {{pub}}</div>
                <div v-else> Not Available at {{pub}} </div>
                </div>
                

                <q-card-section horizontal>
                <div v-if="!selected" class="q-ml-sm"
                    :style="!size.lg ? size.sm ? 'height:30vh;width:40vw' : 'height:20vh;width:20vw' : 'height:30vh;width:11vw'"
                    @click="updateSelected()"
                >
                    <Graphic
                    class="q-mt-sm"
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
                    icon-right="thumb_up" @click="like('like')" />
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
                    icon="thumb_down" @click="like('dislike')"/>
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
        id: {
            type: String,
            default: ''
        },
        user: {
            type: String,
            default: ''
        },
        recipe: Object,
        width: String,
        size: Object,
    },
    data () {
        return {
            loaded: false,
            color_: "#000000",
            mult: 1,
            change: {}
        }
    },
    methods: {
        opinionChange(like) {
            this.change[like] = true
                
            setTimeout(() => {
                this.change[like] = false
            }, 1000)
        },
        like(like) {
            let prev = null

            if(like) {
                this.liked = false;
                prev = this.recipe.dislike
            }
            else {
                this.dislike = false;
                prev = this.recipe.like
            }

            let ref = this.$database.ref("users/" + this.user + "/recipes/" + this.id + "/" + this.recipe.key)
            ref.once("value", data => {
                let _like = false;
                let _dislike = false;

                if(like) {
                if(!data.exists() || data.val()['like'] == false) _like = true;
                }
                else {
                if(!data.exists() || data.val()['dislike'] == false) _dislike = true;
                }

                ref.set({"dislike": _dislike, "like": _like})
                
                let recipe = this.$database.ref("recipes/" + this.id + "/" + this.recipe.key)
                recipe.once("value", info => {
                    let _likes = info.val()["likes"];
                    let _dislikes = info.val()["dislikes"];

                    if(like) {
                        if(prev) _dislikes -= 1;

                        if(_like) _likes += 1;
                        else _likes -= 1;
                    }
                    else {
                        if(prev) _likes -= 1;

                        if(_dislike) _dislikes += 1;
                        else _dislikes -= 1;
                    }

                    recipe.update({
                        "dislikes": _dislikes,
                        "likes": _likes
                    });

                    this.recipe.like = _like;
                    this.recipe.dislike = _dislike;
                })
            })
    },
        updateSelected() {
            this.$emit('selected')
        },
        openPage() {
            window.open(this.recipe.url)
        }
    },
    mounted () {
        if(!('show' in this.recipe)) {
            this.recipe['show'] = {
                'available': true
            }
        }
        this.loaded = true

        this.$set(this.change, 'like', false)
        this.$set(this.change, 'dislike', false)

        if(this.id != ''){
            let ref = this.$database.ref("recipes/" + this.id + "/" + this.recipe.key + '/likes')
            ref.on("value", data => { this.opinionChange('like') })

            ref = this.$database.ref("recipes/" + this.id + "/" + this.recipe.key + '/dislikes')
            ref.on("value", data => { this.opinionChange('dislike') })
        }

        if(this.recipe.graphic.color == '#FFFFFF' || this.recipe.graphic.color == '#FCEBD2') {
            this.color_ = "#3c3d40"
        }
        else if(this.recipe.graphic.color == '#FFE999') this.color_ = "#FFCD1A"
        else this.color_ = this.recipe.graphic.color
    }
}
</script>