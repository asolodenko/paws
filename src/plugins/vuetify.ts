/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@/styles/settings.scss'
import 'vuetify/styles'


// Composables
import { createVuetify } from 'vuetify'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#365738ff',
          secondary: '#FFFFFF',
          primaryLight: '#558f58ff',
          background: '#231c1cff', //'#909690',
          surface: '#434a44ff',
          border: '#707570',
        },
      },
    },
  },
  components: {
    VTimePicker,
  },
})
