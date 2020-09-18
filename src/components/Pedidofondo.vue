<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Pedido de Fondos - Proyectos</v-toolbar-title>
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
                    <span class="headline">Pedido de Fondos para Proyecto #{{orden}}: {{proyecto}} </span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="800px" persistent>
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click.native="closeForm">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" v-if="rendido==false" flat @click.native="guardar">Guardar</v-btn>
                                </v-card-actions>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <template v-if="editedIndex==-1">
                                                <v-flex xs12 sm12 md12>
                                                    <v-autocomplete v-model="idsubrubro"
                                                        :items = "subrubros" 
                                                        :search-input.sync="searchru" 
                                                        clearable
                                                        label="Subrubro">
                                                    </v-autocomplete>
                                                </v-flex>
                                            </template>
                                            <template v-else>
                                                <v-flex xs3 sm3 md3>
                                                    <v-text-field type="number" 
                                                        v-model.number="numpedido"
                                                        disabled 
                                                        label="#Pedido" readonly>
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs9 sm9 md9>
                                                    <v-autocomplete v-model="idsubrubro"
                                                        :items = "subrubros" 
                                                        :search-input.sync="searchru" 
                                                        clearable
                                                        disabled 
                                                        label="Subrubro">
                                                    </v-autocomplete>
                                                </v-flex>
                                            </template>
                                            <v-flex xs6 sm6 md6>
                                                <v-autocomplete 
                                                    v-model="idresponsable" 
                                                    clearable 
                                                    :items="responsables"
                                                    :search-input.sync="searchr" 
                                                    label="Responsable">
                                                </v-autocomplete>
                                            </v-flex>
                                            <template>
                                                <v-flex xs3 sm3 md3>
                                                    <v-menu
                                                        v-model="menu1"
                                                        :close-on-content-click="false"
                                                        :nudge-right="40"
                                                        lazy
                                                        transition="scale-transition"
                                                        offset-y
                                                        full-width
                                                        min-width="290px"
                                                        readonly
                                                    >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field
                                                                v-model="fecpedido"
                                                                label="Fecha Pedido"
                                                                prepend-icon="event"
                                                                disabled
                                                                readonly
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="fecpedido" @input="menu1 = false"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </template>
                                            <v-flex xs3 sm3 md3>
                                                <v-text-field type="number" v-model="importe" prefix="$" label="Importe">
                                                </v-text-field>
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Pedido de Fondo?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Pedido de Fondo?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    el Pedido de Fondo de {{ adNombre }}
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
                            :items="pedidofondos"
                            :search="search"
                            class="elevation-1"
                            >
                            <template v-if="validateAccess(props.item.idsubrubro)" slot="items" slot-scope="props">
                                <td class="justify-center layout px-0">
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
                                <td class="text-xs-center"> {{ props.item.orden }}</td>
                                <td>{{ props.item.proyecto }}</td>
                                <td class="text-xs-center">{{ props.item.numpedido }}</td>
                                <td>{{ props.item.subrubro }}</td>
                                <td>{{ props.item.responsable }}</td>
                                <td>{{ props.item.fecpedido.substr(0, 10) }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                                <td>{{ props.item.notas ? props.item.notas.substr(0, 50) : props.item.notas }}</td>
                                <td class="text-xs-center">
                                    <div v-if="props.item.rendido">
                                        <span class="green--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="blue--text">No</span>
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
                            <template slot="no-data">
                            <v-btn color="primary" @click="listarMaster">Resetear</v-btn>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Total Pedidos: </strong>$ {{totalPagado=(calcularTotal).toFixed(2)}}
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
                pedidofondos:[],
                proyectos:[],
                allsubrubros:[],
                subrubros:[],
                usuarioproyectos:[],
                responsables:[],
                idpedidofondo: '',
                orden: '',
                idsubrubro: '',
                idresponsable: '',
                numpedido: '',
                fecpedido: new Date().toISOString().substr(0, 10),
                importe: 0,
                notas: '',
                rendido: false,
                iduseralta: '',
                fecalata: '',
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
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: '#Pedido', value: 'numpedido', sortable: true },
                    { text: 'Desripción del Subrubro', value: 'subrubro', sortable: true },
                    { text: 'Nombre del Responsable', value: 'responsable', sortable: true },
                    { text: 'Fecha Pedido', value: 'fecpedido', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Notas / Observaciones', value: 'notas', sortable: true },
                    { text: 'Rendido?', value: 'rendido', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                search: '',
                searchr:'',
                searchru:'',
                searchpr:'',
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
                return this.editedIndex === -1 ? 'Nuevo pedido' : 'Actualizar pedido'
            },
            calcularTotal:function(){
                    var subtotal=0.0;
                    for(var i=0;i<this.pedidofondos.length;i++){
                        subtotal+=(this.pedidofondos[i].activo?this.pedidofondos[i].importe:0);
                    }
                    return subtotal;
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
                for (let i=0; i<this.subrubros.length; i++){
                    if (this.subrubros[i]["value"]===element){
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
            filtrarSubrubros(){
                let me=this;
                // Filtrar Items Seleccionables por Rol / Usuarioproyecto
                me.subrubros=[];
                if (this.$store.state.usuario.rol =='AsistProduccion' || this.$store.state.usuario.rol =='ChiefProducer' || this.$store.state.usuario.rol =='LineProducer' || this.$store.state.usuario.rol =='AsistGeneral'){
                    var usuario = +me.$store.state.usuario.idusuario;
                    var post = me.usuarioproyectos.find(x => x.idproyecto===this.idproyecto && x.idusuario===usuario )["post"];
                    var vivo = me.usuarioproyectos.find(x => x.idproyecto===this.idproyecto && x.idusuario===usuario )["vivo"];
                    var conf = me.usuarioproyectos.find(x => x.idproyecto===this.idproyecto && x.idusuario===usuario )["confidencial"];
                    me.subrubros = me.allsubrubros.filter(x => (x.post===false && x.vivo===false && x.conf===false) ||
                                        (x.post===true && x.post===post) || (x.vivo===true && x.vivo===vivo) || 
                                        (x.conf===true && x.conf===conf) );
                }
                else{
                    me.subrubros = me.allsubrubros;
                }
            },            
            listarDetail(){ 
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(configuracion);
                axios.get('api/Pedidofondos/ListarProyecto/'+this.idproyecto,configuracion,configuracion).then(function(response){
                    //console.log(response);
                    me.pedidofondos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var allsubrubrosArray=[];
                var responsablesArray=[];
                var usuarioproyectosArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Subrubros/Select',configuracion).then(function(response){
                    //console.log(response);
                    allsubrubrosArray=response.data;
                    allsubrubrosArray.map(function(x){
                        me.allsubrubros.push({text: x.subrubro,value:x.idsubrubro, post:x.post, vivo:x.vivo, conf:x.conf});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Personas/SelectResponsables',configuracion).then(function(response){
                    //console.log(response);
                    responsablesArray=response.data;
                    responsablesArray.map(function(x){
                        me.responsables.push({text: x.nombre,value:x.idpersona});
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
            },
            editMasterItem (item) {
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.producto = item.producto;
                this.fecadjudicacion = item.fecadjudicacion.substr(0, 10);
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.filtrarSubrubros();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idpedidofondo = item.idpedidofondo;
                this.idproyecto = item.idproyecto;
                this.idsubrubro = item.idsubrubro;
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
                this.producto = '';
                this.fecadjudicacion = '';
                this.ars1usd = '',               
                this.totalPagado = 0;
            },
            limpiarDetail(){
                var date = new Date();
                this.idpedidofondo = '';
                this.idsubrubro = '';
                this.idresponsable = '';
                this.numpedido = '';
                this.fecpedido = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
                this.importe = '';
                this.notas = '';
                this.rendido = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.searchr = '';
                this.searchru = '';
                this.editedIndex=-1;
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
                    // console.log(me);
                    axios.put('api/Pedidofondos/Actualizar',{
                        'idpedidofondo': me.idpedidofondo,
                        'idproyecto': me.idproyecto,
                        'idsubrubro': me.idsubrubro,
                        'idresponsable': me.idresponsable,
                        'numpedido': me.numpedido,
                        'fecpedido': me.fecpedido,
                        'importe': me.importe,
                        'notas': me.notas,
                        'rendido': me.rendido,
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
                    // console.log(me);
                    axios.post('api/Pedidofondos/Crear',{
                        'idproyecto': me.idproyecto,
                        'idsubrubro': me.idsubrubro,
                        'idresponsable': me.idresponsable,
                        'fecpedido': me.fecpedido,
                        'importe': me.importe,
                        'notas': me.notas,
                        'rendido': false,
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
                if (!this.idresponsable){
                    this.validaMensaje.push("Ingrese un responsable.");
                }
                if (!this.idsubrubro){
                    this.validaMensaje.push("Ingrese un subrubro.");
                }
                if (!this.fecpedido){
                    this.validaMensaje.push("Ingrese una fecha de pedido de fondo.");
                }
                if (!this.importe || Number(this.importe) <= 0 ){
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
                axios.put('api/Pedidofondos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
