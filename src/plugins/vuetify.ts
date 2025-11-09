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
          // Dashboard colors
          success: '#4CAF50',
          warning: '#FB8C00',
          error: '#F44336',
          info: '#2196F3',
          dashboardPrimary: '#1976D2',
          dashboardSuccess: '#43A047',
          dashboardWarning: '#FFB300',
          dashboardInfo: '#00ACC1',
        },
      },
    },
  },
  components: {
    VTimePicker,
  },
})
