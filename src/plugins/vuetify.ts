/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { VuetifyOptions, createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default function makeVuetifyInstance(options: VuetifyOptions) {
  return createVuetify({
    theme: {
      defaultTheme: 'light',
    },
    ...options,
  });
}
