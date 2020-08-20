<template>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs4>
            <v-select
                    :items="proyectos"
                    label="Proyecto"
                    @change="filterProyecto"
                    clearable
            ></v-select>
        </v-flex>
        <v-flex xs4>
            <v-text-field
                    append-icon="search"
                    label="Filter"
                    single-line
                    hide-details
                    @input="filterSearch"
            ></v-text-field>
        </v-flex>
        <v-flex xs4>
            <v-select
                    :items="authors"
                    label="Author"
                    @change="filterAuthor"
                    clearable
            ></v-select>
        </v-flex>
        <v-flex xs12>
            <v-data-table
                    :headers="headers"
                    :items="rows"
                    item-key="name"
                    :search="filters"
                    :custom-filter="customFilter"
            >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th v-for="header in props.headers" :key="header.text">
                            {{ header.text }}
                        </th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{ props.item.proyecto }}</td>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.added_by }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
</template>
<script>

  export default {
    data: () => ({
      filters: {
        search: '',
        added_by: '',
        proyecto: '',
      },

      authors: ['Admin', 'Editor'],
      proyectos: ['001', '002', '003'],
      headers: [
        { text: 'Proyecto', value: 'name', align: 'left', sortable: false },
        { text: 'Names', value: 'name', align: 'left', sortable: false },
        { text: 'Item addad by', value: 'added_by', align: 'left', sortable: false }
      ],
      rows: [
        { proyecto: '001', name: 'Marcelo Tosco', added_by: 'admin' },
        { proyecto: '001', name: 'Carlos Campos', added_by: 'admin' },
        { proyecto: '002', name: 'Luis Gonzalez', added_by: 'Editor' },
        { proyecto: '002', name: 'Keopx', added_by: 'Editor' },
        { proyecto: '003', name: 'Marco Marocchi', added_by: 'Admin' },
      ]
    }),

    methods: {

      customFilter(items, filters, filter, headers) {
        // Init the filter class.
        const cf = new this.$MultiFilters(items, filters, filter, headers);

        cf.registerFilter('search', function (searchWord, items) {
          if (searchWord.trim() === '') return items;

          return items.filter(item => {
            return item.name.toLowerCase().includes(searchWord.toLowerCase());
          }, searchWord);

        });


        cf.registerFilter('added_by', function (added_by, items) {
          if (added_by.trim() === '') return items;

          return items.filter(item => {
            return item.added_by.toLowerCase() === added_by.toLowerCase();
          }, added_by);

        });

        cf.registerFilter('proyecto', function (proyecto, items) {
          if (proyecto.trim() === '') return items;

          return items.filter(item => {
            return item.proyecto.toLowerCase() === proyecto.toLowerCase();
          }, proyecto);

        });

        // Its time to run all created filters.
        // Will be executed in the order thay were defined.
        return cf.runFilters();
      },


      /**
       * Handler when user input something at the "Filter" text field.
       */
      filterSearch(val) {
        this.filters = this.$MultiFilters.updateFilters(this.filters, {search: val});
      },

      /**
       * Handler when user  select some author at the "Author" select.
       */
      filterAuthor(val) {
        this.filters = this.$MultiFilters.updateFilters(this.filters, {added_by: val});
      },

      filterProyecto(val) {
        this.filters = this.$MultiFilters.updateFilters(this.filters, {proyecto: val});
      },
    }

  };
</script>