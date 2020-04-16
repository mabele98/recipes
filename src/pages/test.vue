<template>
    <q-page flex flex-center>
        <br><br>
  

        <q-card>
            <q-card-section>
                <img
                    id="img1"
                    style="position:relative;top:0;left:0;height:30vh;opacity: 0.5"
                />
                <img
                    id="img2"
                    style="position:absolute;top:0;left:45px;height:30vh"
                />
            </q-card-section>
        </q-card>

    </q-page>
</template>

<script>
export default {
    name: "PageTesting",

    data () {
        return {

        }
    },

    methods: {

    },

    mounted() {
        let ref = this.$storage.ref("graphics/champagne/FFA6C9/none/strawberry/graphic.png")
        ref.getDownloadURL().then(url => {
            let img = document.getElementById('img1');
            img.src = url; 
        })
        ref = this.$storage.ref("graphics/shot/FFA6C9/none/none/graphic.png")
        ref.getDownloadURL().then(url => {
            let img = document.getElementById('img2');
            img.src = url; 
        })

    }
}
</script>