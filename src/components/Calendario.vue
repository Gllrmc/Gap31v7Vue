<template>
  <v-layout wrap>
    <v-toolbar flat color="white">
        <v-toolbar-title>Calendario de Gastos</v-toolbar-title>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            right
            color="error"
            >
            {{ snacktext }}
            <v-btn 
                color="error"
                dark
                vertical
                text
                @click="snackbar = false"
            >
                Cerrar
            </v-btn>
        </v-snackbar>     
    </v-toolbar>
    <v-flex
      xs12
      class="mb-3"
    >
      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          v-model="start"
          :type="type"
          :end="end"
          locale="es"
          color="primary"
        >
          <template v-slot:day="{ date }">
              
              <template v-for="event in eventsMap[date]">
              <v-menu
                  :key="event.title"
                  v-model="event.open"
                  full-width
                  offset-x
              >
                  <template v-slot:activator="{ on }">
                  <div v-on="on">
                      <v-chip v-if="event.pendiente" class="caption font-weight-light"  :color="event.color" :text-color="event.texto" >{{ event.title }}: $ {{ formatPrice(event.importe) }}</v-chip>
                      <v-chip v-else class="caption font-weight-light" >{{ event.title }}: $ {{ formatPrice(event.importe) }}</v-chip>
                  </div>
                  </template>
                  <v-card
                  color="grey lighten-4"
                  min-width="350px"
                  flat
                  >
                  <v-toolbar
                      :color="event.color"
                      :dark="(event.texto=='black'?false:true)"  
                  >
                      <v-btn icon>
                      <v-icon v-if="event.pendiente" @click="desactivar(event.id)">check</v-icon>
                      <v-icon v-else @click="activar(event.id)">block</v-icon>
                      </v-btn>
                      <v-toolbar-title >{{ event.title }}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <!-- <v-btn icon>
                      <v-icon>favorite</v-icon>
                      </v-btn>
                      <v-btn icon>
                      <v-icon>more_vert</v-icon>
                      </v-btn> -->
                  </v-toolbar>
                  <v-card-title primary-title>
                      <div>AR$ {{formatPrice(event.importe)}}</div>
                  </v-card-title>
                  <v-card-text>
                      <div>{{event.detalle}}</div>
                  </v-card-text>
                  <v-card-actions>
                      <v-btn
                      flat
                      color="secondary"
                      >
                      Cancelar
                      </v-btn>
                  </v-card-actions>
                  </v-card>
              </v-menu>
              </template>
          </template>        
        </v-calendar>
      </v-sheet>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-sm-left text-xs-center"
    >
      <v-btn @click="$refs.calendar.prev()">
        <v-icon
          dark
          left
        >
          keyboard_arrow_left
        </v-icon>
        Prev.
      </v-btn>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-xs-center"
    >
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-sm-right text-xs-center"
    >
      <v-btn @click="$refs.calendar.next()">
        Prox.
        <v-icon
          right
          dark
        >
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
  
</template>
<script>
  import axios from 'axios'

  export default {
    data: () => ({
      type: 'month',
      start: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().substr(0,10),
      end: '2019-01-06',
      events: []
    }),
    computed: {
        // convert the list of events into a map of lists keyed by fecha
        eventsMap () {
            const map = {}
            this.events.forEach(e => (map[e.fecha] = map[e.fecha] || []).push(e))
            return map
        },
    },
    watch: {
    },
    created () {
        this.listar();
    },    
    methods: {
      formatPrice(value) {
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
      listar(){
        let me=this;
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers : header};
        var gastosArray = [];
        me.events = [];
        axios.get('api/Gastos/Listar',configuracion).then(function(response){
            //console.log(response);
            gastosArray=response.data;
            gastosArray.map(function(x){
              me.events.push({id:x.idgasto, title: x.concepto, detalle:x.nota, fecha: x.fecgasto.substr(0,10), importe: x.importe, open:false, 
              texto:x.texto, color:x.color, pendiente: x.pendiente});
            })
        }).catch(function(error){
            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;                     
            me.snackbar = true;                     
            console.log(error);
        });
      },
      activar(id){
          let me=this;
          let header={"Authorization" : "Bearer " + this.$store.state.token};
          let configuracion= {headers : header};
          axios.put('api/Gastos/Activarpendiente/'+id,{},configuracion).then(function(response){
              me.listar();
          }).catch(function(error){
              me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
              me.snackbar = true;
              console.log(error);
          });
      },
      desactivar(id){
        debugger;
          let me=this;
          let header={"Authorization" : "Bearer " + this.$store.state.token};
          let configuracion= {headers : header};
          axios.put('api/Gastos/Desactivarpendiente/'+id,{},configuracion).then(function(response){
              me.listar();
          }).catch(function(error){
              me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
              me.snackbar = true;
              console.log(error);
          });
      },
    }
  }
</script>
