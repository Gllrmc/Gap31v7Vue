<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Proveedores Stop Motion - Proyectos</v-toolbar-title>
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
                    <span class="headline">Proveedores Proyecto #{{this.orden}}: {{this.proyecto}} </span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="1000px">
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs8 sm8 md8>
                                            <v-autocomplete 
                                                v-model="iditem"
                                                clearable 
                                                :items = "items" 
                                                label = "Item"
                                                :search-input.sync="searchi" 
                                                @change="cambioItem()"
                                            >
                                            </v-autocomplete>                                             
                                        </v-flex>
                                        <v-flex xs4 sm4 md4>
                                            <v-select v-model="idsubitem"
                                            :items = "subitems" label = "Subitem">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs8 sm8 md8>
                                            <v-autocomplete 
                                                v-model="idproveedor"
                                                :items = "proveedores" 
                                                clearable 
                                                :search-input.sync="searchp" 
                                                label = "Proveedor">
                                            </v-autocomplete>
                                        </v-flex>
                                        <v-flex xs4 sm4 md4>
                                            <v-text-field
                                                v-model="tarifadiaria"
                                                label="Tarifa Diaria (AR$)"
                                                type="number"
                                            >
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
                                    <v-btn color="blue darken-1" flat @click.native="closeForm">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>                            
                        <v-dialog v-model="adModal" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Recurso?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Recurso?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la asignación del Recurso {{ adNombre }}
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
                        :items="proveedormotions"
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
                                <td class="text-xs-center">{{ props.item.itemorden }}</td>
                                <td>{{ props.item.itemes }}</td>
                                <td class="text-xs-center">{{ props.item.subitemorden }}</td>
                                <td>{{ props.item.subitemes }}</td>
                                <td>{{ props.item.razonsocial }}</td>
                                <td class="text-xs-center">{{ props.item.cuit }}</td>
                                <td>{{ props.item.tarifadiaria }}</td>
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
    export default {
        data: () => {
            return {
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                proyectos:[],
                proveedores:[],
                items:[],
                subitems:[],
                allsubitems:[],
                proveedormotions:[],
                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
                // Detail                    
                idproveedormotion: '',
                iditem: '',
                itemorden: '',
                itemes: '',
                itemeen: '',
                idsubitem: '',
                subitemorden: '',
                subitemes: '',
                subitemen: '',
                idproveedor: '',
                razonsocial: '',
                cuit: '',
                tarifadiaria: '',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Tipo de producción', value: 'tipoprod', sortable: true },
                    { text: 'Fecha Adjudicación', value: 'fecadjudicacion', sortable: true }   
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Item', value: 'ordenitem', sortable: true },
                    { text: 'Item', value: 'itemes', sortable: true },
                    { text: '#Subitem', value: 'ordensubitem', sortable: true },
                    { text: 'Subitem', value: 'subitemes', sortable: true },
                    { text: 'Razon Social', value: 'razonsocial', sortable: true },
                    { text: 'CUIT', value: 'cuit', sortable: true },
                    { text: 'Tarifa Diaria', value: 'tarifadiaria', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                                      
                ],                  
                search: '',
                searchi: '',
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
                    return this.editedIndex === -1 ? 'Nuevo staff' : 'Actualizar staff'
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
                }else if (this.$store.state.usuario.rol =='ExecutiveProducer'){
                    axios.get('api/Proyectos/Listaractivosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.proyectos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });                    
                } else {
                    axios.get('api/Proyectos/Listaractivosusuariovivo/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
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
                axios.get('api/Proveedormotions/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    me.proveedormotions=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var itemsArray=[];
                var proveedoresArray=[];
                var allsubitemsArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Items/Selectmotion',configuracion).then(function(response){
                    //console.log(response);
                    itemsArray=response.data;
                    itemsArray.map(function(x){
                        me.items.push({ text: x.item, value: x.iditem, vivo: x.vivo, post: x.post, conf: x.conf });
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Proveedores/Select',configuracion).then(function(response){
                    //console.log(response);
                    proveedoresArray=response.data;
                    proveedoresArray.map(function(x){
                        me.proveedores.push({text: x.razonsocial + '/CUIT:' + x.cuit, value:x.idproveedor});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
                axios.get('api/Subitems/Select',configuracion).then(function(response){
                    allsubitemsArray=response.data;
                    allsubitemsArray.map(function(x){
                        me.allsubitems.push({text: x.orden+': '+ x.subitemes, value: x.idsubitem, id: x.iditem });
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            cambioItem(){
                this.idsubitem='';
                this.selectSubitems();
            },
            selectSubitems(){
                let me=this;
                me.subitems = me.allsubitems.filter(x => x.id===me.iditem);
                if (me.subitems.length===1){
                    me.idsubitem=me.subitems[0].value;
                }
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
                this.idproveedormotion = item.idproveedormotion;
                this.iditem = item.iditem;
                this.selectSubitems();                
                this.idsubitem = item.idsubitem;
                this.idproveedor = item.idproveedor;
                this.tarifadiaria = item.tarifadiaria;
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
                this.idproveedormotion= '';
                this.iditem= '';
                this.itemorden= '';
                this.itemes= '';
                this.itemeen= '';
                this.idsubitem= '';
                this.subitemorden= '';
                this.subitemes= '';
                this.subitemen= '';
                this.idproveedor= '';
                this.razonsocial= '';
                this.cuit= '';
                this.tarifadiaria= '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.editedIndex=-1;
                this.searchi = "";
                this.searchp = "";
            },            
            guardar () {
                if (this.validar()){
                    return;
                }
                let me=this;
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    //console.log(me);
                    axios.put('api/Proveedormotions/Actualizar',{
                        'idproveedormotion': me.idproveedormotion,
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'idproveedor': me.idproveedor,
                        'tarifadiaria': me.tarifadiaria,
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
                    //console.log(me);
                    axios.post('api/Proveedormotions/Crear',{
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'idproveedor': me.idproveedor,
                        'tarifadiaria': me.tarifadiaria,
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
                if (!this.iditem){
                    this.validaMensaje.push("Ingrese un #item.");
                }
                if (!this.idsubitem){
                    this.validaMensaje.push("Ingrese un #subitem.");
                }
                if (!this.idproveedor){
                    this.validaMensaje.push("Ingrese un Proveedor.");
                }
                if (!this.tarifadiaria || !this.tarifadiaria>0){
                    this.validaMensaje.push("Ingrese un Tarifa válida.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.itemorden+':'+item.itemes+'/'+item.razonsocial;
                this.adId=item.idproveedormotion;                
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
                axios.put('api/Proveedormotions/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Proveedormotions/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
