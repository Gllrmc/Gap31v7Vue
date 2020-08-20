<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Bolo DxD Shooting - Proyectos</v-toolbar-title>
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
                    <span class="headline">Staff asignado a Proyecto #{{this.orden}}: {{this.proyecto}} </span>
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
                                            :items = "subitems" label = "Subitem">
                                            </v-select>
                                        </v-flex>
                                        <template v-if="editedIndex==-1">
                                            <v-flex xs5 sm5 md5>
                                                <v-autocomplete 
                                                    v-model="idcrew" 
                                                    clearable 
                                                    :items="crews"
                                                    :search-input.sync="searchr" 
                                                    @change="cambioResponsable()"
                                                    label="Responsable">
                                                </v-autocomplete>                                            
                                            </v-flex>
                                        </template>
                                        <template v-else>
                                            <v-flex xs5 sm5 md5>
                                                <v-autocomplete 
                                                    v-model="idcrew" 
                                                    clearable
                                                    disabled
                                                    :items="crews"
                                                    :search-input.sync="searchr" 
                                                    @change="cambioResponsable()"
                                                    label="Responsable">
                                                </v-autocomplete>                                            
                                            </v-flex>
                                        </template>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field
                                                v-model="idcont"
                                                label="#Orden"
                                                disabled
                                                type="number">
                                            </v-text-field>
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
                                                    min-width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field
                                                            v-model="fecdesde"
                                                            label="Fecha Inicio"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fecdesde"
                                                        locale="es" 
                                                        @input="menu1 = false">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
                                        <template>
                                            <v-flex xs3 sm3 md3>
                                                <v-menu
                                                    v-model="menu2"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    min-width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field
                                                            v-model="fechasta"
                                                            label="Fecha Fin"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fechasta" 
                                                        :min = "fecdesde"
                                                        locale="es"
                                                        @input="menu2 = false">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field
                                                v-model="dias8hs"
                                                label="#Dias 8hs"
                                                type="number">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field
                                                v-model="dias12hs"
                                                label="#Dias 12hs"
                                                type="number">
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Crew?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Crew?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la asignación del Crew {{ adNombre }}
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
                        :items="recursosdxds"
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
                                <td class="text-xs-center">{{ props.item.cuil }}</td>
                                <td>{{ props.item.nombre }}</td>
                                <td>{{ props.item.idcont }}</td>                                
                                <td class="text-xs-center">{{ props.item.fecdesde?props.item.fecdesde.substr(0, 10):props.item.fecdesde }}</td>
                                <td class="text-xs-center">{{ props.item.fechasta?props.item.fechasta.substr(0, 10):props.item.fechasta }}</td>
                                <td class="text-xs-center">{{ props.item.dias8hs }}</td>
                                <td class="text-xs-center">{{ props.item.dias12hs }}</td>
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
                menu1: false,
                menu2: false,
                proyectos:[],
                crews:[],
                items:[],
                subitems:[],
                allsubitems:[],
                recursosdxds:[],
                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
                // Detail                    
                idrecursodxd: '',
                iditem: '',
                idsubitem: '',
                idcrew: '',
                idcont: '',
                fecdesde: null,
                fechasta: null,
                dias8hs:'',
                dias12hs:'',
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
                    { text: '#Item', value: 'itemorden', sortable: true },
                    { text: 'Detalle Item', value: 'itemes', sortable: true },
                    { text: '#Subitem', value: 'ordensubitem', sortable: true },
                    { text: 'CUIL', value: 'cuil', sortable: true },
                    { text: 'Nombre Completo', value: 'nombre', sortable: true },
                    { text: '#Orden', value: 'idcont', sortable: true },
                    { text: 'Fecha Desde', value: 'fecdesde', sortable: true },
                    { text: 'Fecha Hasta', value: 'fechasta', sortable: true },
                    { text: 'Días 8Hs', value: 'dias8hs', sortable: true },
                    { text: 'Días 12Hs', value: 'dias12hs', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                                      
                ],
                totalSolicitado: 0,
                totalEntregado: 0,
                totalDisponible: 0,                   
                search: '',
                searchi: '',
                searchr: '',
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
                axios.get('api/Recursodxds/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    me.recursosdxds=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var itemsArray=[];
                var crewArray=[];
                var allsubitemsArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Items/Selectdxd',configuracion).then(function(response){
                    //console.log(response);
                    itemsArray=response.data;
                    itemsArray.map(function(x){
                        me.items.push({text: x.item, value: x.iditem, vivo: x.vivo, post: x.post, conf: x.conf });
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Crews/Select',configuracion).then(function(response){
                    //console.log(response);
                    crewArray=response.data;
                    crewArray.map(function(x){
                        me.crews.push({text: x.nombre + '/CUIL:' + x.cuil, value:x.idcrew});
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
            cambioResponsable(){
                this.idcont='';
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
                this.idrecursodxd = item.idrecursodxd;
                this.iditem = item.iditem;
                this.selectSubitems();                
                this.idsubitem = item.idsubitem;
                this.idcrew = item.idcrew;
                this.idcont = item.idcont;
                this.fecdesde = item.fecdesde?item.fecdesde.substr(0,10):item.fecdesde;
                this.fechasta = item.fechasta?item.fechasta.substr(0,10):item.fechasta;
                this.dias8hs = item.dias8hs;
                this.dias12hs = item.dias12hs;
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
                this.idrecursodxd = '';
                this.iditem = '';
                this.idsubitem = '';
                this.idcrew = 0;
                this.idcont = '';
                this.fecdesde = '';
                this.fechasta = '';
                this.dias8hs = 0;
                this.dias12hs = 0;
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.editedIndex=-1;
                this.searchi = "";
                this.searchr = "";
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
                    //console.log(me);
                    axios.put('api/Recursodxds/Actualizar',{
                        'idrecursodxd': me.idrecursodxd,
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'idcrew': me.idcrew,
                        'idcont': me.idcont,
                        'fecdesde': me.fecdesde,
                        'fechasta': me.fechasta,
                        'dias8hs': me.dias8hs,
                        'dias12hs': me.dias12hs,
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
                    //console.log(me);
                    axios.post('api/Recursodxds/Crear',{
                        'idproyecto': me.idproyecto,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'idcrew': me.idcrew,
                        'fecdesde': me.fecdesde,
                        'fechasta': me.fechasta,
                        'dias8hs': me.dias8hs,
                        'dias12hs': me.dias12hs,                        
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
                if (!this.idcrew){
                    this.validaMensaje.push("Ingrese un Crew.");
                }
                if (!this.fecdesde || !this.fechasta){
                    this.validaMensaje.push("Verifique fechas de contratación.");
                }
                if (this.dias8hs<0 || this.dias12hs<0){
                    this.validaMensaje.push("Verifique que la cantidad de dias sean valores positivos.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId=item.idrecursodxd;                
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
                axios.put('api/Recursodxds/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Recursodxds/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
