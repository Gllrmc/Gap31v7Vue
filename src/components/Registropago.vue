<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Registro de Pago</v-toolbar-title>
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
            <v-dialog
                v-model="registrar"
                max-width="350"
                >
                <v-card>
                    <v-card-title class="headline">¿Deseas registrar el pago?</v-card-title>
                    <v-card-text>
                        Estas a punto de indicar que el registro de pago se ha completado.<br/> Esto significa que se han incluido todas las imágenes relacionados con el comprobante tratado.<br/> Se marcara el comprobante como pagado y saldrá de la lista de pendientes.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        color="blue darken-1"
                        flat
                        @click="registrar = false"
                        >
                        Cancelar
                        </v-btn>
                        <v-btn
                        color="success"
                        flat
                        @click="registro"
                        >
                        Aceptar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogForm" max-width="1000px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Registro de Pago</span>
                    </v-card-title>            
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="closeForm">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                        <v-btn color="success" flat @click.native="registrar = true">Registrar</v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs6 sm6 md6>
                                    <v-select v-model="idproveedor" disabled
                                    :items = "proveedores" label = "Proveedor"
                                    @change="selectAlternativapagos()">                                                
                                    </v-select>
                                </v-flex>
                                <v-flex xs2 sm2 md2>
                                    <v-select v-model="tipocomprobante" disabled
                                    :items = "tipocomprobantes" label = "Tipo">
                                    </v-select>
                                </v-flex>
                                <v-flex xs2 sm2 md2>
                                    <v-text-field v-model="numcomprobante" label="Comprobante" disabled>
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
                                                    readonly disabled
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="feccomprobante" @input="menu1 = false"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </template>
                                <template>
                                    <v-flex xs4 sm4 md4>
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
                                                    readonly disabled
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="fecpago" @input="menu2 = false"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </template> 
                                <v-flex xs4 sm4 md4>
                                    <v-text-field type="number" v-model="imptotal" prefix="$" label="Imp.Total" disabled>
                                    </v-text-field>
                                </v-flex> 
                                <v-flex xs4 sm4 md4>
                                    <v-text-field 
                                        v-model="cuentagcom" 
                                        disabled 
                                        label="Cuenta Gcom"
                                        >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-select v-model="idforpago"
                                    :items = "forpagos" label = "Forma de Pago">
                                    </v-select>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-select v-model="idalternativapago"
                                    :items = "alternativapagos" label = "Beneficiario">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <form enctype="multipart/form-data">
                                        <div class="field">
                                            <label for="file" class="label"></label>
                                            <input 
                                            style="display:none" 
                                            type="file"
                                            accept="application/pdf"
                                            @change="onFilePagoSelected($event.target.files)"
                                            ref="Pago"/>
                                        </div>
                                    </form>
                                    <form enctype="multipart/form-data">
                                        <div class="field">
                                            <label for="file" class="label"></label>
                                            <input 
                                            style="display:none" 
                                            type="file"
                                            accept="application/pdf"
                                            @change="onFileCert1Selected($event.target.files)"
                                            ref="Cert1"/>
                                        </div>
                                    </form>                                      
                                    <form enctype="multipart/form-data">
                                        <div class="field">
                                            <label for="file" class="label"></label>
                                            <input 
                                            style="display:none" 
                                            type="file"
                                            accept="application/pdf"
                                            @change="onFileCert2Selected($event.target.files)"
                                            ref="Cert2"/>
                                        </div>
                                    </form>                                      
                                    <form enctype="multipart/form-data">
                                        <div class="field">
                                            <label for="file" class="label"></label>
                                            <input 
                                            style="display:none" 
                                            type="file"
                                            accept="application/pdf"
                                            @change="onFileCert3Selected($event.target.files)"
                                            ref="Cert3"/>
                                        </div>
                                    </form>                                      
                                    <form enctype="multipart/form-data">
                                        <div class="field">
                                            <label for="file" class="label"></label>
                                            <input 
                                            style="display:none" 
                                            type="file"
                                            accept="application/pdf"
                                            @change="onFileCert4Selected($event.target.files)"
                                            ref="Cert4"/>
                                        </div>
                                    </form>                               
                                </v-flex>
                                <v-flex xs3 sm3>
                                    <v-overflow-btn
                                    class="my-2"
                                    :items="documentos"
                                    label="Ver"
                                    target="#listavisualizar"
                                    @input="onViewSelected($event)"
                                    ></v-overflow-btn>
                                </v-flex>
                                <v-spacer></v-spacer>                             
                                <v-btn v-if="pagado==false" @click="$refs.Pago.click()">PDf Pago</v-btn>
                                <v-btn v-if="pagado==false" @click="$refs.Cert1.click()">PDF Cer1</v-btn>
                                <v-btn v-if="pagado==false" @click="$refs.Cert2.click()">PDF Cer2</v-btn>
                                <v-btn v-if="pagado==false" @click="$refs.Cert3.click()">PDF Cer3</v-btn>
                                <v-btn v-if="pagado==false" @click="$refs.Cert4.click()">PDF Cer4</v-btn>
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
            <export-excel
                :data   = "json_data"
                :fields = "json_fields"
                worksheet = "Pendientes"
                type    = "xls"
                name    = "GAPdata.xls"      
                >
                <v-btn color="primary" dark class="mb-2" @click="crearXLS()">Exportar XLS</v-btn>
            </export-excel>
            <v-data-table
                :headers="headers"
                :items="ordenpagos"
                :search="search"
                class="elevation-1"
                >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-20">
                        <v-icon v-if="props.item.pagado===false"
                        small
                        class="mr-2"
                        @click="edit(props.item)"
                        >
                        edit
                        </v-icon>
                    </td>
                    <td>{{ props.item.fecpago.substr(0, 10) }}</td>
                    <td>{{ props.item.proveedor }}</td>
                    <td>{{ props.item.proyectoorden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ tipocomprobantes.find(x => x.value===props.item.tipocomprobante ).text }}</td>
                    <td>{{ props.item.numcomprobante }}</td>
                    <td>{{ props.item.feccomprobante.substr(0, 10) }}</td>
                    <td class="text-xs-right">{{ formatPrice(props.item.imptotal) }}</td>
                    <td>{{ props.item.forpago }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.alternativapago }}</td>
                    <td>{{ props.item.banco }}</td>
                    <td>{{ props.item.numcuenta }}</td>
                    <td>{{ props.item.cbu }}</td>
                    <td>{{ props.item.alias }}</td>
                    <td>{{ props.item.itemorden }}</td>
                    <td>{{ props.item.itemes }}</td>
                    <td>{{ props.item.subitemorden }}</td>
                    <td>{{ props.item.subitemes }}</td>
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
                    <td>{{ props.item.idordenpago }}</td>
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
                <strong>Total: </strong>$ {{totalPendiente=formatPrice(calcularTotal)}}
            </v-flex>                 
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
                json_fields: {},
                json_data: [],
                json_meta: [
                [
                    {
                            'key': 'charset',
                            'value': 'utf-8'
                        }
                    ]
                ],                    
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                fdpago: new FormData,
                fdcert1: new FormData,
                fdcert2: new FormData,
                fdcert3: new FormData,
                fdcert4: new FormData,
                originalguidpago: '',
                originalguidcert1: '',
                originalguidcert2: '',
                originalguidcert3: '',
                originalguidcert4: '',
                guidpago: '',                 
                guidcert1: '',                 
                guidcert2: '',                 
                guidcert3: '',                 
                guidcert4: '',
                documento: 'Factura',
                documentos: ['Factura', 'Pago', 'Cert#1', 'Cert#2', 'Cert#3', 'Cert#4'], 
                busquedas: ['Pago', 'Cert#1', 'Cert#2', 'Cert#3', 'Cert#4'],                                               
                page: 1,
                // Arrays
                items: [],
                subitems: [],
                allsubitems: [],
                proveedores: [],
                proyectos:[],
                ordenpagos:[],
                alternativapagos: [],
                allalternativapagos: [],
                forpagos: [],
                // Detail
                idordenpago: '',
                iditem: '',
                idsubitem: '',
                idproveedor: '',
                proveeedor: '',
                idalternativapago: '',
                cuentagcom: '',
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
                idforpago: '',
                pagado: false,
                fecpagado: '',
                pdfcomprobantefac:'',
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
                proyecto: '',
                menu1: false,
                menu2: false,
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Fecha Pago', value: 'fecpago', sortable: true },
                    { text: 'Nombre del Proveedor', value: 'proveedor', sortable: true },
                    { text: '#Proyecto', value: 'proyectoorden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Cbte', value: 'tipocomprobante', sortable: true },
                    { text: '#Cbte', value: 'numcomprobante', sortable: true },
                    { text: 'Fecha Cbte', value: 'feccomprobante', sortable: true },
                    { text: 'Imp.Total', value: 'imptotal', sortable: true },
                    { text: 'Forma de pago', value: 'forpago', sortable: true },
                    { text: 'Telefono', value: 'telefono', sortable: true },
                    { text: 'email', value: 'email', sortable: true },
                    { text: 'Beneficiario', value: 'alternativapago', sortable: true },
                    { text: 'Banco', value: 'banco', sortable: true },
                    { text: '#Cuenta', value: 'numcuenta', sortable: true },
                    { text: 'CBU', value: 'cbu', sortable: true },
                    { text: 'Alias', value: 'alias', sortable: true },
                    { text: '#Item', value: 'itemorden', sortable: true },
                    { text: 'Item', value: 'itemes', sortable: true },
                    { text: '#Subitem', value: 'subitemorden', sortable: true },
                    { text: 'Subitem', value: 'subitemes', sortable: true },
                    { text: 'Notas', value: 'notas', sortable: true },
                    { text: 'Fac guid', value: 'pdfcomprobantefac', sortable: false },
                    { text: 'Pago guid', value: 'pdfcomprobantepago', sortable: false },
                    { text: 'Cer1 guid', value: 'pdfcertificado1', sortable: false },
                    { text: 'Cer2 guid', value: 'pdfcertificado2', sortable: false },
                    { text: 'Cer3 guid', value: 'pdfcertificado3', sortable: false },
                    { text: 'Cer4 guid', value: 'pdfcertificado4', sortable: false },
                    { text: 'Estado', value: 'activo', sortable: true  },                                    
                    { text: '#Id', value: 'idordenpago', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],
                totalVencido: 0,                 
                totalPagar: 0,                 
                totalPendiente: 0,                 
                search: '',
                editedIndex: -1,
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                registrar: false
            }
        },
        computed: {
            calcularTotal:function(){
                var resultado=0.0;
                for(var i=0;i<this.ordenpagos.length;i++){
                    resultado=resultado+(this.ordenpagos[i].activo?this.ordenpagos[i].imptotal:0);
                }
                return resultado;
            }                           
        },
        watch: {
            dialogForm (val) {
                val || this.closeForm()
            }
        },
            created () {
                this.listar();
                this.select();
            },
        methods:{
            crearXLS(){
                this.json_fields = {
                    'Fecha Pago':   {field: 'fecpago',
                                    callback: (value) => {return value.substr(0,10)}
                                    },
                    'Proveedor': 'proveedor',
                    '#Proyecto': 'proyectoorden',
                    'Proyecto': 'proyecto',
                    'Cbte' : 'tipocomprobante',
                    '#Cbte' : 'numcomprobante',
                    'Fecha Cbte' :  {field: 'feccomprobante',
                        callback: (value) => {return value.substr(0,10)}
                    },
                    'Imp.Total': {field: 'imptotal',
                        callback: (value) => {return value.toString().replace('.',',')}
                    },
                    'Forma de Pago': 'forpago',
                    'Telefono': 'telefono',
                    'eMail': 'email',
                    'Beneficiario': 'alternativapago',
                    'Banco': 'banco',
                    'Nro.Cuenta': 'numcuenta',
                    'CBU': 'cbu',
                    'Alias': 'alias', 
                    '#Item' : 'itemorden',
                    'Item' : 'itemes',
                    '#Subitem': 'subitemorden',
                    'Subitem': 'subitemes'
                },
                this.json_data = this.ordenpagos.filter(x => x.activo === true);
                // this.json_data = [];
                // for (var x=0; x<this.ordenpagos.length; x++){
                //     for (let i=0; i<this.items.length; i++){
                //         if (this.items[i]["value"]===this.ordenpagos[x]["iditem"]){
                //             this.json_data.push(this.ordenpagos[x]);
                //             break
                //         }
                //     }
                // }
            },
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(configuracion);
                if (this.$store.state.usuario.rol =='Administrador' || this.$store.state.usuario.rol =='JefeAdministracion' ){
                    axios.get('api/Ordenpagos/ListarPendientes',configuracion).then(function(response){
                        // console.log(response);
                        me.ordenpagos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }else{
                    axios.get('api/Ordenpagos/ListarPendientesUsuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        // console.log(response);
                        me.ordenpagos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
            },
            select(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                var itemsArray=[];
                var proveedoresArray=[];
                var allsubitemsArray=[];
                var allalternativapagosArray=[];
                var forpagosArray=[];
                axios.get('api/Items/Select',configuracion).then(function(response){
                    itemsArray=response.data;
                    itemsArray.map(function(x){
                        me.items.push({text: x.item, value: x.iditem, vivo: x.vivo, post: x.post, conf: x.conf, cuenta:x.cuentagcom });
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
                axios.get('api/Forpagos/Select',configuracion).then(function(response){
                    //console.log(response);
                    forpagosArray=response.data.sort((a, b) => (a.forpago > b.forpago) ? 1 : -1);
                    forpagosArray.map(function(x){
                        me.forpagos.push({text: x.forpago,value:x.idforpago});
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
            selectAlternativapagos(){
                let me=this;
                me.alternativapagos = me.allalternativapagos.filter(x => x.id===me.idproveedor);
                if (me.alternativapagos.length===1){
                    me.idalternativapago=me.alternativapagos[0].value;
                }
            },              
            edit (item) {
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
                this.cuentagcom = item.iditem?this.items.find(c => c.value === item.iditem).cuenta:"";
                this.idforpago = item.idforpago;
                this.fecpago = item.fecpago.substr(0, 10);
                this.pagado = item.pagado;
                this.fecpagado = item.fecpagado;
                this.notas = item.notas;
                this.pdfcomprobantefac = item.pdfcomprobantefac;
                this.pdfcomprobantepago = item.pdfcomprobantepago;
                this.originalguidpago = item.pdfcomprobantepago;
                this.pdfcertificado1 = item.pdfcertificado1;
                this.originalguidcert1 = item.pdfcertificado1;
                this.pdfcertificado2 = item.pdfcertificado2;
                this.originalguidcert2 = item.pdfcertificado2;
                this.pdfcertificado3 = item.pdfcertificado3;
                this.originalguidcert3 = item.pdfcertificado3;
                this.pdfcertificado4 = item.pdfcertificado4;
                this.originalguidcert4 = item.pdfcertificado4;            
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.editedIndex=1;
                this.dialogForm = true
            },         
            closeForm () {
                this.validaMensaje = [];
                this.limpiar();
                this.dialogForm = false;
            },
            limpiar() {
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
                this.cuentagcom = '';
                this.idforpago = '';
                this.fecpago = '';
                this.pagado = false;
                this.fecpagado = '';
                this.pdfcomprobantefac = '';
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
                this.onClear();                
            },
            registro () {
                var date = new Date();
                this.pagado = true;
                this.fecpagado = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                this.registrar = false;
                this.guardar();
                this.closeForm();
            },      
            guardar () {
                if (this.validar()){
                    return;
                }
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    if (this.pdfcomprobantepago && this.originalguidpago != this.pdfcomprobantepago ){
                        this.onDelete(this.originalguidpago);
                        this.originalguidpago='';
                        this.onUploadPago();
                    }
                    if (this.pdfcertificado1 && this.originalguidcert1 != this.pdfcertificado1 ){
                        this.onDelete(this.originalguidcert1);
                        this.originalguidcert1;
                        this.onUploadCert1();
                    }
                    if (this.pdfcertificado2 && this.originalguidcert2 != this.pdfcertificado2 ){
                        this.onDelete(this.originalguidcert2);
                        this.originalguidcert2;
                        this.onUploadCert2();
                    }
                    if (this.pdfcertificado3 && this.originalguidcert3 != this.pdfcertificado3 ){
                        this.onDelete(this.originalguidcert3);
                        this.originalguidcert3;
                        this.onUploadCert3();
                    }
                    if (this.pdfcertificado4 && this.originalguidcert4 != this.pdfcertificado4 ){
                        this.onDelete(this.originalguidcert4);
                        this.originalguidcert4;
                        this.onUploadCert4();
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
                        'idforpago': me.idforpago,
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
                        me.limpiar();                        
                        me.listar();
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                } else {
                    //Código para guardar
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
                        'idforpago': me.idforpago,
                        'fecpago': me.fecpago,
                        'pagado': false,
                        'fecpagado': me.fecpagado,
                        'pdfcomprobantefac': me.pdfcomprobantefac,
                        'pdfcomprobantepago': me.pdfcomprobantepago,
                        'pdfcertificado1': me.pdfcertificado1,
                        'pdfcertificado2': me.pdfcertificado2,
                        'pdfcertificado3': me.pdfcertificado3,
                        'pdfcertificado4': me.pdfcertificado4,
                        'notas': me.notas,
                        'iduseralta': me.$store.state.usuario.idusuario
                    },configuracion).then(function(response){
                        me.closeForm();
                        me.limpiar();                        
                        me.listar();
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
                if (!this.fecpago){
                    this.validaMensaje.push("Ingrese una fecha de pago.");
                }
                if (!this.idforpago){
                    this.validaMensaje.push("Ingrese una forpa de pago.");
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
            onFilePagoSelected(fileList){

                var file = fileList[0];
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                this.guidpago = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                this.pdfcomprobantepago = this.guidpago;
                this.fdpago.append("file", file, this.guidpago)

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

            onFileCert1Selected(fileList){

                var file = fileList[0];
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                this.guidcert1 = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                this.pdfcertificado1 = this.guidcert1;
                this.fdcert1.append("file", file, this.guidcert1)

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

            onFileCert2Selected(fileList){

                var file = fileList[0];
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                this.guidcert2 = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                this.pdfcertificado2 = this.guidcert2;
                this.fdcert2.append("file", file, this.guidcert2)

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
            onFileCert3Selected(fileList){

                var file = fileList[0];
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                this.guidcert3 = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                this.pdfcertificado3 = this.guidcert3;
                this.fdcert3.append("file", file, this.guidcert3)

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
            onFileCert4Selected(fileList){

                var file = fileList[0];
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                this.guidcert4 = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                this.pdfcertificado4 = this.guidcert4;
                this.fdcert4.append("file", file, this.guidcert4)

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

            async onUploadPago(){
                let me=this;
                let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                await axios.post('api/Express/UploadFiles',this.fdpago,configuracion)
                    .then(res => {
                    console.log(res.data);
                    this.fdpago = new FormData;
                }).catch(error => {
                    this.fdpago = new FormData;
                    this.dialog = false;
                    this.guid = '';
                    this.pdfcomprobantepago = '';
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);                        
                });
            },
            async onUploadCert1(){
                let me=this;
                let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                await axios.post('api/Express/UploadFiles',this.fdcert1,configuracion)
                    .then(res => {
                    console.log(res.data);
                    this.fdcert1 = new FormData;
                }).catch(error => {
                    this.fdcert1 = new FormData;
                    this.dialog = false;
                    this.guid = '';
                    this.pdfcertificado1 = '';
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);                        
                });
            },            
            async onUploadCert2(){
                let me=this;
                let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                await axios.post('api/Express/UploadFiles',this.fdcert2,configuracion)
                    .then(res => {
                    console.log(res.data);
                    this.fdcert2 = new FormData;
                }).catch(error => {
                    this.fdcert2 = new FormData;
                    this.dialog = false;
                    this.guid = '';
                    this.pdfcertificado2 = '';
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);                        
                });
            },            
            async onUploadCert3(){
                let me=this;
                let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                await axios.post('api/Express/UploadFiles',this.fdcert3,configuracion)
                    .then(res => {
                    console.log(res.data);
                    this.fdcert3 = new FormData;
                }).catch(error => {
                    this.fdcert3 = new FormData;
                    this.dialog = false;
                    this.guid = '';
                    this.pdfcertificado3 = '';
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);                        
                });
            },            
            async onUploadCert4(){
                let me=this;
                let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                await axios.post('api/Express/UploadFiles',this.fdcert4,configuracion)
                    .then(res => {
                    console.log(res.data);
                    this.fdcert4 = new FormData;
                }).catch(error => {
                    this.fdcert4 = new FormData;
                    this.dialog = false;
                    this.guid = '';
                    this.pdfcertificado4 = '';
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);                        
                });
            },            
            onDownload(file){
                if (file === ""){
                    this.snacktext = 'No hay PDF asociado';
                    this.snackbar = true;
                    console.log('No hay PDF asociado');
                } else {
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
                }
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
            } ,
            onViewSelected(event){
                switch (event){
                    case 'Factura':
                        this.onClear();
                        this.onDownload(this.pdfcomprobantefac);
                        break;
                    case 'Pago':
                        this.onClear();
                        this.onDownload(this.pdfcomprobantepago);
                        break;
                    case 'Cert#1':
                        this.onClear();
                        this.onDownload(this.pdfcertificado1);
                        break;
                    case 'Cert#2':
                        this.onClear();
                        this.onDownload(this.pdfcertificado2);
                        break;
                    case 'Cert#3':
                        this.onClear();
                        this.onDownload(this.pdfcertificado3);
                        break;
                    case 'Cert#4':
                        this.onClear();
                        this.onDownload(this.pdfcertificado4);
                        break;
                }
            },
            onBuscarSelected(event){
                console.log(event);
            }

        }
    }
</script>