<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Control de Garantias</v-toolbar-title>
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
                    <span class="headline">Control de OPs del Proyecto #{{orden}}: {{proyecto}} </span>
                    </v-card-title>            
                    <v-card-text>                                      
                <export-excel
                    :data   = "json_data"
                    :fields = "json_fields"
                    worksheet = "PptoReal"
                    type    = "xls"
                    name    = "GAPdata.xls"      
                    >
                    <v-btn color="primary" dark class="mb-2" @click="crearXLS()">Exportar XLS</v-btn>
                </export-excel>
                        <v-data-table
                            :headers="headersDetalle"
                            :items="controlgarantias"
                            class="elevation-1"
                            >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.proy }}</td>
                                <td>{{ props.item.proyecto }}</td>
                                <td>{{ props.item.numorden }}</td>
                                <td>{{ props.item.rubro }}</td>
                                <td>{{ props.item.proveedor }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                                <td>{{ props.item.detalle }}</td>
                                <td>{{ props.item.banco }}</td>
                                <td>{{ props.item.numcheque }}</td>
                                <td>{{ props.item.feccheque?props.item.feccheque.substr(0, 10):"" }}</td>
                                <td>{{ props.item.fecvencimiento?props.item.fecvencimiento.substr(0, 10):"" }}</td>
                                <td class="justify-center">
                                    <div v-if="props.item.entregado">
                                        <span class="blue--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">No</span>
                                    </div>
                                </td>
                                <td class="justify-center">
                                    <div v-if="props.item.rendido">
                                        <span class="blue--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">No</span>
                                    </div>
                                </td>
                                <td>{{ props.item.fhrendido?props.item.fhrendido.substr(0, 16):"" }}</td>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong> Total Entregado : </strong> $ {{totalPagado=(calcularTotal).toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong> Pendiente : </strong> $ {{totalPendiente=(calcularPendiente).toFixed(2)}}
                        </v-flex>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
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
                fd: new FormData,
                originalguid: '',
                guid: '',                
                page: 1,
                // Arrays
                items: [],
                subitems: [],
                proveedores: [],
                proyectos:[],
                controlgarantias:[],
                // Detail
                proy: '',
                proyecto: '',
                rubro: '',
                subrubro: '',
                item: '',
                subitem: '',
                origen:'',
                tipo: '',
                importe: 0.00,
                confidencial: false,
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
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Tipo de producción', value: 'tipoprod', sortable: true },
                    { text: 'Fecha Adjudicación', value: 'fecadjudicacion', sortable: true },
                    { text: 'Tipo de cambio', value: 'ars1usd', sortable: true },
                ],
                headersDetalle: [
                    { text: 'Código', value: 'proy', sortable: true },
                    { text: 'Proyecto', value: 'proyecto', sortable: true },
                    { text: '#Id', value: 'numorden', sortable: true },
                    { text: 'Descripcion del Rubro', value: 'rubro', sortable: true },
                    { text: 'Nombre del Proveedor', value: 'proveedor', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Detalle / Descripción', value: 'detalle', sortable: true },
                    { text: 'Banco', value: 'banco', sortable: true },
                    { text: 'Nro. Cheque', value: 'numcheque', sortable: true },
                    { text: 'Fecha Cheque', value: 'feccheque', sortable: true },                    
                    { text: 'Vencimiento', value: 'fecvencimiento', sortable: true },
                    { text: 'Entregado', value: 'entregado', sortable: true },
                    { text: 'Rendido', value: 'rendido', sortable: true },
                    { text: 'Fecha Hora de Rendicion', value: 'fhrendido', sortable: true }
                ],
                totalPagado: 0,
                totalPendiente: 0,
                search: '',
                editedIndex: -1,
                valida: 0,
                validaMensaje:[],
                adAccion: 0,
                adNombre: '',
                adId: ''             
                }
            },
            computed: {
                calcularTotal:function(){
                    var resultado1=0.0;
                    for(var i=0;i<this.controlgarantias.length;i++){
                        resultado1=resultado1+((this.controlgarantias[i].entregado)?this.controlgarantias[i].importe:0);
                    }
                    return resultado1;
                },
                calcularPendiente:function(){
                    var resultado2=0.0;
                    for(var i=0;i<this.controlgarantias.length;i++){
                        resultado2=resultado2+((this.controlgarantias[i].entregado && !this.controlgarantias[i].rendido)?this.controlgarantias[i].importe:0);
                    }
                    return resultado2;
                }                             
            },
            watch: {
                dialog (val) {
                val || this.closeDetail()
                }
            },
            created () {
                this.listarMaster();
            },
            methods:{
            crearXLS(){
                this.json_fields = {
                    'Código': 'proy',
                    'Proyecto': 'proyecto',
                    'Rubro': 'rubro',
                    'Proveedor': 'proveedor',
                    'Importe': {field: 'importe',
                        callback: (value) => {return value.toString().replace('.',',')}
                    },
                    'Detalle': 'detalle',
                    'Banco' : 'banco',
                    'Nro Cheque': 'numcheque',
                    'Fecha Cheque': {field: 'feccheque',
                        callback: (value) => {return value.substr(0,10)}
                    },
                    'Vencimiento': 'fecvencimiento',
                    'Nro Cbte': 'numcomprobante',
                    'Entregado?': 'entregado',
                    'Rendido?': 'rendido',
                    'Fecha Hora rendicion': 'fhrendido'
                },
                this.json_data = this.controlgarantias;
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
            listarDetail(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(configuracion);
                axios.get('api/Garantias/Controlgarantia2date/'+this.idproyecto,configuracion).then(function(response){
                    // console.log(response);
                    me.controlgarantias=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            editMasterItem (item) {
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.producto = item.producto;
                this.fecadjudicacion = item.fecadjudicacion.substr(0, 10);
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idordenpago = item.idordenpago;
                this.idproyecto = item.idproyecto;
                this.iditem = item.iditem;
                this.selectSubitems();
                this.idsubitem = item.idsubitem;
                this.idproveedor=item.idproveedor;
                this.idalternativapago=item.idalternativapago;
                this.tipocomprobante = item.tipocomprobante;
                this.numcomprobante = item.numcomprobante;
                this.feccomprobante = item.feccomprobante.substr(0, 10);
                this.impsiniva = item.impsiniva;
                this.importe = item.importe;
                this.fecpago = item.fecpago.substr(0, 10);
                this.cuentagcom = this.items.find(c => c.value === item.iditem).cuenta;
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
                this.editedIndex=1            },
            closeDetail () {
                this.dialog = false;
                this.limpiarMaster();
            },
            limpiarMaster(){
                this.idproyecto = '';                
                this.orden = '';
                this.proyecto = '';
                this.producto = '';
                this.fecadjudicacion = '';
                this.ars1usd = '',
                this.totalPagado = 0;
                this.totalPendiente = 0;
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
                this.importe = '';
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
                this.totalPendiente=0;
            },            
        }        
    }
</script>