<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Cheques en Garnatía - Proyectos</v-toolbar-title>
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
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-dialog v-model="dialog" max-width="1600px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Garantías del Proyecto #{{this.orden}}: {{this.proyecto}} </span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="800px">
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-text>
                                <v-container grid-list-md>
                                    <template v-if="entregado"> 
                                        <v-layout wrap>
                                            <v-flex xs12 sm12 md12>
                                                <v-autocomplete 
                                                    v-model="idrubro"
                                                    clearable 
                                                    :items="rubros" 
                                                    label="Rubro"
                                                    disabled
                                                    :search-input.sync="searchr" 
                                                >
                                                </v-autocomplete>
                                            </v-flex>
                                            <v-flex xs8 sm8 md8>
                                                <v-autocomplete 
                                                    v-model="idproveedor"
                                                    clearable 
                                                    :items="proveedores" 
                                                    label="Proveedor"
                                                    disabled
                                                    :search-input.sync="searchp" 
                                                >
                                                </v-autocomplete>
                                            </v-flex>
                                            <v-flex xs4 sm4 md4>
                                                <v-text-field v-model="importe"
                                                    label="Importe"
                                                    type="number"
                                                    disabled
                                                    >
                                                </v-text-field>                                               
                                            </v-flex>
                                            <v-flex xs12 sm12 md12>
                                                <v-text-field v-model="detalle"
                                                    label="Detalle"
                                                    type="text"
                                                    >
                                                </v-text-field>                                               
                                            </v-flex>
                                        </v-layout>
                                    </template>
                                    <template v-else>
                                        <v-layout wrap>
                                            <v-flex xs12 sm12 md12>
                                                <v-autocomplete 
                                                    v-model="idrubro"
                                                    clearable 
                                                    :items="rubros" 
                                                    label="Rubro"
                                                    :search-input.sync="searchr" 
                                                >
                                                </v-autocomplete>
                                            </v-flex>
                                            <v-flex xs8 sm8 md8>
                                                <v-autocomplete 
                                                    v-model="idproveedor"
                                                    clearable 
                                                    :items="proveedores" 
                                                    label="Proveedor"
                                                    :search-input.sync="searchp" 
                                                >
                                                </v-autocomplete>
                                            </v-flex>
                                            <v-flex xs4 sm4 md4>
                                                <v-text-field v-model="importe"
                                                    label="Importe"
                                                    type="number"
                                                    >
                                                </v-text-field>                                               
                                            </v-flex>
                                            <v-flex xs12 sm12 md12>
                                                <v-text-field v-model="detalle"
                                                    label="Detalle"
                                                    type="text"
                                                    >
                                                </v-text-field>                                               
                                            </v-flex>
                                            <v-flex xs12 sm12 md12 v-show="valida">
                                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </template>
                                </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click.native="closeForm">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>                            
                        <v-dialog v-model="adModal" max-width="300">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Sol.Cheque?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Sol.Cheque?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la asignación de Garantia {{ adNombre }}
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
                        <v-data-table
                        :headers="headersDetalle"
                        :items="garantias"
                        class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td class="justify-center layout px-20">
                                    <v-icon
                                    small
                                    class="mr-2"
                                    @click="editDetailItem(props.item)"
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
                                <td class="text-xs-center">{{ props.item.numorden }}</td>
                                <td>{{ props.item.rubro }}</td>
                                <td>{{ props.item.proveedor }}</td>
                                <td>{{ formatPrice(props.item.importe) }}</td>
                                <td>{{ props.item.banco }}</td>
                                <td class="text-xs-center">{{ props.item.numcheque }}</td>
                                <td class="text-xs-center">{{ props.item.feccheque?props.item.feccheque.substr(0, 10):props.item.feccheque }}</td>
                                <td class="text-xs-center">{{ props.item.fecvencimiento?props.item.fecvencimiento.substr(0, 10):props.item.fecvencimiento }}</td>
                                <td class="justify-center layout px-0">
                                    <div v-if="props.item.entregado">
                                        <span class="blue--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">No</span>
                                    </div>
                                </td>
                                <td>{{ props.item.detalle }}</td>
                                <td class="justify-center layout px-0">
                                    <div v-if="props.item.rendido">
                                        <span class="blue--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">No</span>
                                    </div>
                                </td>
                                <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                                <td>{{ props.item.fecalta.substr(0, 16) }}</td>
                                <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                                <td>{{ props.item.fecumod.substr(0, 16) }}</td>
                                <td class="justify-center layout px-0">
                                    <div v-if="props.item.activo">
                                        <span class="blue--text">Activo</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">Inactivo</span>
                                    </div>
                                </td>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>                
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark class="mb-2" @click.native="createDetail">Nuevo</v-btn>
                        <v-btn color="success" dark class="mb-2" @click.native="closeDetail">Salir</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-data-table
                :headers="headers"
                :items="proyectos"
                :search="search"
                class="elevation-1"
                >
                <template v-if="!props.item.cierreprod" slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editMasterItem(props.item)"
                        >
                        tab
                        </v-icon>
                    </td>
                    <td class="text-xs-center"> {{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.fecadjudicacion.substr(0, 10) }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listarMaster">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import moment from 'moment'    
    export default {
        data: () => {
            return {
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                menu1: false,
                proyectos:[],
                garantias:[],
                rubros:[],
                proveedores:[],
                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
                // Detail    
                idgarantia:'',
                numorden:'',
                idrubro:'',
                idproveedor:'',
                importe:0,
                detalle:'',
                idbanco:'',
                numcheque:'',
                feccheque:'',
                fecvencimiento:'',
                entregado:false,
                rendido:false,
                fhrendido:'',
                iduseralta : '',
                fecalta : '',
                iduserumod : '',
                fecumod : '',
                activo: '',
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Tipo de produccióm', value: 'tipoprod', sortable: true },
                    { text: 'Fecha Adjudicación', value: 'fecadjudicacion', sortable: true }   
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Garantia', value: 'numorden', sortable: true },
                    { text: 'Descripcion del Rubro', value: 'rubro', sortable: true },
                    { text: 'Nombre del Proveedor', value: 'proveedor', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Banco', value: 'banco', sortable: true },
                    { text: '#Cheque', value: 'numcheque'},
                    { text: 'Fecha Cheque', value: 'feccheque', sortable: true },
                    { text: 'Vencimiento', value: 'fecvencimiento', sortable: true },
                    { text: 'Entregado?', value: 'entregado', sortable: true },
                    { text: 'Detalle/Observaciones', value: 'detalle', sortable: true },
                    { text: 'Rendidio?', value: 'rendido', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                                      
                ],
                search: '',
                searchr: '',
                searchp: '',
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
                    return this.editedIndex === -1 ? 'Nueva solicitud' : 'Actualizar solicitud'
                }                     
            },
            watch: {
                dialogForm (val) {
                val || this.closeForm()
                },
            },
            created () {
                this.listarMaster();
                this.select();
            },
            methods:{
                formatPrice(value) {
                        let val = (value/1).toFixed(2).replace('.', ',')
                        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    },
                listarMaster(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    //console.log(configuracion);
                    if (this.$store.state.usuario.rol =='Administrador' || this.$store.state.usuario.rol =='JefeAdministracion' ){
                        axios.get('api/Proyectos/ListarActivos',configuracion).then(function(response){
                            //console.log(response);
                            me.proyectos=response.data;
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    }else{
                        axios.get('api/Proyectos/Listaractivosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                            //console.log(response);
                            me.proyectos=response.data;
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });                    
                    }
                },
                listarDetail(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};      
                    //console.log(configuracion);
                    axios.get('api/Garantias/ListarProyecto/'+me.idproyecto,configuracion).then(function(response){
                        //console.log(response);
                        me.garantias=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                },
                select(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    var rubrosArray=[];
                    var proveedoresArray=[];
                    axios.get('api/Rubros/Select',configuracion).then(function(response){
                        rubrosArray=response.data;
                        rubrosArray.map(function(x){
                            me.rubros.push({text: x.orden + ': ' + x.rubroes, value: x.idrubro });
                        });
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });      
                    axios.get('api/Proveedores/Select',configuracion).then(function(response){
                        proveedoresArray=response.data;
                        proveedoresArray.map(function(x){
                            me.proveedores.push({text: x.razonsocial, value: x.idproveedor });
                        });
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });

                },
                editMasterItem (item) {
                    //console.log(item);                
                    this.idproyecto = item.idproyecto;
                    this.orden = item.orden;
                    this.proyecto = item.proyecto;
                    this.listarDetail();
                    this.dialog = true
                },
                editDetailItem (item) {
                    //console.log(item);
                    this.idgarantia = item.idgarantia;
                    this.numorden = item.numorden;
                    this.idrubro = item.idrubro;
                    this.idproveedor = item.idproveedor;
                    this.detalle = item.detalle;
                    this.importe = item.importe;
                    this.idbanco = item.idbanco;
                    this.numcheque = item.numcheque;
                    this.idcheque = item.idcheque;
                    this.feccheque = item.feccheque?item.feccheque.substr(0, 10):'';
                    this.fecvencimiento = item.fecvencimiento?item.fecvencimiento.substr(0, 10):'';
                    this.entregado = item.entregado;
                    this.rendido = item.rendido;
                    this.iduseralta = item.iduseralta;
                    this.fecalta = item.fecalta;
                    this.iduserumod = item.iduserumod;
                    this.fecumod = item.fecumod;
                    this.editedIndex=1;
                    this.dialogForm = true
                },
                createDetail(){
                    this.limpiarDetail();
                    this.editIndex=-1;
                    this.dialogForm = true;
                },          
                closeDetail () {
                    this.dialog = false;
                    this.limpiarMaster();
                },
                closeForm () {
                    this.dialogForm = false;
                    this.validaMensaje = [];
                    this.limpiarDetail();
                },
                limpiarMaster(){
                    this.idproyecto = '';
                    this.orden = '';
                    this.proyecto = '';
                },
                limpiarDetail() {
                    this.idgarantia = '';
                    this.numorden='';
                    this.idrubro='';
                    this.idproveedor='';
                    this.importe=0;
                    this.detalle='';
                    this.idbanco='';
                    this.numcheque='';
                    this.feccheque='';
                    this.fecvencimiento='';
                    this.entregado=false;
                    this.rendido=false;
                    this.fhrendido='';
                    this.iduseralta = '';
                    this.fecalta = '';
                    this.iduserumod = '';
                    this.fecumod = '';
                    this.editedIndex=-1;
                    this.searchr="";
                },            
                guardar () {
                    if (this.validar()){
                        return;
                    }
                    var date = new Date();
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    let me=this;
                    if (this.editedIndex > -1) {
                        //Código para editar
                        //Código para guardar
                        //console.log(me);
                        axios.put('api/Garantias/Actualizar',{
                            'idgarantia':me.idgarantia,
                            'idproyecto':me.idproyecto,
                            'numorden':me.numorden,
                            'idrubro':me.idrubro,
                            'idproveedor':me.idproveedor,
                            'importe':me.importe,
                            'detalle':me.detalle,
                            'idbanco':me.idbanco,
                            'numcheque':me.numcheque,
                            'feccheque':me.feccheque,
                            'fecvencimiento':me.fecvencimiento,
                            'entrgado':me.entregado,
                            'rendido':me.rendido,
                            'fhrendido':me.fhrendido,
                            'iduseralta': me.iduseralta,
                            'fecalta': me.fecalta,
                            'iduserumod': me.$store.state.usuario.idusuario,
                            'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                        },configuracion).then(function(response){
                            me.closeForm();
                            me.listarDetail();
                            me.limpiarDetail();                        
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    } else {
                        //Código para guardar
                        axios.post('api/Garantias/Crear',{
                            'idproyecto':me.idproyecto,
                            'idrubro':me.idrubro,
                            'idproveedor':me.idproveedor,
                            'importe':me.importe,
                            'detalle':me.detalle,
                            'idbanco':me.idbanco,
                            'numcheque':me.numcheque,
                            'feccheque':me.feccheque,
                            'fecvencimiento':me.fecvencimiento,
                            'entrgado':me.entregado,
                            'rendido':me.rendido,
                            'fhrendido':me.fhrendido,
                            'iduseralta': me.$store.state.usuario.idusuario,
                        },configuracion).then(function(response){
                            me.closeForm();
                            me.listarDetail();
                            me.limpiarDetail();                        
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    }
                },
                validar(){
                    this.valida=0;
                    this.validaMensaje=[];
                    if (!this.idrubro){
                        this.validaMensaje.push("Ingrese un Rubro.");
                    }
                    if (!this.idproveedor){
                        this.validaMensaje.push("Ingrese una Proveedor.");
                    }
                    if (this.importe<=0){
                        this.validaMensaje.push("Ingrese un Importe positivo.");
                    }
                    if (this.validaMensaje.length){
                        this.valida=1;
                    }
                    return this.valida;
                },
                activarDesactivarMostrar(accion,item){
                    this.adModal=1;
                    this.adNombre=item.numorden+'/'+ item.proveedor;
                    this.adId=item.idgarantia;                
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
                    axios.put('api/Garantias/Activar/'+this.adId,{},configuracion).then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre="";
                        me.adId="";
                        me.listarDetail();                       
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                },
                desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Garantias/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listarDetail();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            }
        }        
    }
</script>
