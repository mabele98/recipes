<template>
    <div>
        <img
            v-if="color"
            :id="id + 'color'"
            style="position:absolute;height:30vh;width:auto;"
        />
        <img
            v-if="glass"
            :id="id + 'glass'"
            style="position:absolute;height:30vh;width:auto;"
        />
        <img
            v-if="fill"
            :id="id + 'fill'"
            style="position:absolute;height:30vh;width:auto;"
        />
        <img
            v-if="garnish"
            :id="id + 'garnish'"
            style="position:absolute;height:30vh;width:auto;"
        />
        <img
            v-if="ice"
            :id="id + 'ice'"
            style="position:absolute;height:30vh;width:auto;"
        />
        <img
            v-if="foam"
            :id="id + 'foam'"
            style="position:absolute;height:30vh;width:auto;"
        />
    </div>
</template>


<script>
export default {
    name: "Graphic",

    props: {
        graphic: Object,
        id: String
    },

    data () {
        return {
            glass: false,
            color: false,
            fill: false,
            garnish: false,
            ice: false,
            foam: false
        
        }
    },

    computed: {

    },

    method: {

    },

    mounted() {
        const path = 'artwork/' + this.graphic['glass'] + '/'
        if('glass' in this.graphic && this.graphic['glass'] != ''){
            this.glass = true
            let glass = path + 'graphic.png'
            this.$storage.ref().child(glass).getDownloadURL().then(url => {
                let img = document.getElementById(this.id + 'glass');
                img.src = url
            })
        }

        if('color' in this.graphic && this.graphic['color'] != '') {
            this.color = true
            let color = path + 'color/' + (this.graphic['color'].slice(1)).toUpperCase() + '/graphic.png'
            this.$storage.ref().child(color).getDownloadURL().then(url => {
                let img = document.getElementById(this.id + 'color');
                img.src = url
            })
        }

        if('fill' in this.graphic && this.graphic['fill'] != '' && this.graphic['fill'] != 'none') {
            this.fill = true
            let fill = path + 'fill/' + this.graphic['fill'] + '/graphic.png'
            this.$storage.ref().child(fill).getDownloadURL().then(url => {
                let img = document.getElementById(this.id + 'fill');
                img.src = url
            })
        }

        if('garnish' in this.graphic && this.graphic['garnish'] != '' && this.graphic['garnish'] != 'none') {
            this.garnish = true
            let garnish = path + 'garnish/' + this.graphic['garnish'] + '/'
            if(this.graphic['garnish'] == 'whippedcream') {
                let whippedcream = garnish + this.graphic['whippedcream'] + '/graphic.png'
                this.$storage.ref().child(whippedcream).getDownloadURL().then(url => {
                    let img = document.getElementById(this.id + 'garnish');
                    img.src = url
                })
            }
            else {
                garnish += 'graphic.png'
                this.$storage.ref().child(garnish).getDownloadURL().then(url => {
                    let img = document.getElementById(this.id + 'garnish');
                    img.src = url
                })
            }
        }

        if('ice' in this.graphic && this.graphic['ice']) {
            this.ice = true
            let ice = path + 'ice/graphic.png'
            this.$storage.ref().child(ice).getDownloadURL().then(url => {
                let img = document.getElementById(this.id + 'ice');
                img.src = url
            })
        }

        if('foam' in this.graphic && this.graphic['foam']) {
            this.foam = true
            let foam = path + 'foam/graphic.png'
            this.$storage.ref().child(foam).getDownloadURL().then(url => {
                let img = document.getElementById(this.id + 'foam');
                img.src = url
            })
        }
    }
}
</script>

<style scoped>
    img {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>