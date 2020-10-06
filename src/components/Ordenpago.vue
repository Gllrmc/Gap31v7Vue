<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ordenes de Pago - Proyectos</v-toolbar-title>
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
                <v-text-field class="text-xs-center" v-model="search" clearable append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-dialog v-model="dialog" max-width="1500px" persistent>
                <v-card>
                    <v-card-title>
                    <span class="headline">Orden de Pago para Proyecto #{{orden}}: {{proyecto}} </span>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="searchd" clearable append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark class="mb-2" @click.native="createDetail">Nuevo</v-btn>
                        <v-btn color="success" dark class="mb-2" @click.native="closeDetail">Salir</v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="1200px" persistent>
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click.native="closeForm">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" v-if="pagado==false || $store.state.usuario.rol =='Administrador' || $store.state.usuario.rol =='JefeAdministracion'" flat @click.native="guardar">Guardar</v-btn>
                                </v-card-actions>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs4 sm4 md4>
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
                                                :disabled="pagado"
                                                :items = "subitems" 
                                                label = "Subitems">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs3 sm3 md3>
                                                <v-autocomplete 
                                                    v-model="idproveedor" 
                                                    :disabled="pagado"
                                                    clearable
                                                    @change="selectAlternativapagos"
                                                    :items="proveedores"
                                                    :search-input.sync="searchp" 
                                                    label="Proveedor">
                                                </v-autocomplete>
                                            </v-flex>
                                            <v-flex xs3 sm3 md3>
                                                <v-select v-model="idalternativapago"
                                                :disabled="pagado"
                                                :items = "alternativapagos" 
                                                label = "Beneficiario">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs2 sm2 md2>
                                                <v-select v-model="tipocomprobante"
                                                :disabled="pagado"
                                                :items = "tipocomprobantes" 
                                                label = "Tipo">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs2 sm2 md2>
                                                <v-text-field 
                                                    v-model="numcomprobante" 
                                                    label="Comprobante" 
                                                    :disabled="pagado">
                                                </v-text-field>
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
                                                                :disabled="pagado"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="feccomprobante" @input="menu1 = false"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </template>
                                            <v-flex xs2 sm2 md2>
                                                <v-text-field 
                                                    type="number" 
                                                    v-model="impsiniva"  
                                                    prefix="$" 
                                                    :disabled="pagado"
                                                    label="Imp.Sin IVA"
                                                    @change="tipocomprobante=='04'||tipocomprobante=='02'||tipocomprobante=='05'?imptotal=impsiniva:imptotal=imptotal">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs2 sm2 md2>
                                                <v-text-field 
                                                    type="number" 
                                                    v-model="imptotal" 
                                                    prefix="$"
                                                    :disabled="pagado" 
                                                    label="Imp.Total"
                                                    @change="tipocomprobante=='04'||tipocomprobante=='02'||tipocomprobante=='05'?impsiniva=imptotal:impsiniva=impsiniva">
                                                </v-text-field>
                                            </v-flex>
                                            <template>
                                                <v-flex xs2 sm2 md2>
                                                    <v-menu
                                                        v-model="menu2"
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
                                                                v-model="fecpago"
                                                                label="Fecha Pago"
                                                                prepend-icon="event"
                                                                readonly
                                                                v-on="on"
                                                                :disabled="pagado"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker 
                                                            v-model="fecpago"
                                                            :min = "feccomprobante" 
                                                            @input="menu2 = false">
                                                        </v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </template> 
                                            <v-flex xs2 sm2 md2>
                                                <v-text-field 
                                                    v-model="cuentagcom" 
                                                    disabled 
                                                    label="Cuenta Gcom"
                                                    >
                                                </v-text-field>
                                            </v-flex>                                            
                                            <v-flex xs12>
                                                <form enctype="multipart/form-data">
                                                    <div class="field">
                                                        <label for="file" class="label"></label>
                                                        <input 
                                                        style="display:none" 
                                                        type="file"
                                                        accept="application/pdf"
                                                        @change="onFileSelected($event.target.files)"
                                                        ref="fileInput"/>
                                                    </div>
                                                        <v-btn v-if="pagado==false || $store.state.usuario.rol =='Administrador' || $store.state.usuario.rol =='JefeAdministracion'" @click="$refs.fileInput.click()">Buscar</v-btn>
                                                        <v-btn v-if="pdfcomprobantefac" @click="onSaveAs(pdfcomprobantefac)">Desc Fac</v-btn>
                                                        <v-btn v-if="pdfcomprobantepago" @click="onSaveAs(pdfcomprobantepago)">Desc Pago</v-btn>
                                                        <v-btn v-if="pdfcertificado1" @click="onSaveAs(pdfcertificado1)">Desc Cer#1</v-btn>
                                                        <v-btn v-if="pdfcertificado2" @click="onSaveAs(pdfcertificado2)">Desc Cer#2</v-btn>
                                                        <v-btn v-if="pdfcertificado3" @click="onSaveAs(pdfcertificado3)">Desc Cer#3</v-btn>
                                                        <v-btn v-if="pdfcertificado4" @click="onSaveAs(pdfcertificado4)">Desc Cer#4</v-btn>
                                                </form> 
                                            </v-flex>
                                            <v-flex xs12>
                                                <div>       
                                                <canvas id="the-canvas" style="border:1px  solid black"></canvas>
                                                </div>
                                            </v-flex>                                            
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Orden de Pago?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Orden de Pago?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la Orden de Pago de {{ adNombre }}
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
                            :items="ordenpagos"
                            :search="searchd"
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
                                    <v-icon v-if="props.item.pagado===false && ($store.state.usuario.rol =='Administrador' || $store.state.usuario.rol =='JefeAdministracion')"
                                    small
                                    @click="deleteItem(props.item)"
                                    >
                                    delete
                                    </v-icon>
                                    <template v-if="props.item.pagado===false">
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
                                    </template>
                                </td>
                                <td>{{ props.item.idordenpago }}</td>
                                <td>{{ props.item.itemorden }}</td>
                                <td>{{ props.item.itemes }}</td>
                                <td>{{ props.item.subitemorden }}</td>
                                <td>{{ props.item.subitemes }}</td>
                                <td>{{ props.item.proveedor }}</td>
                                <td>{{ props.item.feccomprobante.substr(0, 10) }}</td>
                                <td>{{ tipocomprobantes.find(x => x.value===props.item.tipocomprobante ).text }}</td>
                                <td>{{ props.item.numcomprobante }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.imptotal) }}</td>
                                <td>{{ props.item.fecpago.substr(0, 10) }}</td>
                                <td class="justify-center">
                                    <div v-if="props.item.pagado">
                                        <span class="blue--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">No</span>
                                    </div>
                                </td>
                                <td>{{ props.item.notas.substr(0, 20) }}</td>
                                <td>{{ props.item.pdfcomprobantefac }}</td>
                                <td>{{ props.item.pdfcomprobantepago }}</td>
                                <td>{{ props.item.pdfcertificado1 }}</td>
                                <td>{{ props.item.pdfcertificado2 }}</td>
                                <td>{{ props.item.pdfcertificado3 }}</td>
                                <td>{{ props.item.pdfcertificado4 }}</td>                                
                                <td class="justify-center ">
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
                            <strong>Total Ordenes: </strong>$ {{totalPagado=(calcularTotal).toFixed(2)}}
                        </v-flex>
                    </v-card-text>
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
                    <td>{{ props.item.ars1usd }}</td>
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
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                fd: new FormData,
                originalfacguid: '',
                guid: '',                
                page: 1,
                // Arrays
                allitems: [],
                items: [],
                subitems: [],
                allsubitems:[],
                proveedores: [],
                proyectos:[],
                ordenpagos:[],
                resultado:[],
                // allordenpagos:[],
                alternativapagos:[],
                allalternativapagos:[],
                usuarioproyectos:[],
                // Detail
                idordenpago: '',
                iditem: '',
                idsubitem: '',
                idproveedor: '',
                proveeedor: '',
                idalternativapago: '',
                feccomprobante: '',
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
                impsiniva: 0,
                imptotal: 0,
                fecpago: '',
                cuentagcom: '',
                pdfcomprobantefac:'',                   
                pagado: false,
                fecpagado: '',
                pdfcomprobantepago: '',
                pdfcertificado1: '',
                pdfcertificado2: '',
                pdfcertificado3: '',
                pdfcertificado4: '',                    
                notas: '',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
                menu1: false,
                menu2: false,
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Tipo de producción', value: 'tipoprod', sortable: true },
                    { text: 'Fecha Adjudicación', value: 'fecadjudicacion', sortable: true },
                    { text: 'Tipo de cambio', value: 'ars1usd', sortable: true },
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Id', value: 'idordenpago', sortable: true },
                    { text: '#Item', value: 'itemorden', sortable: true },
                    { text: 'Item', value: 'itemes', sortable: true },
                    { text: '#Subitem', value: 'subitemorden', sortable: true },
                    { text: 'Subitem', value: 'subitemes', sortable: true },
                    { text: 'Proveedor', value: 'proveedor', sortable: true },
                    { text: 'Fecha Cbte', value: 'feccomprobante', sortable: true },
                    { text: 'Cbte', value: 'tipocomprobante', sortable: true },
                    { text: '#Cbte', value: 'numcomprobante', sortable: true },
                    { text: 'Imp.Total', value: 'imptotal', sortable: true },
                    { text: 'Fecha Pago', value: 'fecpago', sortable: true },
                    { text: 'Pagado', value: 'pagado', sortable: true },
                    { text: 'Notas', value: 'notas', sortable: true },
                    { text: 'Fac guid', value: 'pdfcomprobantefac', sortable: true },
                    { text: 'Pago guid', value: 'pdfcomprobantepago', sortable: true },
                    { text: 'Cer#1 guid', value: 'pdfcertificado1', sortable: true },
                    { text: 'Cer#2 guid', value: 'pdfcertificado2', sortable: true },
                    { text: 'Cer#3 guid', value: 'pdfcertificado3', sortable: true },
                    { text: 'Cer#4 guid', value: 'pdfcertificado4', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  },                                    
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],
                totalPagado: 0,                 
                search: '',
                searchd: '',
                searchi: '',
                searchp: '',
                editedIndex: -1,
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
                    return this.editedIndex === -1 ? 'Nuevo Orden de Pago' : 'Actualizar Orden de Pago'
                },
                calcularTotal:function(){
                        var subtotal=0.0;
                        for(var i=0;i<this.ordenpagos.length;i++){
                            subtotal+=(this.ordenpagos[i].activo?this.ordenpagos[i].imptotal:0);
                        }
                        return subtotal;
                    },                       
                },
            watch: {
                dialogForm (val) {
                val || this.closeForm()
                }
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
                axios.get('api/Ordenpagos/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    // console.log(response);
                    me.ordenpagos=response.data;
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
                var allsubitemsArray=[];
                var proveedoresArray=[];
                var usuarioproyectosArray=[];
                var allalternativapagosArray=[];
                axios.get('api/Items/Select',configuracion).then(function(response){
                    allitemsArray=response.data;
                    allitemsArray.map(function(x){
                        me.allitems.push({text: x.item, value: x.iditem, vivo: x.vivo, post: x.post, conf: x.conf, cuenta:x.cuentagcom });
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
                axios.get('api/Usuarioproyectos/SelectDeUsuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
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
                axios.get('api/Alternativapagos/Select',configuracion).then(function(response){
                    //console.log(me.idproveedor, response.data);
                    allalternativapagosArray=response.data;
                    allalternativapagosArray.map(function(x){
                    me.allalternativapagos.push({text: x.orden + ': '+ (( x.cbu ) ? (x.banco + ' ' + x.cbu + ' ' + x.alias  ) : (x.beneficiario + ' ' + x.cuitcuil)), value: x.idalternativapago, id: x.idproveedor });
                });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            cambioItem(){
                this.cuentagcom = this.iditem?this.allitems.find(c => c.value === this.iditem).cuenta:"";
                this.selectSubitems();
            },            
            selectSubitems(){
                let me=this;
                me.idsubitem='';
                me.subitems = me.allsubitems.filter(x => x.id===me.iditem);
                if (me.subitems.length===1){
                    me.idsubitem=me.subitems[0].value;
                }
            },
            selectAlternativapagos(){
                let me=this;
                me.alternativapagos = me.allalternativapagos.filter(x => x.id===me.idproveedor);
                if (me.alternativapagos.length===1){
                    me.idalternativapago=me.alternativapagos[0].value;
                }
            },
            editMasterItem (item) {
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.producto = item.producto;
                this.fecadjudicacion = item.fecadjudicacion.substr(0, 10);
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.filtrarItems();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idordenpago = item.idordenpago;
                this.idproyecto = item.idproyecto;
                this.iditem = item.iditem;
                this.selectSubitems();
                this.idsubitem = item.idsubitem;
                this.idproveedor=item.idproveedor;
                this.selectAlternativapagos();
                this.idalternativapago=item.idalternativapago;
                this.tipocomprobante = item.tipocomprobante;
                this.numcomprobante = item.numcomprobante;
                this.feccomprobante = item.feccomprobante.substr(0, 10);
                this.impsiniva = item.impsiniva;
                this.imptotal = item.imptotal;
                this.fecpago = item.fecpago.substr(0, 10);
                this.cuentagcom = item.iditem?this.allitems.find(c => c.value === item.iditem).cuenta:"";
                this.pdfcomprobantefac = item.pdfcomprobantefac;
                this.originalfacguid = item.pdfcomprobantefac;
                this.pdfcomprobantepago = item.pdfcomprobantepago;
                this.pdfcertificado1 = item.pdfcertificado1;
                this.pdfcertificado2 = item.pdfcertificado2;
                this.pdfcertificado3 = item.pdfcertificado3;
                this.pdfcertificado4 = item.pdfcertificado4;
                this.pagado = item.pagado;
                this.fecpagado = item.fecpagado;
                this.notas = item.notas;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.onDownload(this.pdfcomprobantefac);
                this.editedIndex=1;
                this.dialogForm = true
            },
            deleteItem (item) {
                var me=this;
                var resulta = confirm('Esta seguro de querer borrar el registro?');
                if (resulta) {
                    let header={"Authorization" : "Bearer " + me.$store.state.token};
                    let configuracion= {headers : header};
                    axios.delete('api/Ordenpagos/Eliminar/'+item.idordenpago,configuracion).then(function(response){
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
                this.producto = '';
                this.fecadjudicacion = '';
                this.ars1usd = '',               
                this.totalPagado = 0;
                this.search = '';
                this.searchd = '';
            },
            limpiarDetail() {
                this.idordenpago = '';
                this.iditem = '';
                this.idsubitem = '';
                this.idproveedor = '';
                this.idalternativapago = '',
                this.tipocomprobante = '';
                this.numcomprobante = '';
                this.feccomprobante = '';
                this.impsiniva = '';
                this.imptotal = '';
                this.fecpago = '';
                this.cuentagcom = '';
                this.pdfcomprobantefac = '';
                this.pagado = false;
                this.fecpagado = '';
                this.pdfcomprobantepago = '';
                this.pdfcertificado1 = '';
                this.pdfcertificado2 = '';
                this.pdfcertificado3 = '';
                this.pdfcertificado4 = '';
                this.notas = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.totalPagado=0;
                this.editedIndex=-1;
                this.alternativapagos=[];
                this.searchp = '';                
                this.searchi = '';
                this.searchd = '';
                this.onClear();
            },            
            guardar () {
                if (this.validar()){
                    return;
                }
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    if (this.pdfcomprobantefac && this.originalfacguid != this.pdfcomprobantefac ){
                        this.onDelete(this.originalfacguid);
                        this.originalfacguid='';
                        this.onUpload();
                    }
                    //Código para editar
                    //Código para guardar
                    let me=this;
                    // console.log(me);
                    axios.put('api/Ordenpagos/Actualizar',{
                        'idordenpago': me.idordenpago,
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'idproveedor': me.idproveedor,
                        'idalternativapago': me.idalternativapago,
                        'feccomprobante': me.feccomprobante,
                        'tipocomprobante': me.tipocomprobante,
                        'numcomprobante': me.numcomprobante,
                        'impsiniva': me.impsiniva,
                        'imptotal': me.imptotal,
                        'fecpago': me.fecpago,
                        'pdfcomprobantefac': me.pdfcomprobantefac,
                        'pagado': me.pagado,
                        'fecpagado': me.fecpagado,
                        'pdfcomprobantepago': me.pdfcomprobantepago,
                        'pdfcertificado1': me.pdfcertificado1,
                        'pdfcertificado2': me.pdfcertificado2,
                        'pdfcertificado3': me.pdfcertificado3,
                        'pdfcertificado4': me.pdfcertificado4,
                        'notas': me.notas,
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
                    axios.post('api/Ordenpagos/Crear',{
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'idproveedor': me.idproveedor,
                        'idalternativapago': me.idalternativapago,
                        'feccomprobante': me.feccomprobante,
                        'tipocomprobante': me.tipocomprobante,
                        'numcomprobante': me.numcomprobante,
                        'impsiniva': me.impsiniva,
                        'imptotal': me.imptotal,
                        'fecpago': me.fecpago,
                        'pdfcomprobantefac': me.pdfcomprobantefac,
                        'pagado': false,
                        'fecpagado': me.fecpagado,
                        'pdfcomprobantepago': me.pdfcomprobantepago,
                        'pdfcertificado1': me.pdfcertificado1,
                        'pdfcertificado2': me.pdfcertificado2,
                        'pdfcertificado3': me.pdfcertificado3,
                        'pdfcertificado4': me.pdfcertificado4,
                        'notas': me.notas,
                        'iduseralta': me.$store.state.usuario.idusuario
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
                if (!this.iditem){
                    this.validaMensaje.push("Ingrese un item.");
                }
                if (!this.idsubitem){
                    this.validaMensaje.push("Ingrese un subitem.");
                }
                if (!this.idalternativapago){
                    this.validaMensaje.push("Ingrese un beneficiario.");
                }
                if (!this.idproveedor){
                    this.validaMensaje.push("Ingrese un proveedor.");
                }
                if (!this.feccomprobante){
                    this.validaMensaje.push("Ingrese una fecha de comprobante.");
                }
                if (!this.tipocomprobante){
                    this.validaMensaje.push("Seleccione un Tipo de Comprobante.");
                }
                if (!this.numcomprobante){
                    this.validaMensaje.push("Ingrese un Numero de Comprobante.");
                }
                if (this.numcomprobante.length>12){
                    this.validaMensaje.push("El Numero de Comprobante no puede ser mayor a 12 posiciones.");
                }                
                if (!this.fecpago){
                    this.validaMensaje.push("Ingrese una fecha de pago.");
                }
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
                this.adNombre=this.tipocomprobantes.find(x => x.value===item.tipocomprobante).text + ' ' + item.numcomprobante + ' $ ' + item.imptotal;
                this.adId=item.idordenpago;                
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
                axios.put('api/Ordenpagos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Ordenpagos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
                this.pdfcomprobantefac = this.guid;
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
                    this.pdfcomprobantefac = '';
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
            onSaveAs(file){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};        
                axios.get('api/Express/DownloadFile/'+file,configuracion)
                .then(res => {
                //console.log(res.data)
                var FileSaver = require('file-saver');
                var pdfData = atob(res.data)
                var byteNumbers = new Array(pdfData.length);
                for (var i = 0 ; i < pdfData.length; i++){
                    byteNumbers[i] = pdfData.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray],{type: "application/pdf" });
                FileSaver.saveAs(blob, 'Export.pdf');
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
        }        
    }
</script>