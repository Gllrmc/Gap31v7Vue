<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Actividades Stop Motion - Proyectos</v-toolbar-title>
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
                    <span class="headline">Stop Motion del Proyecto #{{this.orden}}: {{this.proyecto}} </span>
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
                                        <v-flex xs12 sm12 md12> 
                                            <v-autocomplete 
                                                v-model="idproveedormotion"
                                                clearable 
                                                :items="proveedormotions" 
                                                label="Proveedor"
                                                :search-input.sync="searchp" 
                                                @input="calcularTarifa">
                                            </v-autocomplete>
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
                                                            v-model="fdesde"
                                                            label="Fecha Desde"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                            @change="fhasta=fdesde"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fdesde" 
                                                        locale="es"
                                                        @input="menu1 = false">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>   
                                        <template>
                                            <v-flex xs2 sm2 md2>
                                                <v-menu
                                                    ref="menud"
                                                    v-model="menu1t"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="tdesde"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        v-model="tdesde"
                                                        label="Hora Desde"
                                                        prepend-icon="access_time"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        v-if="menu1t"
                                                        v-model="tdesde"
                                                        format="24hr"
                                                        full-width
                                                        :allowed-minutes="allowedStep"
                                                        @click:minute="$refs.menud.save(tdesde)"
                                                    ></v-time-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
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
                                                            v-model="fhasta"
                                                            label="Fecha Hasta"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fhasta" 
                                                        :min = "fdesde"
                                                        :max = "tomorrow"
                                                        locale="es"
                                                        @input="menu2 = false">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>   
                                        <template>
                                            <v-flex xs2 sm2 md2>
                                                <v-menu
                                                    ref="menuh"
                                                    v-model="menu2t"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="thasta"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        v-model="thasta"
                                                        label="Hora Hasta"
                                                        prepend-icon="access_time"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                    v-if="menu2t"
                                                    v-model="thasta"
                                                    format="24hr"
                                                    full-width
                                                    :allowed-minutes="allowedStep"
                                                    @click:minute="$refs.menuh.save(thasta)"
                                                    ></v-time-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="hhee"
                                                label="Horas Extras"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>   
                                        <v-flex xs2 sm2 md2>
                                            <v-select v-model="porhhee"
                                            :items = "tipohhees" label = "Tipo HHEE"
                                            @input="calcularTarifa"
                                            >
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs3 sm3 md3 v-if="veimportes">
                                            <v-text-field v-model="impbase"
                                                label="Tarifa diaria"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>
                                        <v-flex xs3 sm3 md3 v-if="veimportes">
                                            <v-text-field v-model="imphhee"
                                                label="Adicional HHEE"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                                        
                                        <v-flex xs3 sm3 md3 v-if="veimportes">
                                            <v-text-field v-model="impjornada"
                                                label="Importe Jornada"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                         
                                        <v-flex xs3 sm3 md3>
                                            <v-text-field v-model="impjornadaadicional"
                                                label="Importe Adicional"
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
                                    <v-btn color="blue darken-1" flat @click.native="calcularDerivados">Calcular</v-btn>
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
                        :items="realmotions"
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
                                <td class="text-xs-center">{{ props.item.dtdesde.substr(0,16) }}</td>
                                <td class="text-xs-center">{{ props.item.dthasta.substr(0,16) }}</td>
                                <td class="text-xs-center">{{ props.item.hhee }}</td>
                                <td class="text-xs-center">{{ props.item.porhhee }}</td>
                                <td>{{ veimportes?formatPrice(props.item.impbase):"xxx.xx" }}</td>
                                <td>{{ veimportes?formatPrice(props.item.imphhee):"xxx.xx" }}</td>
                                <td>{{ veimportes?formatPrice(props.item.impjornada):"xxx.xx" }}</td>
                                <td>{{ formatPrice(props.item.impjornadaadicional) }}</td>
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
                veimportes: true,
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                menu1: false,
                menu1t: false,                    
                menu2: false,
                menu2t: false,

                tipohhees: [
                    {value: 0, text: 'HHEE 0%'},
                    {value: 50, text: 'HHEE 50%'},
                    {value: 100, text: 'HHEE 100%'}
                ],
                proyectos:[],
                realmotions:[],
                configs:[],
                proveedormotions:[],
                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
                // Detail    
                idrealmotion:'',
                idproveedormotion: '',
                dtdesde: '',
                fdesde: '',
                tdesde: '',                
                dthasta: '',
                fhasta: '',
                thasta: '',
                hhee: 0,
                porhhee: 0,
                impbase: 0,
                imphhee:0,
                impjornada: 0,
                impjornadaadicional: 0,
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
                    { text: 'FechaHora desde', value: 'fhdesde', sortable: true },
                    { text: 'FechaHora hasta', value: 'fhhasta', sortable: true },
                    { text: 'Horas Extras', value: 'hhee', sortable: true },
                    { text: '% HHEE', value: 'porhhee', sortable: true },
                    { text: 'Imp.Base', value: 'impbase'},
                    { text: 'Imp.HHEE', value: 'imphhee', sortable: true },
                    { text: 'Imp.Jornada', value: 'impjornada', sortable: true },
                    { text: 'Imp.Adicional', value: 'impjornadaadicional', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                                      
                ],                
                search: '',
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
                    return this.editedIndex === -1 ? 'Nueva actividad' : 'Actualizar actividad'
                },
                tomorrow(){
                    const date = this.fdesde ? new Date(this.fdesde): '';
                    return(date ? new Date(date.getTime() + (date.getTimezoneOffset() * 480000)).toISOString() : '');
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
            calcularTarifa(){
                let me=this;
                this.impbase=me.proveedormotions.filter(x => x.value===me.idproveedormotion).map(x => x.tarifadiaria)[0];
            },
            allowedHours: v => v % 1,
            allowedMinutes: v => v >= 0 && v <= 60,
            allowedStep: m => m % 15 === 0,
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
                if (this.$store.state.usuario.rol =='AsistProduccion'){
                    me.veimportes=false;
                }
            },
            listarDetail(){
                let me=this;
                var tarifaArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};      
                //console.log(configuracion);
                axios.get('api/Realmotions/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    me.realmotions=response.data;
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
                var configsArray=[];
                axios.get('api/Gapconfigs/Listar',configuracion).then(function(response){
                    configsArray=response.data;
                    configsArray.map(function(x){
                        me.configs.push({ parametro: x.parametro, valor: x.valor, texto: x.texto });
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });             
            },
            selectProveedoresmotion(){
                let me=this;
                var recursoArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Proveedormotions/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    recursoArray=response.data;
                    recursoArray.map(function(x){
                        me.proveedormotions.push({text: x.itemorden + ': ' + x.itemes + ' - ' + x.razonsocial +"/" + x.cuit, iditem: x.iditem, tarifadiaria: x.tarifadiaria, value:x.idproveedormotion});
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
                this.selectProveedoresmotion();
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                //console.log(item);
                this.idrealmotion = item.idrealmotion;
                this.idproveedormotion = item.idproveedormotion;
                this.dtdesde = item.dtdesde;
                this.fdesde = item.dtdesde.substr(0,10);
                this.tdesde = item.dtdesde.substr(11,5);
                this.dthasta = item.dthasta;
                this.fhasta = item.dthasta?item.dthasta.substr(0,10):item.dthasta;
                this.thasta = item.dthasta?item.dthasta.substr(11,5):item.dthasta;
                this.hhee = item.hhee;
                this.porhhee = item.porhhee;
                this.impbase = item.impbase;
                this.imphhee = item.imphhee;
                this.impjornada = item.impjornada;
                this.impjornadaadicional = item.impjornadaadicional;
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
                var date = new Date();
                this.idrealmotion = '';
                this.idproveedormotion = '';
                this.dtdesde =new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                this.fdesde = this.dtdesde.substr(0,10);
                this.tdesde = '00:00';
                this.dthasta = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                this.fhasta = this.dtdesde.substr(0,10);
                this.thasta = '00:00';
                this.hhee = 0;
                this.porhhee = 0;
                this.impbase = 0;
                this.imphhee = 0;
                this.impjornada = 0;
                this.impjornadaadicional = 0;
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.editedIndex=-1;
                this.searchp = "";
            },            
            guardar () {
                let me=this;
                me.calcularDerivados();
                if (this.validar()){
                    return;
                }
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    //console.log(me);
                    axios.put('api/Realmotions/Actualizar',{
                        'idrealmotion':me.idrealmotion,
                        'idproveedormotion':me.idproveedormotion,
                        'dtdesde':me.dtdesde,
                        'dthasta':me.dthasta,
                        'hhee':me.hhee,
                        'porhhee':me.porhhee,
                        'impbase':me.impbase,
                        'imphhee':me.imphhee,
                        'impjornada':me.impjornada,
                        'impjornadaadicional':me.impjornadaadicional,
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
                    axios.post('api/Realmotions/Crear',{
                        'idproveedormotion':me.idproveedormotion,
                        'dtdesde':me.dtdesde,
                        'dthasta':me.dthasta,
                        'hhee':me.hhee,
                        'porhhee':me.porhhee,
                        'impbase':me.impbase,
                        'imphhee':me.imphhee,
                        'impjornada':me.impjornada,
                        'impjornadaadicional':me.impjornadaadicional,
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
            calcularDerivados(){
                let me = this;
                const ddate = new Date(me.fdesde.concat("T").concat(me.tdesde));
                const hdate = new Date(me.fhasta.concat("T").concat(me.thasta));
                me.dtdesde = new Date(ddate.getTime() - (ddate.getTimezoneOffset() * 60000)).toISOString();
                me.dthasta = new Date(hdate.getTime() - (hdate.getTimezoneOffset() * 60000)).toISOString();
                const lapsoHoras = ( hdate.getTime() - ddate.getTime() ) / 1000 / 60 / 60;
                if (lapsoHoras < me.configs[8]["valor"] ){
                    me.hhee = 0;
                    me.porhhee = 0;
                    me.imphhee = 0;
                } else {
                    me.hhee = lapsoHoras - me.configs[8]["valor"];
                    me.imphhee = me.hhee * ( me.impbase / me.configs[8]["valor"] ) * ( 1 + me.porhhee / 100) ; 
                }
                me.impjornada = me.impbase + me.imphhee;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if (!this.idproveedormotion){
                    this.validaMensaje.push("Ingrese un Proveedor.");
                }
                if (!this.fdesde || !this.fhasta){
                    this.validaMensaje.push("Complete las fechas de la actividad.");
                }
                if (!this.tdesde || !this.thasta){
                    this.validaMensaje.push("Complete las horas de la actividad.");
                }
                if (this.fdesde == this.fhasta){
                    if (this.thasta<this.tdesde){
                        this.validaMensaje.push("Verifique el rango de horas.");
                    };
                }
                else{
                    if (this.fdesde != this.fhasta){
                        if (this.thasta>=this.tdesde){
                            this.validaMensaje.push("El rango total entre fechas y horas excede un día completo.");
                        };
                    }
                };
                if (!this.porhhee){
                    this.validaMensaje.push("Seleccione un Tipo de HHEE.");
                }
                if (!this.impjornadaadicional){
                    this.impjornadaadicional = 0;
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.itemorden+': '+item.itemes+'/'+ item.razonsocial;
                this.adId=item.idrealmotion;                
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
                axios.put('api/Realmotions/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Realmotions/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
