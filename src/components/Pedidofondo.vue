<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Pedidos de Fondos</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="750px">
                        <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>            
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <template v-if="editedIndex==-1">
                                        <v-flex xs9 sm9 md9>
                                            <v-select v-model="idproyecto" @change="SelectProximoPedido()"
                                            :items = "proyectos" label = "Proyecto">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs3 sm3 md3>
                                            <v-text-field type="number" v-model.number="numpedido" label="#Pedido">
                                            </v-text-field>
                                        </v-flex>
                                    </template>
                                    <template v-else>
                                        <v-flex xs9 sm9 md9>
                                            <v-select v-model="idproyecto" 
                                            :items = "proyectos" label = "Proyecto" readonly>
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs3 sm3 md3>
                                            <v-text-field type="number" v-model.number="numpedido" label="#Pedido" readonly>
                                            </v-text-field>
                                        </v-flex>
                                    </template>
                                    
                                    <v-flex xs9 sm9 md9>
                                        <v-select v-model="idresponsable"
                                        :items = "responsables" label = "Responsable">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-text-field type="number" v-model="importe" prefix="$" label="Importe">
                                        </v-text-field>
                                    </v-flex>
                                    <template>
                                        <v-flex xs12 sm12 md12>
                                            <v-menu
                                                v-model="menu1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        v-model="fecpedido"
                                                        label="Fecha Pedido"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="fecpedido" @input="menu1 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="notas" label="Notas">
                                        </v-text-field>
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
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Pedido de Fondo?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Pedido de Fondo?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Desactivar </span>
                                el pedido de fondo {{ adNombre }}
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
                    </v-dialog>                </v-toolbar>
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
                    <td class="text-xs-center"> {{ props.item.idproyecto }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td class="text-xs-center">{{ props.item.numpedido }}</td>
                    <td>{{ props.item.responsable }}</td>
                    <td>{{ props.item.fecpedido.substr(0, 10) }}</td>
                    <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                    <td>{{ props.item.notas }}</td>
                    <td class="text-xs-center">
                        <div v-if="props.item.rendido">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>  
                    <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                    <td>{{ props.item.fecalta }}</td>
                    <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                    <td>{{ props.item.fecumod }}</td>
                    <td class="justify-center layout px-0">
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
    import autoTable from 'jspdf-autotable'
    export default {
        data: () => {
            return {
                pedidofondos:[],
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
                    { text: 'Rendido?', value: 'rendido', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                
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
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo proyecto' : 'Actualizar proyecto'
            }
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
        crearPDF(){
                var columns = [
                    {title: "Proyecto", dataKey: "proyecto"},
                    {title: "Producto", dataKey: "producto"},
                    {title: "Cliente", dataKey: "cliente"},
                    {title: "Empresa", dataKey: "empresa"},
                    {title: "Director", dataKey: "director"},
                    {title: "EP", dataKey: "ep"},
                    {title: "Adjudicacion", dataKey: "fecadjudicacion"},
                    {title: "Inicio DxD", dataKey: "fecdesdxd"},
                    {title: "Offline", dataKey: "fecoffline"},
                    {title: "Online", dataKey: "feconline"},
                    {title: "Rodaje", dataKey: "fecrodaje"},
                ];
                var rows = [];

                this.pedidofondos.map(function(x){
                    rows.push({proyecto:x.proyecto, producto:x.producto, cliente:x.cliente, empresa:x.empresa,
                    director:x.director, ep: x.ep, fecadjudicacion: x.fecadjudicacion, fecdesdxd: x.fecdesdxd,
                    fecoffline:x.offline, feconline:x.online, fecrodaje:x.fecrodaje});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Pedidos de Fondeo", 40, 30);
                    }
                });
                doc.save('Pedidofondos.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Pedidofondos/Listar',configuracion).then(function(response){
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
