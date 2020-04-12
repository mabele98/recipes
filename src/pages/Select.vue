<template>
    <q-page>
        <div class="q-pa-md">
            <div class="q-gutter-md">
            <q-date
                v-model="date"
                :options="options"
            />

            <q-date
                v-model="date"
                :options="optionsFn"
            />

            <q-date
                v-model="date"
                :options="optionsFn2"
            />
            </div>
        </div>

        <div class="q-pa-md row q-col-gutter-sm">
            <q-tree class="col-12 col-sm-6"
            :nodes="simple"
            node-key="label"
            tick-strategy="leaf"
            :selected.sync="selected"
            :ticked.sync="ticked"
            :expanded.sync="expanded"
            />
            <div class="col-12 col-sm-6 q-gutter-sm">
            <div class="text-h6">Selected</div>
            <div>{{ selected }}</div>

            <q-separator spaced />

            <div class="text-h6">Ticked</div>
            <div>
                <div v-for="tick in ticked" :key="`ticked-${tick}`">
                {{ tick }}
                </div>
            </div>

            <q-separator spaced />

            <div class="text-h6">Expanded</div>
            <div>
                <div v-for="expand in expanded" :key="`expanded-${expand}`">
                {{ expand }}
                </div>
            </div>
            </div>
        </div>
    </q-page>
</template>

<script>
export default {
  data () {
    return {
      date: '2019/02/01',
      options: [ '2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23' ],

      simple: [
        {
          label: 'Satisfied customers',
          children: [
            {
              label: 'Good food',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service (disabled node)',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ],
      selected: 'Pleasant surroundings',
      ticked: [ 'Quality ingredients', 'Good table presentation' ],
      expanded: [ 'Satisfied customers', 'Good service (disabled node)', 'Pleasant surroundings' ]
    }
  },

  methods: {
    optionsFn (date) {
      return date >= '2019/02/03' && date <= '2019/02/15'
    },

    optionsFn2 (date) {
      const parts = date.split('/')
      return parts[2] % 2 === 0
    }
  }
}
</script>