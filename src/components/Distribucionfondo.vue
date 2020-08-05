<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Pedidos Fondos</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="1000px">
                        <v-card>
                            <v-card-title>
                            <span class="headline">Pedido de Fondo</span>
                            </v-card-title>            
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs5 sm5 md5>
                                        <v-select v-model="idproyecto" 
                                        :items = "proyectos" label = "Proyecto" readonly>
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs2 sm2 md2>
                                        <v-text-field type="number" v-model.number="numpedido" label="#Pedido" readonly>
                                        </v-text-field>
                                    </v-flex>                                    
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idresponsable" readonly
                                        :items = "responsables" label = "Responsable">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs2 sm2 md2>
                                        <v-text-field type="number" v-model="importe" readonly prefix="$" label="Importe">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Salir</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="agregar">Agregar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table
                    :headers="headers"
                    :items="pedidofondos"
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
                            tab
                            </v-icon>
                        </td>
                        <td class="text-xs-center"> {{ props.item.idproyecto }}</td>
                        <td>{{ props.item.proyecto }}</td>
                        <td class="text-xs-center">{{ props.item.numpedido }}</td>
                        <td>{{ props.item.responsable }}</td>
                        <td>{{ props.item.fecpedido.substr(0, 10) }}</td>
                        <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                        <td>{{ props.item.notas }}</td>
                    </template>
                    <template slot="no-data">
                    <v-btn color="primary" @click="listar">Resetear</v-btn>
                    </template>
                </v-data-table>
                <v-toolbar-title>Distribucion Fondos</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="1000px">
                        <v-card>
                            <v-card-title>
                            <span class="headline">Pedido de Fondo</span>
                            </v-card-title>            
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs5 sm5 md5>
                                        <v-select v-model="idproyecto" 
                                        :items = "proyectos" label = "Proyecto" readonly>
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs2 sm2 md2>
                                        <v-text-field type="number" v-model.number="numpedido" label="#Pedido" readonly>
                                        </v-text-field>
                                    </v-flex>                                    
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idresponsable" readonly
                                        :items = "responsables" label = "Responsable">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs2 sm2 md2>
                                        <v-text-field type="number" v-model="importe" readonly prefix="$" label="Importe">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Salir</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="agregar">Agregar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table
                    :headers="headersDetalle"
                    :items="distribucionfondos"
                    class="elevation-1"
                    >
                    <template slot="items" slot-scope="props">
                        <td class="justify-center layout px-20">
                            <v-icon
                            small
                            class="mr-2"
                            @click="editItem(props.item)"
                            >
                            edit
                            </v-icon>
                            <v-icon
                            small
                            class="mr-2"
                            @click="deleteItem(props.item)"
                            >
                            delete
                            </v-icon>
                        </td>
                        <td>{{ props.item.responsable }}</td>
                        <td>{{ props.item.fecdistribucion.substr(0, 10) }}</td>
                        <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                        <td>{{ props.item.notas }}</td>
                    </template>
                    <template slot="no-data">
                        <v-btn color="primary" @click="listar">Resetear</v-btn>
                    </template>
                    <template v-slot:no-data>
                        <v-alert :value="true" color="error" icon="warning">
                            No hay nada para mostrar :(
                        </v-alert>
                    </template>
                </v-data-table>
            </v-toolbar>
        </v-flex>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    export default {
            data: () => {
                return {
                    pedidofondos:[],
                    distribucionfondos:[
                        {
                        idresponsable: 8,
                        responsable: 'Guillermo Cristobal',
                        fecdistribucion: '2019-04-25',
                        importe: 5000,
                        nota: 'Esto es una Nota en detalle'
                        }
                    ],
                    proyectos:[],
                    responsables:[],
                    idpedidofondo: '',
                    idproyecto: '',
                    idresponsable: '',
                    numpedido: '',
                    fecpedido: '',
                    importe: 0,
                    notas: '',
                    rendido: false,
                    iduseralta: '',
                    fecalata: '',
                    iduserumod: '',
                    fecumod: '',
                    activo: '',
                    menu1: false,
                    dialog: false,
                    headers: [
                        { text: 'Opciones', value: 'opciones', sortable: false },
                        { text: '#Proyecto', value: 'idproyecto', sortable: true },
                        { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                        { text: '#Pedido', value: 'numpedido', sortable: true },
                        { text: 'Responsable', value: 'responsable', sortable: true },
                        { text: 'Fecha Pedido', value: 'fecpedido', sortable: true },
                        { text: 'Importe', value: 'importe', sortable: true },
                        { text: 'Notas', value: 'notas', sortable: true },             
                    ],
                    headersDetalle: [
                        { text: 'Opciones', value: 'opciones', sortable: false },
                        { text: 'Responsable', value: 'responsable', sortable: true },
                        { text: 'Fecha Pedido', value: 'fecdistribucion', sortable: true },
                        { text: 'Importe', value: 'importe', sortable: true },
                        { text: 'Notas', value: 'notas', sortable: true },             
                    ],                    
                    search: '',
                    editedIndex: -1,
                    valida: 0,
                    validaMensaje:[],
                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: ''                         }
            },
            computed: {
            },

            watch: {
                dialog (val) {
                val || this.close()
                },
            },

            created () {
                this.listar();
                this.select();
            },
            methods:{
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Pedidofondos/ListarActivos',configuracion).then(function(response){
                    console.log(response);
                    me.pedidofondos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var proyectosArray=[];
                var responsablesArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Proyectos/Select',configuracion).then(function(response){
                    //console.log(response);
                    proyectosArray=response.data;
                    proyectosArray.map(function(x){
                        me.proyectos.push({text: x.proyecto,value:x.idproyecto});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Personas/SelectResponsables',configuracion).then(function(response){
                    //console.log(response);
                    responsablesArray=response.data;
                    responsablesArray.map(function(x){
                        me.responsables.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            SelectProximoPedido(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Pedidofondos/SelectProximoPedido/'+this.idproyecto,configuracion)
                .then(function(response){
                    //console.log(response);
                    this.numpedido=response.data.numpedido++;
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.idpedidofondo = item.idpedidofondo;
                this.idproyecto = item.idproyecto;
                this.idresponsable = item.idresponsable;
                this.numpedido = item.numpedido;
                this.fecpedido = item.fecpedido.substr(0, 10);
                this.importe = item.importe;
                this.notas = item.notas;
                this.rendido = item.rendido;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idpedidofondo = '';
                this.idproyecto = '';
                this.idresponsable = '';
                this.numpedido = '';
                this.fecpedido = '';
                this.importe = '';
                this.notas = '';
                this.rendido = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
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
                    console.log(me);
                    axios.put('api/Pedidofondos/Actualizar',{
                        'idpedidofondo': me.idpedidofondo,
                        'idproyecto': me.idproyecto,
                        'idresponsable': me.idresponsable,
                        'numpedido': me.numpedido,
                        'fecpedido': me.fecpedido,
                        'importe': me.importe,
                        'notas': me.notas,
                        'rendido': me.rendido,
                        'iduseralta': me.iduseralta,
                        'fecalta': me.fecalta,
                        'iduserumod': me.$store.state.usuario.idusuario,
                        'fecumod': new Date().toISOString()
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
                    console.log(me);
                    axios.post('api/Pedidofondos/Crear',{
                        'idproyecto': me.idproyecto,
                        'idresponsable': me.idresponsable,
                        'numpedido': me.numpedido,
                        'fecpedido': me.fecpedido,
                        'importe': me.importe,
                        'notas': me.notas,
                        'rendido': false,
                        'iduseralta': me.$store.state.usuario.idusuario,
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
                if (!this.idproyecto){
                    this.validaMensaje.push("Ingrese un proyecto.");
                }
                if (!this.idresponsable){
                    this.validaMensaje.push("Ingrese un responsable.");
                }
                if (!this.fecpedido){
                    this.validaMensaje.push("Ingrese una fecha de pedido de fondo.");
                }
                if (!this.importe || this.importe <= 0 ){
                    this.validaMensaje.push("Ingrese un importe positivo.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.proyecto + '/' + item.numpedido;
                this.adId=item.idpedidofondo;                
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
                axios.put('api/Pedidofondos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Pedidofondos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
