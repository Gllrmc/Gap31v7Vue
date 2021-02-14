<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Rendición de Fondos - Distribuciones</v-toolbar-title>
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
            <v-dialog v-model="dialog" max-width="1500px" persistent>
                <v-card>
                    <v-card-title>
                        <span class="headline">Rendicion Fondos Proyecto #{{orden}}: {{proyecto}} | #Pedido: {{numpedido}} | Responsable:{{usuario}}</span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="1200px" persistent>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>           
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click.native="closeForm">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                                </v-card-actions>                                
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs5 sm5 md5>
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
                                            <v-flex xs2 sm2 md2>
                                                <v-select v-model="idsubitem"
                                                :items = "subitems" label = "Subitems">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs5 sm5 md5>
                                                <v-select v-model="idproveedor"
                                                :items = "proveedores" label = "Proveedor" clearable
                                                @change="asignarCbte(idproveedor)">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs2 sm2 md2>
                                                <v-select v-model="tipocomprobante"
                                                :items = "tipocomprobantes" label = "Tipo"
                                                :disabled='true'>
                                                </v-select>
                                            </v-flex>
                                            <template>
                                                <v-flex xs2 sm2 md2>
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
                                                                v-model="feccomprobante"
                                                                label="Fecha Cbte"
                                                                prepend-icon="event"
                                                                readonly
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="feccomprobante" @input="menu1 = false"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </template>
                                            <!-- <v-flex xs2 sm2 md2>
                                                <v-text-field v-model="numcomprobante" label="Comprobante">
                                                </v-text-field>
                                            </v-flex> -->
                                            <v-flex xs2 sm2 md2>
                                                <v-text-field v-model="indiceinterno" label="# Cbte">
                                                </v-text-field>
                                            </v-flex>                                            
                                            <v-flex xs3 sm3 md3>
                                                <v-text-field 
                                                    type="number"  
                                                    v-model="impsiniva" 
                                                    prefix="$" 
                                                    label="Imp.Sin IVA"
                                                    @change="tipocomprobante=='04'||tipocomprobante=='02'||tipocomprobante=='05'?imptotal=impsiniva:imptotal=imptotal">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs3 sm3 md3>
                                                <v-text-field 
                                                    type="number" 
                                                    v-model="imptotal" 
                                                    prefix="$" 
                                                    label="Imp.Total"
                                                    @change="tipocomprobante=='04'||tipocomprobante=='02'||tipocomprobante=='05'?impsiniva=imptotal:impsiniva=impsiniva">
                                                </v-text-field>
                                            </v-flex>
                                            <!-- <v-flex xs12>
                                                <form enctype="multipart/form-data">
                                                    <div class="field">
                                                        <label for="file" class="label"></label>
                                                        <input 
                                                        style="display:none" 
                                                        type="file"
                                                        accept="application/pdf"
                                                        @change="onFileSelected($event.target.files)"
                                                        ref="fileInput"/>
                                                        <v-btn @click="$refs.fileInput.click()">Buscar PDF</v-btn>
                                                    </div>
                                                </form> 
                                            </v-flex> -->
                                            <!-- <v-flex xs12>
                                                <div>       
                                                <canvas id="the-canvas" style="border:1px  solid black"></canvas>
                                                </div>
                                            </v-flex> -->
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
                            </v-card>
                        </v-dialog>                            
                        <v-dialog v-model="adModal" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Comprobante?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Comprobante?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    el Comprobante {{ adNombre }}
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
                        :items="rendicionfondos"
                        class="elevation-1"
                        >
                            <template v-if="validateAccess(props.item.iditem)" slot="items" slot-scope="props">
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
                                <td>{{ props.item.idrendicionfondo }}</td>
                                <td>{{ props.item.itemorden }}</td>
                                <td>{{ props.item.itemes }}</td>
                                <td>{{ props.item.subitemorden }}</td>
                                <td>{{ props.item.subitemes }}</td>
                                <td>{{ props.item.proveedor }}</td>
                                <!-- <td>{{ props.item.tipocomprobante }}</td> -->
                                <!-- <td>{{ props.item.numcomprobante }}</td> -->
                                <td>{{ props.item.feccomprobante.substr(0, 10) }}</td>
                                <td>{{ props.item.indiceinterno }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.impsiniva) }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.imptotal) }}</td>
                                <td>{{ props.item.notas.substr(0, 20) }}</td>
                                <!-- <td>{{ props.item.pdfcomprobante }}</td>                                 -->
                                <td class="justify-center layout px-0">
                                    <div v-if="props.item.activo">
                                        <span class="blue--text">Activo</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">Inactivo</span>
                                    </div>
                                </td>
                                <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                                <td>{{ props.item.fecalta.substr(0, 16) }}</td>
                                <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                                <td>{{ props.item.fecumod.substr(0, 16) }}</td>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Proyecto: </strong>$ {{pad(formatPrice(totalProyecto=(CalcularTotalProy)),20,'*')}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Distribución: </strong>$ {{pad(formatPrice(totalDistribucion=(CalcularTotalDist)),20,'*')}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Rendido distribución: </strong>$ {{pad(formatPrice(totalRendicion=(calcularTotal)),20,'*')}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Pendiente distribución: </strong>$ {{pad(formatPrice(totalPendienteDist=(totalDistribucion-totalRendicion)),20,'*')}}
                        </v-flex>                        
                        <v-flex class="text-xs-right">
                            <strong>Pendiente Proyecto: </strong>$ {{pad(formatPrice(totalPendienteProy=(totalProyecto-calcularRendicionUsuario)),20,'*')}}
                        </v-flex>                        
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
                :items="distribucionfondos"
                :search="search"
                class="elevation-1"
                >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <template v-if="!props.item.devolucion">
                            <v-icon
                            small
                            class="mr-2"
                            @click="editMasterItem(props.item)"
                            >
                            tab
                            </v-icon>
                        </template>
                    </td>
                    <td class="text-xs-center"> {{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.numpedido }}</td>
                    <td>{{ props.item.usuario }}</td>
                    <td>{{ props.item.fecdistribucion.substr(0, 10) }}</td>
                    <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listarMaster">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.487/pdf.min.js"></script>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import pdfjsLib from 'pdfjs-dist';    
    export default {
        data: () => {
            return {
                totalPendienteDist:0,
                totalPendienteProy:0,
                totalRendicion:0,
                totalDistribucion:0,
                totalProyecto:0,
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                fd: new FormData,
                filename: '',
                filedelete: '',
                originalguid: '',
                guid: '',              
                // Arrays
                allitems: [],
                items: [],
                subitems: [],
                allsubitems: [],
                proveedores: [],
                distribucionfondos:[],
                rendicionfondos:[],
                rendicionproy:[],
                usuarioproyectos:[],
                // Detail
                idrendicionfondo: '',
                iddistribucionfondo: '',
                iditem: '',
                idsubitem: '',
                idproveedor: '',
                proveeedor: '',
                tipocomprobantes: [
                    {value: '01', text: 'Fc A'},
                    {value: '02', text: 'Fc B'},
                    {value: '03', text: 'Tk A'},
                    {value: '04', text: 'Tk B'},
                    {value: '05', text: 'Fc C'},
                    {value: '06', text: 'Fc M'},
                    {value: '07', text: 'Otro'}
                ],
                tipocomprobante: '',
                numcomprobante: '',
                feccomprobante: '',
                indiceinterno: '',
                impsiniva: 0,
                imptotal: 0,
                notas: '',
                pdfcomprobante:'',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                // Master
                iddistribucionfondo: '',
                idpedidofondo: '',
                idproyecto: '',
                orden: '',
                proyecto: '',
                numpedido: '',
                idusuario: '',
                usuario: '',
                fecdistribucion: '',
                importedistribucion: '',
                menu1: false,
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: '#Pedido', value: 'numpedido', sortable: true },                        
                    { text: 'Responsable Distribucion', value: 'usuario', sortable: true },
                    { text: 'Fecha Distribución', value: 'fecdistribucion', sortable: true },
                    { text: 'Importe', value: 'importedistribucion', sortable: true }
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Id', value: 'idrendicionfondo', sortable: true },
                    { text: '#Item', value: 'itemorden', sortable: true },
                    { text: 'Item descripción', value: 'itemes', sortable: true },
                    { text: '#Subitem', value: 'subitemorden', sortable: true },
                    { text: 'Subitem', value: 'subitemes', sortable: true },
                    { text: 'Nombre del Proveedor', value: 'proveedor', sortable: true },
                    //{ text: 'Cbte', value: 'tipocomprobante', sortable: true },
                    // { text: '#Cbte', value: 'numcomprobante', sortable: true },
                    { text: 'Fecha de comprobante', value: 'feccomprobante', sortable: true },
                    { text: '#Hoja', value: 'indiceinterno', sortable: true },
                    { text: 'Imp.s/IVA', value: 'impsiniva', sortable: true },
                    { text: 'Imp.Total', value: 'imptotal', sortable: true },
                    { text: 'Notas', value: 'notas', sortable: true },
                    //{ text: 'Fac guid', value: 'pdfcomprobante', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  },                                     
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],              
                search: '',
                searchi: '',
                editedIndex: -1,
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''                }
            },
            computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo comprobante' : 'Actualizar comprobante'
            },
            calcularTotal:function(){
                    var resultado=0.0;
                    for(var i=0;i<this.rendicionfondos.length;i++){
                        resultado=resultado+(this.rendicionfondos[i].activo?this.rendicionfondos[i].imptotal:0);
                    }
                    return resultado;
                },
            CalcularTotalDist:function(){
                    var resultado=0.0;
                    for(var i=0;i<this.distribucionfondos.length;i++){
                        if(this.distribucionfondos[i].idpedidofondo == this.idpedidofondo ){
                            resultado=resultado+(this.distribucionfondos[i].activo?this.distribucionfondos[i].importe:0);
                        }
                    }
                    return resultado;
                },
            CalcularTotalProy:function(){
                    var resultado=0.0;
                    for(var i=0;i<this.distribucionfondos.length;i++){
                        if(this.distribucionfondos[i].idusuario == this.idusuario ){
                            resultado=resultado+(this.distribucionfondos[i].activo?this.distribucionfondos[i].importe:0);
                        }
                    }
                    return resultado;
                },
            calcularRendicionUsuario:function(){
                    var resultado=0.0;
                    for(var i=0;i<this.rendicionproy.length;i++){
                        if(this.rendicionproy[i].idresponsable == this.idusuario ){
                            resultado=resultado+(this.rendicionproy[i].activo?this.rendicionproy[i].imptotal:0);
                        }
                    }
                    return resultado;
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
                validateAccess(element){
                    var q = false;
                    for (let i=0; i<this.items.length; i++){
                        if (this.items[i]["value"]===element){
                            q = true;
                            break
                        }
                    }
                    return(q)
                },
                pad(n, width, z) {
                    z = z || '0';
                    n = n + '';
                    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
                },
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
                        axios.get('api/Distribucionfondos/ListarActivos',configuracion).then(function(response){
                            //console.log(response);
                            me.distribucionfondos=response.data;
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    }else if (this.$store.state.usuario.rol =='ExecutiveProducer' || this.$store.state.usuario.rol =='LineProducer' || this.$store.state.usuario.rol =='ChiefProducer' ){
                        axios.get('api/Distribucionfondos/ListarActivosResponsable/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                            //console.log(response);
                            me.distribucionfondos=response.data;
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    }else{
                        axios.get('api/Distribucionfondos/ListarActivosUsuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                            //console.log(response);
                            me.distribucionfondos=response.data;
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    }                  
                },
                filtrarItems(){
                    let me=this;
                    // Filtrar Items Seleccionables por Rol / Usuarioproyecto
                    me.items=[];
                    if (this.$store.state.usuario.rol =='AsistProduccion' || this.$store.state.usuario.rol =='ChiefProducer' || this.$store.state.usuario.rol =='LineProducer' || this.$store.state.usuario.rol =='AsistGeneral'){
                        var usuario = +me.$store.state.usuario.idusuario;
                        var post = me.usuarioproyectos.find(x => x.idproyecto===this.idproyecto && x.idusuario===usuario )["post"];
                        var vivo = me.usuarioproyectos.find(x => x.idproyecto===this.idproyecto && x.idusuario===usuario )["vivo"];
                        var conf = me.usuarioproyectos.find(x => x.idproyecto===this.idproyecto && x.idusuario===usuario )["confidencial"];
                        me.items = me.allitems.filter(x => (x.post===false && x.vivo===false && x.conf===false) ||
                                            (x.post===true && x.post===post) || (x.vivo===true && x.vivo===vivo) || 
                                            (x.conf===true && x.conf===conf) );
                    }
                    else{
                        me.items = me.allitems;
                    }
                },            
                listarDetail(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    //console.log(configuracion);
                    axios.get('api/Rendicionfondos/ListarDistribucionfondo/'+this.iddistribucionfondo,configuracion).then(function(response){
                        // console.log(response);
                        me.rendicionfondos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                    axios.get('api/Rendicionfondos/ListarRendicionProy/'+this.idproyecto,configuracion).then(function(response){
                        // console.log(response);
                        me.rendicionproy=response.data;
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
                    var allitemsArray=[];
                    var proveedoresArray=[];
                    var usuarioproyectosArray=[];
                    var allsubitemsArray=[];
                    axios.get('api/Items/SelectGastos',configuracion).then(function(response){
                        allitemsArray=response.data;
                        allitemsArray.map(function(x){
                            me.allitems.push({text: x.item, value: x.iditem, vivo: x.vivo, post: x.post, conf: x.conf });
                        });
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                    axios.get('api/Proveedores/SelectGenerico',configuracion).then(function(response){
                        proveedoresArray=response.data;
                        proveedoresArray.map(function(x){
                            me.proveedores.push({text: x.razonsocial, value: x.idproveedor, tipocbte: x.tipocomprobantegenerico });
                        });
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                    axios.get('api/Usuarioproyectos/Select',configuracion).then(function(response){
                        usuarioproyectosArray=response.data;
                        usuarioproyectosArray.map(function(x){
                            me.usuarioproyectos.push({idusuarioproyecto: x.idusuarioproyecto, idusuario: x.idusuario, 
                                idproyecto: x.idproyecto, vivo: x.vivo, post: x.post, confidencial: x.confidencial });
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
                asignarCbte(id){
                    let me=this;
                    me.tipocomprobante = me.proveedores.find(x => x.value===id)["tipocbte"];
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
                    this.iddistribucionfondo = item.iddistribucionfondo;
                    this.idpedidofondo = item.idpedidofondo;
                    this.idusuario = item.idusuario;
                    this.idproyecto = item.idproyecto;
                    this.orden = item.orden,
                    this.proyecto = item.proyecto;
                    this.numpedido = item.numpedido;
                    this.usuario = item.usuario;
                    this.fecdistribucion = item.fecdistribucion.substr(0, 10);
                    this.importe = item.importe;
                    this.totalDistribucion = item.importe;
                    this.listarDetail();
                    this.filtrarItems();
                    this.dialog = true
                },
                editDetailItem (item) {
                    this.idrendicionfondo = item.idrendicionfondo;
                    this.iddistribucionfondo = item.iddistribucionfondo;
                    this.iditem = item.iditem;
                    this.selectSubitems();
                    this.idsubitem = item.idsubitem;
                    this.idproveedor=item.idproveedor;
                    this.tipocomprobante = item.tipocomprobante;
                    this.numcomprobante = item.numcomprobante;
                    this.feccomprobante = item.feccomprobante.substr(0, 10);
                    this.indiceinterno = item.indiceinterno;
                    this.impsiniva = item.impsiniva;
                    this.imptotal = item.imptotal;
                    this.notas = item.notas;
                    this.pdfcomprobante = item.pdfcomprobante;
                    this.originalguid = item.pdfcomprobante;
                    this.iduseralta = item.iduseralta;
                    this.fecalta = item.fecalta;
                    this.iduserumod = item.iduserumod;
                    this.fecumod = item.fecumod;
                    //this.onDownload(this.pdfcomprobante);
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
                    this.iddistribucionfondo = '';                
                    this.idproyecto = '';
                    this.orden = '';
                    this.proyecto = '';
                    this.numpedido = '';
                    this.idusuario = '';
                    this.usuario = '';
                    this.fecdistribucion = '';
                    this.importe = 0;
                    this.totalDistribucion = 0;                
                    this.totalRendicion = 0;
                    this.totalPendienteDist = 0;
                    this.totalPendienteProy = 0;
                },
                limpiarDetail() {
                    this.idrendicionfondo = '';
                    this.iditem = '';
                    this.idsubitem = '';
                    this.idproveedor = '';
                    this.tipocomprobante = '';
                    this.numcomprobante = '';
                    this.feccomprobante = '';
                    this.indiceinterno = '';
                    this.impsiniva = '';
                    this.imptotal = '';
                    this.notas = '';
                    this.pdfcomprobante = '';
                    this.iduseralta = '';
                    this.fecalta = '';
                    this.iduserumod = '';
                    this.fecumod = '';
                    this.totalRendicion=0;
                    this.totalPendienteDist = 0;
                    this.totalPendienteProy = 0;
                    this.editedIndex=-1;
                    this.searchi = "";
                    //this.onClear();                    
                },            
                guardar () {
                    if (this.validar()){
                        return;
                    }
                    var date = new Date();
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    if (this.editedIndex > -1) {
                        // if (this.pdfcomprobante && this.originalguid != this.pdfcomprobante ){
                        //     this.onDelete(this.originalguid);
                        //     this.originalguid='';
                        //     this.onUpload();
                        // }
                        //Código para editar
                        //Código para guardar
                        let me=this;
                        // console.log(me);
                        axios.put('api/Rendicionfondos/Actualizar',{
                            'idrendicionfondo': me.idrendicionfondo,
                            'iddistribucionfondo': me.iddistribucionfondo,
                            'iditem': me.iditem,
                            'idsubitem': me.idsubitem,
                            'idproveedor': me.idproveedor,
                            'tipocomprobante': me.tipocomprobante,
                            'numcomprobante': me.numcomprobante,
                            'feccomprobante': me.feccomprobante,
                            'indiceinterno': me.indiceinterno,
                            'impsiniva': me.impsiniva,
                            'imptotal': me.imptotal,
                            'notas': me.notas,
                            'pdfcomprobante': me.pdfcomprobante,
                            'iduseralta': me.iduseralta,
                            'fecalta': me.fecalta,
                            'iduserumod': me.$store.state.usuario.idusuario,
                            'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                        },configuracion).then(function(response){
                            me.closeForm();
                            me.limpiarDetail();                        
                            me.listarDetail();
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            console.log(error);
                        });
                    } else {
                        //Código para guardar
                        this.onUpload();
                        let me=this;
                        // console.log(me);
                        axios.post('api/Rendicionfondos/Crear',{
                            'iddistribucionfondo': me.iddistribucionfondo,
                            'iditem': me.iditem,
                            'idsubitem': me.idsubitem,
                            'idproveedor': me.idproveedor,
                            'tipocomprobante': me.tipocomprobante,
                            'numcomprobante': me.numcomprobante,
                            'feccomprobante': me.feccomprobante,
                            'indiceinterno': me.indiceinterno,
                            'impsiniva': me.impsiniva,
                            'imptotal': me.imptotal,
                            'notas': me.notas,
                            'pdfcomprobante': me.pdfcomprobante,
                            'iduseralta': me.$store.state.usuario.idusuario,
                        },configuracion).then(function(response){
                            me.closeForm();
                            me.limpiarDetail();                        
                            me.listarDetail();
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
                    if (!this.idusuario){
                        this.validaMensaje.push("Ingrese un usuario.");
                    }
                    if (!this.fecdistribucion){
                        this.validaMensaje.push("Ingrese una fecha de distribución de fondo.");
                    }
                    if (!this.tipocomprobante){
                        this.validaMensaje.push("Seleccione un Tipo de Comprobante.");
                    }
                    if (!this.indiceinterno){
                        this.validaMensaje.push("Ingrese un #Hoja o lugar de archivo.");
                    }                    
                    // if (this.numcomprobante.length>12){
                    //     this.validaMensaje.push("El Numero de Comprobante no puede ser mayor a 12 posiciones.");
                    // }
                    if (!this.impsiniva || Number(this.impsiniva) <= 0 ){
                        this.validaMensaje.push("Ingrese un importe neto de impuesto positivo.");
                    }
                    if (!this.imptotal || Number(this.imptotal) <= 0 ){
                        this.validaMensaje.push("Ingrese un importe total positivo.");
                    }
                    if (Number(this.imptotal) < Number(this.impsiniva) ){
                        this.validaMensaje.push("El importe sin IVA debe ser menor o igual que el importe total.");
                    }
                    if (this.validaMensaje.length){
                        this.valida=1;
                    }
                    return this.valida;
                },
                activarDesactivarMostrar(accion,item){
                    this.adModal=1;
                    this.adNombre=item.tipocomprobante + ' ' + item.numcomprobante + ' $ ' + item.imptotal;
                    this.adId=item.idrendicionfondo;                
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
                    axios.put('api/Rendicionfondos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                    axios.put('api/Rendicionfondos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
                onFileSelected(fileList){

                    var file = fileList[0];
                    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                    this.guid = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                    this.pdfcomprobante = this.guid;
                    this.fd.append("file", file, this.guid)

                    var fileReader = new FileReader();

                    fileReader.onload = function() {
                        var typedarray = new Uint8Array(this.result);                    

                        var loadingTask = pdfjsLib.getDocument(typedarray);

                        loadingTask.promise.then(function(pdf) {
                            console.log('PDF loaded');
                            
                            // Fetch the first page
                            var pageNumber = 1;
                            pdf.getPage(pageNumber).then(function(page) {
                                console.log('Page loaded');
                                
                                var scale = 1.2;
                                var viewport = page.getViewport({scale: scale});

                                // Prepare canvas using PDF page dimensions
                                var canvas = document.getElementById('the-canvas');
                                var context = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                // Render PDF page into canvas context
                                var renderContext = {
                                canvasContext: context,
                                viewport: viewport
                                };
                                var renderTask = page.render(renderContext);
                                renderTask.promise.then(function () {
                                console.log('Page rendered');
                                });
                            });
                            }, function (reason) {
                            // PDF loading error
                            console.error(reason);
                            }
                        );
                    };
                    fileReader.readAsArrayBuffer(file);
                },        
                async onUpload(){
                    let me=this;
                    let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                    await axios.post('api/Express/UploadFiles',this.fd,configuracion)
                        .then(res => {
                        console.log(res.data);
                        this.fd = new FormData;
                    }).catch(error => {
                        this.fd = new FormData;
                        this.dialog = false;
                        this.guid = '';
                        this.pdfcomprobante = '';
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);                        
                    });
                },
                onDownload(file){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};        
                    axios.get('api/Express/DownloadFile/'+file,configuracion)
                    .then(res => {
                    //console.log(res.data)
                    var pdfData = atob(res.data)
                    var loadingTask = pdfjsLib.getDocument({data: pdfData});

                    loadingTask.promise.then(function(pdf) {
                        console.log('PDF loaded');
                        
                        // Fetch the first page
                        var pageNumber = 1;
                        pdf.getPage(pageNumber).then(function(page) {
                            console.log('Page loaded');
                            
                            var scale = 1.2;
                            var viewport = page.getViewport({scale: scale});

                            // Prepare canvas using PDF page dimensions
                            var canvas = document.getElementById('the-canvas');
                            var context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            // Render PDF page into canvas context
                            var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                            };
                            var renderTask = page.render(renderContext);
                            renderTask.promise.then(function () {
                            console.log('Page rendered');
                            });
                        });
                        }, function (reason) {
                        // PDF loading error
                        console.error(reason);
                        });
                    }).catch(error => {
                    console.log(error);
                    });
                },
                onClear(){
                    var canvas = document.getElementById('the-canvas');
                    var context = canvas.getContext("2d");
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    context.clearRect(0,0, canvas.width, canvas.height);
                },      
                onDelete(file){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};        
                    axios.delete('api/Express/DeleteFile/'+file,configuracion)
                    .then(res => {
                    console.log(res.data);
                    }).catch(error => {
                    console.log(error);
                    });
                }                
            }, 
        }       
</script>