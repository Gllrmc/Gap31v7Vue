<template>
<v-layout align-start>
    <div>
        <v-toolbar flat color="white">
        <v-toolbar-title>Presupuestos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-card-title>
        <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar"
            single-line
            hide-details
        ></v-text-field>        
        </v-card-title>
        <v-btn color="primary" dark @click="expand = !expand">
            {{ expand ? 'Cerrar' : 'No cerrar' }} lineas
        </v-btn>
        </v-toolbar>
        <v-data-table
        :headers="headers"
        :items="proyectos"
        :search="search"
        class="elevation-1"
        :expand="expand"
        item-key="idproyecto"
        >
        <template v-slot:items="props">
            <tr @click="props.expanded = !props.expanded">
            <td>{{ props.item.idproyecto }}</td>
            <td class="text-xs-left">{{ props.item.proyecto }}</td>
            <td class="text-xs-left">{{ props.item.producto }}</td>
            <td class="text-xs-left">{{ props.item.cliente }}</td>
            </tr>
        </template>
        <template v-slot:expand="props">
            <v-card flat>
            <v-card-text>

                <v-dialog v-model="dialog" max-width="1000px">
                    <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    <v-btn color="success" dark class="mb-2" >Enviar</v-btn>
                    <v-btn color="warning" dark class="mb-2"  @click="props.expanded = !props.expanded">Salir</v-btn>
                    </template>
                    <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.idproyecto" readonly label="# Proyecto"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.itemes" label="Item (ES)"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.subitemes" label="Subitem (ES)"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.importe" label="Importe"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.origen" label="Origen"></v-text-field>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Linea?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Linea?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            la linea {{ adNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activar(props.item)">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivar(props.item)">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-data-table
                :headers="headersdetail"
                :items="budgetLines"
                class="elevation-1"
                >
                <template v-slot:items="props">
                    <td class="justify-center layout px-0">
                    <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                    >
                        edit
                    </v-icon>
                    <v-icon
                        small
                        @click="deleteItem(props.item)"
                    >
                        delete
                    </v-icon>
                        <template v-if="props.item.activo">
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(2,props.item)"
                            >
                            block
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(1,props.item)"
                            >
                            check
                            </v-icon>
                        </template>                                       
                    </td>
                    <td class="text-xs-center">{{ props.item.idproyecto }}</td>
                    <td class="text-xs-center">{{ props.item.iditem }}</td>
                    <td class="text-xs-center">{{ props.item.idsubitem }}</td>
                    <td class="text-xs-left">{{ props.item.itemes }}</td>
                    <td class="text-xs-left">{{ props.item.subitemes }}</td>
                    <td class="text-xs-right">{{ props.item.importe }}</td>
                    <td class="text-xs-left">{{ props.item.origen }}</td>
                    <td>
                        <div v-if="props.item.activo">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>
                </v-data-table>

            </v-card-text>
            </v-card>
        </template>
        </v-data-table>
    </div>    
