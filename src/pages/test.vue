<template>
    <q-page flex flex-center>
        
        <Graphic
            :graphic="{
                glass: 'short',
                color: '#FFA6C9'
            }"
        />

    </q-page>
</template>

<script>

import Graphic from 'components/Graphic.vue'

export default {
    name: "PageTesting",
    components: {Graphic},

    data () {
        return {

        }
    },

    methods: {

    },

    mounted() {

    }
}
</script>