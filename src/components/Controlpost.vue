<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Control Post</v-toolbar-title>
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
                    <span class="headline">Control DxD Shooting del Proyecto #{{orden}}: {{proyecto}} </span>
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
                            :items="controlproyectos"
                            class="elevation-1"
                            >
                            <template v-if="validateAccess(props.item.iditem)" slot="items" slot-scope="props">
                                <td>{{ props.item.proy }}</td>
                                <td>{{ props.item.proyecto }}</td>
                                <td>{{ props.item.rubro }}</td>
                                <td>{{ props.item.subrubro }}</td>
                                <td>{{ props.item.item }}</td>
                                <td>{{ props.item.subitem }}</td>
                                <td>{{ props.item.proveedor }}</td>
                                <td>{{ props.item.cuit }}</td>
                                <td>{{ props.item.fecha }}</td>
                                <td>{{ props.item.hhee }}</td>
                                <td>{{ props.item.porhhee }}</td>
                                <td>{{ props.item.impbase }}</td>
                                <td>{{ props.item.imphhee }}</td>
                                <td>{{ props.item.impjorn }}</td>
                                <td>{{ props.item.impadic }}</td>
                                <td>{{ props.item.imptotal }}</td>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Total : </strong>$ {{totalPagado=(calcularTotal).toFixed(2)}}
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
                allitems: [],
                items: [],
                usuarioproyectos:[],
                proyectos:[],
                controlproyectos:[],
                // Detail
                proy: '',
                proyecto: '',
                rubro: '',
                subrubro: '',
                item: '',
                subitem: '',
                proveedor: '',
                cuit: '',
                fecha: '',
                hhee: '',
                porhhee: '',
                impbase: 0,
                imphhee: 0,
                impjorn: 0,
                impadic: 0,
                imptotal: 0,
                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
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
                    { text: 'Rubro', value: 'rubro', sortable: true },
                    { text: 'Subrubro', value: 'subrubro', sortable: true },
                    { text: 'Item', value: 'item', sortable: true },
                    { text: 'Subitem', value: 'subitem', sortable: true },                    
                    { text: 'Nombre del Proveedor', value: 'proveedor', sortable: false },
                    { text: 'CUIT', value: 'cuit', sortable: true },
                    { text: 'Fecha', value: 'fecha', sortable: true },
                    { text: '# HHEE', value: 'hhee', sortable: true },
                    { text: '% HHEE', value: 'porhhee', sortable: true },
                    { text: 'Imp. Base', value: 'impbase', sortable: true },
                    { text: 'Imp. HHEE', value: 'imphhee', sortable: true },
                    { text: 'Imp. Jornada', value: 'impjorn', sortable: true},
                    { text: 'Imp. Adic.', value: 'impadic', sortable: true },
                    { text: 'Imp.Total', value: 'imptotal', sortable: true },
                ],
                totalPagado: 0,                 
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
                    var resultado=0.0;
                    for(var i=0;i<this.controlproyectos.length;i++){
                        resultado=resultado+this.controlproyectos[i].imptotal;
                    }
                    return resultado;
                }                             
            },
            watch: {
                dialog (val) {
                val || this.closeDetail()
                }
            },
            created () {
                this.select();
                this.listarMaster();
            },
            methods:{
            crearXLS(){
                this.json_fields = {
                    'Código': 'proy',
                    'Proyecto': 'proyecto',
                    'Rubro': 'rubro',
                    'Subrubro': 'subrubro',
                    'Item' : 'item',
                    'Subitem': 'subitem',
                    'Proveedor': 'proveedor',
                    'CUIT': 'cuit',
                    'Fecha': {field: 'fecha',
                        callback: (value) => {return value.substr(0,10)}
                        },
                    '# HHEE': 'hhee',
                    '% HHEE': 'porhhee',
                    'Imp.Base': {field: 'impbase',
                        callback: (value) => {return value.toString().replace('.',',')}
                    },
                    'Imp.HHEE': {field: 'imphhee',
                        callback: (value) => {return value.toString().replace('.',',')}
                    },
                    'Imp.Adic': {field: 'impadic',
                        callback: (value) => {return value.toString().replace('.',',')}
                    },
                    'Imp.Total': {field: 'imptotal',
                        callback: (value) => {return value.toString().replace('.',',')}
                    },
                },
                // this.json_data = this.controlproyectos;
                this.json_data = [];
                for (var x=0; x<this.controlproyectos.length; x++){
                    for (let i=0; i<this.items.length; i++){
                        if (this.items[i]["value"]===this.controlproyectos[x]["iditem"]){
                            this.json_data.push(this.controlproyectos[x]);
                            break
                        }
                    }
                }
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
                }else if (this.$store.state.usuario.rol =='ExecutiveProducer'){
                    axios.get('api/Proyectos/Listaractivosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.proyectos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });                    
                } else{
                    axios.get('api/Proyectos/Listaractivosusuariopost/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.proyectos=response.data;
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
                var allitemsArray=[];
                var usuarioproyectosArray=[];
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
            listarDetail(){
                let me=this;
                var tarifaArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};      
                //console.log(configuracion);
                axios.get('api/Realposts/Controlpost2date/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    me.controlproyectos=response.data;
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
                this.filtrarItems();
                this.dialog = true
            },
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
            }
        }        
    }
</script>