</v-layout>
</template>
<script>
  export default {
    data: () => ({
        search: '',
        dialog: false,          
        expand: false,
        headers: [
          {text: '# Proyectos', align: 'left',value: 'idproyecto'},
          { text: 'Proyecto', value: 'proyecto' },
          { text: 'Producto', value: 'producto' },
          { text: 'Cliente', value: 'cliente' },
        ],
        proyectos: [
          {
            idproyecto: 1,
            proyecto: 'Frozen Yogurt',
            producto: 'Corto 3D',
            cliente: 'Latam'
          },
          {
            idproyecto: 2,
            proyecto: 'Ice cream sandwich by delivery',
            producto: 'Animacion web',
            cliente: 'Uber'
          },
          {
            idproyecto: 3,
            proyecto: 'Eclair',
            producto: 'Corto Ultra-HD',
            cliente: 'Uber'
          },
          {
            idproyecto: 5,
            proyecto: 'Cupcake',
            producto: 'Corto B&W',
            cliente: 'Carrefour'
          },
          {
            idproyecto: 6,
            proyecto: 'Gingerbread',
            producto: 'Corto B&W',
            cliente: 'GBCA'
          },
          {
            idproyecto: 7,
            proyecto: 'Jelly bean',
            producto: 'Corto B&W',
            cliente: 'Uber'
          },
          {
            idproyecto: 9,
            proyecto: 'Lollipop Inline',
            producto: 'Corto B&W',
            cliente: 'Uber'
          },
          {
            idproyecto: 10,
            proyecto: 'Honey Combo Feliz',
            producto: 'Corto AVI',
            cliente: 'McDonalds'
          },
          {
            idproyecto: 11,
            proyecto: 'Donut + Coffe is a break',
            producto: 'Corto B&W',
            cliente: 'McDonalds'
          },
          {
            idproyecto: 12,
            proyecto: 'KitKat + Coffe is a must',
            producto: 'Web Page',
            cliente: 'McDonalds'
          }
        ],
        presupuestos: [
            {
            idproyecto: 1,
            iditem: 1,
            idsubitem: null,
            orden: '3100',
            itemes: 'Descripcion del item 3100 ES',
            subitemes: '',
            importe: 10000,
            origen: 'App',
            iduseralta: 5,
            fecalta: '2019-04-23',
            iduserumod: 5,
            fecumod: '2019-04-23'
            },
            {
            idproyecto: 1,
            iditem: 3,
            idsubitem: 1,
            orden: '3100',
            itemes: 'Descripcion del item 3100 ES',
            subitemes: 'Subitem A ES',
            importe: 10000,
            origen: 'App',
            iduseralta: 5,
            fecalta: '2019-04-23',
            iduserumod: 5,
            fecumod: '2019-04-23'
            },
            {
            idproyecto: 1,
            iditem: 3,
            idsubitem: 2,
            orden: '3100',
            itemes: 'Descripcion del item 3100 ES',
            subitemes: 'Subitem B ES',
            importe: 10000,
            origen: 'App',
            iduseralta: 5,
            fecalta: '2019-04-23',
            iduserumod: 5,
            fecumod: '2019-04-23'
            },
            {
            idproyecto: 2,
            iditem: 3,
            idsubitem: 2,
            orden: '3100',
            itemes: 'Proyecto 2 del item 3100 ES',
            subitemes: 'Subitem B ES',
            importe: 10000,
            origen: 'App',
            iduseralta: 5,
            fecalta: '2019-04-23',
            iduserumod: 5,
            fecumod: '2019-04-23'
            }
        ],
        headersdetail: [
            { text: 'Opciones', value: 'name', sortable: false },
            { text: '#Proyecto', align: 'left', value: 'idproyecto'},
            { text: '#Item', value: 'iditem' },
            { text: '#Subitem', value: 'idsubitem' },
            { text: 'Item ES', value: 'itemes' },
            { text: 'Subitem ES', value: 'subitemes' },
            { text: 'Importe', value: 'importe' },
            { text: 'Origen', value: 'origen' },
            { text: 'Activo', value: 'activo' }
        ],
        budgetLines: [],
        editedIndex: -1,
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: '',        
        editedItem: {
            idproyecto: '',
            iditem: '',
            idsubitem: '',
            itemes: '',
            subitemes:'',
            importe: 0,
            origen:'',
            activo: false
        },
        defaultItem: {
            idproyecto: '',
            iditem: '',
            idsubitem: '',
            itemes: '',
            subitemes:'',
            importe: 0,
            origen:'App',
            activo: true
        }
        }),

        computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nueva Linea' : 'Editar Linea'
        }
        },

        watch: {
        dialog (val) {
            val || this.close()
        }
        },

        created () {
        this.initialize()
        },

        methods: {
        initialize () {
            this.budgetLines = [
            {
                idproyecto: 1,
                iditem: 1,
                idsubitem: 1,
                itemes: 'Item ES',
                subitemes: 'Subitem ES',
                importe: 10000,
                origen: 'App',
                activo: true
            },
            {
                idproyecto: 1,
                iditem: 2,
                idsubitem: 1,
                itemes: 'Ice cream sandwich',
                subitemes: 'Pan Negro',
                importe: 10000,
                origen: 'App',
                activo: true
            },
            {
                idproyecto: 1,
                iditem: 2,
                idsubitem: 2,
                itemes: 'Ice cream sandwich',
                subitemes: 'Pan Blanco',
                importe: 10000,
                origen: 'App',
                activo: true
            },
            {
                idproyecto: 1,
                iditem: 2,
                idsubitem: 3,
                itemes: 'Ice cream sandwich',
                subitemes: 'Pan Integral',
                importe: 10000,
                origen: 'App',
                activo: true
            },
            {
                idproyecto: 2,
                iditem: 1,
                idsubitem: 1,
                itemes: 'Item ES',
                subitemes: 'Subitem ES',
                importe: 10000,
                origen: 'App',
                activo: true
            },            
            {
                idproyecto: 2,
                iditem: 2,
                idsubitem: 1,
                itemes: 'Ice cream sandwich',
                subitemes: 'Pan Negro',
                importe: 10000,
                origen: 'App',
                activo: true
            },
            {
                idproyecto: 2,
                iditem: 2,
                idsubitem: 2,
                itemes: 'Ice cream sandwich',
                subitemes: 'Pan Blanco',
                importe: 10000,
                origen: 'App',
                activo: true
            },
            {
                idproyecto: 3,
                iditem: 2,
                idsubitem: 3,
                itemes: 'Ice cream sandwich',
                subitemes: 'Pan Integral',
                importe: 10000,
                origen: 'App',
                activo: true
            }
            ]
        },

        editItem (item) {
            this.editedIndex = this.budgetLines.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            const index = this.budgetLines.indexOf(item)
            confirm('Esta seguro que desea borrar esta línea?') && this.budgetLines.splice(index, 1)
        },

        close () {
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },

        save () {
            if (this.editedIndex > -1) {
            Object.assign(this.budgetLines[this.editedIndex], this.editedItem)
            } else {
            this.budgetLines.push(this.editedItem)
            }
            this.close()
        },
        activarDesactivarMostrar(accion,item){
            this.adModal=1;
            this.adNombre=item.itemes + "/" + item.subitemes;
            this.adId=item.idpresupuesto;                
            if (accion==1){
                this.adAccion=1;
            }
            else if (accion==2){
                this.adAccion=2;
            }
            else{
                this.adModal=0;
            }
        },
        activarDesactivarCerrar(){
            this.adModal=0;
        },
        activar(Item){
            this.editedIndex = this.budgetLines.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.editedItem.activo = true
            Object.assign(this.budgetLines[this.editedIndex], this.editedItem)
            this.adModal=0;
            this.adAccion=0;
            this.adNombre='';
            this.adId='';
            // let me=this;
            //let header={"Authorization" : "Bearer " + this.$store.state.token};
            //let configuracion= {headers : header};
            //axios.put('api/Presupuestos/Activar/'+this.adId,{},configuracion).then(function(response){
            //    me.adModal=0;
            //    me.adAccion=0;
            //    me.adNombre="";
            //    me.adId="";
            //    me.listar();                       
            //}).catch(function(error){
            //    console.log(error);
            //}); 
        },
        desactivar(Item){
            this.editedIndex = this.budgetLines.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.editedItem.activo = false
            Object.assign(this.budgetLines[this.editedIndex], this.editedItem)
            this.adModal=0;
            this.adAccion=0;
            this.adNombre='';
            this.adId='';
            // let me=this;
            // let header={"Authorization" : "Bearer " + this.$store.state.token};
            // let configuracion= {headers : header};
            // axios.put('api/Presupuestos/Desactivar/'+this.adId,{},configuracion).then(function(response){
            //     me.adModal=0;
            //     me.adAccion=0;
            //     me.adNombre="";
            //     me.adId="";
            //     me.listar();                       
            // }).catch(function(error){
            //     console.log(error);
            // });
        }   
        }
    }
</script>