<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Subitems</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="1000px">
                        <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                <v-flex xs2 sm2 md2>
                                    <v-text-field v-model="orden" label="Orden">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs10 sm10 md10>
                                    <v-select v-model="iditem"
                                    :items="items" label="Item">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="subitemes" label="Subitem(ES)"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="subitemen" label="Subitem(EN)"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                    </div>
                                </v-flex>
                                </v-layout>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="adModal" max-width="290">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Subitem?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Subitem?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Desactivar </span>
                                el subitem {{ adNombre }}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                                    Cancelar
                                </v-btn>
                                <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activar">
                                    Activar
                                </v-btn>
                                <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivar">
                                    Desactivar
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-dialog>
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="subitems"
                :search="search"
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
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
                    <td>{{ props.item.orden }}</td>
                    <td>{{ props.item.itemes }}</td>
                    <td>{{ props.item.subitemes }}</td>
                    <td>{{ props.item.itemen }}</td>
                    <td>{{ props.item.subitemen }}</td>
                    <td>
                        <div v-if="props.item.activo">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable';
    export default {
        data(){
            return {
                subitems:[],
                items:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Orden', value: 'orden' },
                    { text: 'Item (ES)', value: 'itemes' },
                    { text: 'Subitem (ES)', value: 'subitemes' },
                    { text: 'Item (EN)', value: 'itemen' },
                    { text: 'Subitem (EN)', value: 'subitemen' },
                    { text: 'Estado', value: 'activo', sortable: false  }                
                ],
                search: '',
                editedIndex: -1,
                id: '',
                // Inicializar variables Lookup
                iditem:'',
                orden: '',
                subitemes: '',
                subitemen: '',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''             
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo Subitem' : 'Actualizar Subitem'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
            this.select();
        },
        methods:{
            crearPDF(){
                var columns = [
                    {title: "Orden", dataKey: "orden"},
                    {title: "Item", dataKey: "iditem"}, 
                    {title: "Subitemes", dataKey: "subitemes"},
                    {title: "Subitemen", dataKey: "subitemen"}, 
                ];
                var rows = [];

                this.subitems.map(function(x){
                    rows.push({orden:x.orden,iditem:x.iditem,subitemes:x.subitemes,subitemen:x.subitemen});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Subitems", 40, 30);
                    }
                });
                doc.save('Subitems.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                console.log(configuracion);
                axios.get('api/Subitems/Listar',configuracion).then(function(response){
                    console.log(response);
                    me.subitems=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                var itemsArray=[];
                axios.get('api/Subitems/SelectItems',configuracion).then(function(response){
                    itemsArray=response.data;
                    itemsArray.map(function(x){
                        me.items.push({text: x.itemes+' / '+ x.itemen, value: x.iditem });
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.idsubitem=item.idsubitem;
                this.iditem=item.iditem;
                this.subitemes=item.subitemes;
                this.subitemen=item.subitemen;
                this.orden=item.orden;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idsubitem="";
                this.iditem="";
                this.subitemes="";
                this.subitemen="";
                this.orden="";
                this.editedIndex=-1;
            },
            guardar () {
                if (this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    let me=this;
                    axios.put('api/Subitems/Actualizar',{
                        'idsubitem':me.idsubitem,
                        'iditem':me.iditem,
                        'orden':me.orden,
                        'subitemes': me.subitemes,
                        'subitemen':me.subitemen
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Subitems/Crear',{
                        'iditem':me.iditem,
                        'orden':me.orden,
                        'subitemes': me.subitemes,
                        'subitemen':me.subitemen
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (this.subitemes.length<1 || this.subitemes.length>50){
                    this.validaMensaje.push("El subitem(ES) debe tener más de 1 caracter y menos de 50 caracteres.");
                }
                if (this.subitemen.length<1 || this.subitemen.length>50){
                    this.validaMensaje.push("El subitem(EN) debe tener más de 1 caracter y menos de 50 caracteres.");
                }                
                if (!this.iditem){
                    this.validaMensaje.push("Seleccione un item.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.subitemes;
                this.adId=item.idsubitem;                
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
            activar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Subitems/Activar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Subitems/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            }
        }        
    }
</script>
