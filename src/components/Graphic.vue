<template>
    <div>
        <img
            v-if="color"
            :id="id + 'color'"
            :style="style"
        />
        <img
            v-if="fill"
            :id="id + 'fill'"
            :style="style"
        />
        <img
            v-if="glass"
            :id="id + 'glass'"
            :style="style"
        />
        <img
            v-if="garnish"
            :id="id + 'garnish'"
            :style="style"
        />
        <img
            v-if="ice"
            :id="id + 'ice'"
            :style="style"
        />
        <img
            v-if="foam"
            :id="id + 'foam'"
            :style="style"
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
            style: "position:absolute;height:30vh;width:auto;",

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
        this.$q.screen.setSizes({sm: 300, md: 500, lg: 1100, xl: 2000 })
        if(this.$q.screen.md) {
            this.style = "position:absolute;height:20vh;width:auto;"
        }
        else this.style = "position:absolute;height:30vh;width:auto;"


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