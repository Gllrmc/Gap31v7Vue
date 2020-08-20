<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Presupuestos Proyectos</v-toolbar-title>
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
            <v-dialog v-model="dialog" max-width="1200px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Presupuesto Proyecto #{{orden}} - {{proyecto}} | Cliente: {{cliente}} | Adjudicación: {{fecadjudicacion.substr(0,10)}}</span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="800px">
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
                                        <v-flex xs2 sm2 md2>
                                            <v-select v-model="idsubitem"
                                            :items = "subitems" label = "Subitem">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field type="number" v-model="importe" prefix="$" label="Importe">
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Linea Presupuesto?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Linea Presupuesto?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la línea {{ adNombre }}
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
                        :items="presupuestos"
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
                                <td class="text-xs-center">{{ props.item.idpresupuesto }}</td>
                                <td>{{ props.item.itemorden }}</td>
                                <td>{{ props.item.itemes }}</td>
                                <td>{{ props.item.subitemorden }}</td>
                                <td>{{ props.item.subitemes }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                                <td class="text-xs-center">{{ props.item.origen }}</td>
                                <td class="justify-center">
                                    <div v-if="props.item.activo">
                                        <span class="blue--text">Activo</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">Inactivo</span>
                                    </div>
                                </td>                                    
                                <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                                <td>{{ props.item.fecalta }}</td>
                                <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                                <td>{{ props.item.fecumod }}</td>
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
            <v-dialog v-model="dialogImport" max-width="800px">
                <v-card>
                    <v-card-title class="headline">Importacion de Presupuesto</v-card-title>
                    <v-card-text>
                        <div>
                            <span>Estas a punto de importar el presupuesto de Proyecto #{{imId}} - "{{imNombre}}". </span><br><br>
                            <span class="grey--text">Esta accion eliminará la versión actual de presupuesto, si la hubiere y cargará 
                                una nueva versión de presupuesto desde un archivo excel pre formateado.
                                Una vez ejecutada esta acción, no existe la posibilidad de deshacer los cambios.
                            </span>
                        </div>
                        <v-flex xs12 sm12 md12 v-show="validaImp">
                            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                            </div>
                        </v-flex>                            
                    </v-card-text>
                </v-card>
                <v-card-actions>
                    <vue-xlsx-table accept=".xlsx, .xlsm, .xls" @on-select-file="handleSelectedFile">Excel</vue-xlsx-table>
                    <v-btn color="primary" @click="closeFile">Salir</v-btn>
                </v-card-actions>
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
                        <v-icon
                        small
                        class="mr-2"
                        @click="loadFile(props.item)"
                        >
                        save_alt
                        </v-icon>
                    </td>
                    <td> {{props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.cliente }}</td>
                    <td>{{ props.item.fecadjudicacion.substr(0, 10) }}</td>
                    <td class="text-xs-center">{{ formatPrice(props.item.ars1usd) }}</td>
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
                // Arrays
                items: [],
                allitems: [],
                subitems: [],
                allsubitems: [],
                proyectos:[],
                presupuestos:[],
                usuarioproyectos:[],
                chkHeader:["idproyecto","iditem","idsubitem","Importe"],
                rawFile: null,
                workbook: null,
                xlsData: {
                    header: [],
                    body: []
                },
                // Detail
                idproyecto: '',
                iditem: '',
                itemorden: '',
                itemes: '',
                idsubitem: '',
                subitemorden:'',
                subitemes: '',
                importe: 0,
                origen: '',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                // Master
                idproyecto: '',
                orden:'',
                proyecto: '',
                producto: '',
                cliente: '',
                fecadjudicacion: '',
                as1usd: '',
                menu1: false,
                dialog: false,
                dialogForm: false,
                dialogImport: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Tipo de produccion', value: 'tipoprod', sortable: true },                        
                    { text: 'Cliente', value: 'cliente', sortable: true },
                    { text: 'Fecha Adjudicacion', value: 'fecadjudicacion', sortable: true },
                    { text: 'ARS/USD', value: 'ars1usd', sortable: true }
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'name', sortable: false },
                    { text: 'Id', align: 'center', value: 'orden'},
                    { text: '#Item', value: 'itemorden' },
                    { text: 'Item ES', value: 'itemes' },
                    { text: '#Subitem', value: 'subitemorden' },
                    { text: 'Subitem ES', value: 'subitemes' },
                    { text: 'Importe', value: 'importe' },
                    { text: 'Origen', value: 'origen' },
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
                validaImp: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                imNombre: '',
                imId: ''                         }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nueva Linea Presupuesto' : 'Actualizar Linea Presupuesto'
            },
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
                axios.get('api/Presupuestos/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    // console.log(response);
                    me.presupuestos=response.data;
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
                var usuarioproyectosArray=[];
                axios.get('api/Items/SelectActivo',configuracion).then(function(response){
                    allitemsArray=response.data;
                    allitemsArray.map(function(x){
                        me.allitems.push({text: x.item, value: x.iditem, vivo: x.vivo, post: x.post, conf: x.conf });
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
            cambioItem(){
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
            editMasterItem (item) {
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.producto = item.producto;
                this.idcliente = item.idcliente;
                this.cliente = item.cliente;
                this.fecadjudicacion = item.fecadjudicacion.substr(0, 10);
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.filtrarItems();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idpresupuesto = item.idpresupuesto;
                this.idproyecto = item.idproyecto;
                this.iditem = item.iditem;
                this.selectSubitems();
                this.idsubitem = item.idsubitem;
                this.importe=item.importe;
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
                this.idcliente = '';
                this.cliente = '';
                this.fecadjudicacion = '';
                this.ars1usd = 0;
            },
            limpiarDetail() {
                this.idpresupuesto = '';
                this.iditem = '';
                this.idsubitem = '';
                this.importe = 0;
                this.origen = '';
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
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    let me=this;
                    // console.log(me);
                    axios.put('api/Presupuestos/Actualizar',{
                        'idpresupuesto': me.idpresupuesto,
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'importe': me.importe,
                        'origen': 'App',
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
                    let me=this;
                    // console.log(me);
                    axios.post('api/Presupuestos/Crear',{
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'importe': me.importe,
                        'origen': 'App',
                        'iduseralta': me.$store.state.usuario.idusuario,
                        'fecalta': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
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
                    this.validaMensaje.push("Ingrese un item.");
                }
                if (!this.idsubitem){
                    this.validaMensaje.push("Ingrese un subitem.");
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
                this.adNombre=item.itemorden + ':' + item.itemes.substr(0,15) + ' ' + item.subitemorden + ':'
                        + item.subitemes.substr(0,15) + ':' + ' $ ' + item.importe;
                this.adId=item.idpresupuesto;                
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
                axios.put('api/Presupuestos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Presupuestos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
            loadFile(item){
                this.validaImp=0;
                this.validaMensaje=[];
                this.idproyecto = item.idproyecto;
                this.imNombre = item.proyecto;
                this.imId = item.orden;
                this.dialogImport = true;
            },
            closeFile(){
                this.imNombre = '';
                this.imId = '';                
                this.dialogImport = false;
            },
            handleSelectedFile (convertedData) {
                let me=this;
                var lineas = convertedData.body;
                var titulos = convertedData.header;
                var date = new Date();


                // check headers
                for (let x in titulos) {
                    if (this.chkHeader[x]!=titulos[x]) {
                        this.validaMensaje.push("Encabezado: " + titulos[x] + " fuera de secuencia");
                    }
                }

                // Limpiar lineas innecesarias

                var lineas = lineas.filter(function(linea){
                    return linea.Importe.trim() !== '0.00'
                });
                var lineas = lineas.filter(function(linea){
                    return linea.idproyecto !== '0'
                });

                // validar proyecto
                for(let i=0; i<lineas.length;i++){
                    if (this.idproyecto!=lineas[i].idproyecto){
                        this.validaMensaje.push("Existen Lineas de Presupuesto con Proyecto inválido");
                        break;
                    }
                }

                if (this.validaMensaje.length){
                    this.validaImp=true
                    return
                }


                // borrar presupuesto actual
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                for(var i=0; i<this.presupuestos.length;i++){
                    axios.delete('api/Presupuestos/Eliminar/'+this.presupuestos[i].idpresupuesto,
                    configuracion).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
                //cargar presupuesto nuevo
                for(var i=0; i<lineas.length;i++){
                    axios.post('api/Presupuestos/Crear',{
                        'idproyecto': lineas[i].idproyecto,
                        'iditem': lineas[i].iditem,
                        'idsubitem': lineas[i].idsubitem,
                        'importe': lineas[i].Importe,
                        'origen': 'xls',
                        'iduseralta': me.$store.state.usuario.idusuario,
                        'fecalta': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                    },configuracion).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
                me.limpiarDetail();                        
                this.dialogImport=false;
                this.dialog=false;
            }
        }
    }
</script>