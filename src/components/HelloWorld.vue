<template>
  <v-container
        fluid
        grid-list-md
      >
        <v-layout
          fluid
          align-center
          justify-center
        >
          <v-card
            tile
            width="400"
            elevation=6
          >
            <v-flex d-flex xs12>
            <v-img
              width=200
              src="data:image/png;base64,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"
              aspect-ratio="1.9"
              contain
            >
            </v-img>
            </v-flex>

            <v-card-text>
              <h2>Contactos:</h2><br>
              <p class="subheading font-weight-light">
                Comercial: Lucio Andres: +54 (911) 3561-4639<br>
                Sistemas: Guillermo Cristobal: +54 (911) 3560-0383<br>
                o consulte online nuestra <a href="https://akiel.com.ar" target="_blank">Pagina Web</a>
              </p>
            </v-card-text>
          </v-card>

      </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader'
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify'
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify'
        }
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com'
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com'
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuetifyjs.com'
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs'
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify'
        }
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer'
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/layout/pre-defined'
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions'
        }

      ]
    })
  }
</script>

<style>

</style>
