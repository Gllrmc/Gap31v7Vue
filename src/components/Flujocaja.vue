<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Flujos de Caja - Proyectos</v-toolbar-title>
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
                v-model="eliminar"
                max-width="550"
                >
                <v-card>
                    <v-card-title class="headline">¿Deseas eliminar el flujo?</v-card-title>
                    <v-card-text>
                        Estas a punto de eliminar el flujo de caja de este proyecto.<br/> Esto significa que se eliminarán todos los registros semanales de todos los rubros del flujo de caja del proyecto tratado.<br/> Los % de distribución no podrán ser recuperados.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        color="blue darken-1"
                        flat
                        @click="eliminar = false"
                        >
                        Cancelar
                        </v-btn>
                        <v-btn
                        color="success"
                        flat
                        @click="borrar"
                        >
                        Aceptar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialog" max-width="800px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Flujo de Caja #{{orden}}: {{proyecto}} </span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="600px">
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs7 sm7 md7>
                                            <v-text-field 
                                                v-model="rubro" 
                                                label="Rubro"
                                                disabled>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs3 sm3 md3>
                                            <v-text-field 
                                                v-model="yearweek" 
                                                label="#Semana"
                                                disabled>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field 
                                                v-model="tasadistribucion" 
                                                label="Distribución"
                                                prefix="%">
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
                        <v-flex xs4>
                            <v-select
                                :items="rubros"
                                label="Rubro"
                                v-model="search"
                            ></v-select>
                        </v-flex>                                                    
                        <v-data-table
                            :headers="headersDetalle"
                            :items="flujocajas"
                            class="elevation-1"
                            :search="search"
                            :custom-filter="customFilter"                            
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
                                </td>
                                <td>{{ props.item.yearweek }}</td>
                                <td>{{ props.item.fromto }}</td>
                                <td>{{ props.item.tasadistribucion * 100 }}%</td>
                                <!-- <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                                <td>{{ props.item.fecalta.substr(0, 16) }}</td>
                                <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                                <td>{{ props.item.fecumod.substr(0, 16) }}</td> -->
                            </template>
                            <template v-slot:no-data>
                                <v-layout>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" dark class="mb-2" @click.native="createDetail()">Crear</v-btn>
                                </v-layout>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Total Asignado: </strong>% {{totalAsignado=(calcularTotal).toFixed(2)}}
                        </v-flex>  
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" dark class="mb-2" @click.native="checkDetail">Salir</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <template>
            <v-dialog v-model="totales" persistent max-width="500">
                <v-card>
                    <v-card-title class="headline">Porcentajes Cargados por Rubro</v-card-title>
                    <v-card-text>
                        <div class="blue--text" v-for="v in totalesRubros" :key="v" v-text="v">
                        </div>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="totales = 0">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            </template>            
            <v-data-table
                :headers="headers"
                :items="proyectos"
                :search="search"
                class="elevation-1"
                >
                <template v-if="!props.item.cierreprod" slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon v-if="props.item.fecdescf && props.item.fechascf"
                        small
                        class="mr-2"
                        @click="editMasterItem(props.item)"
                        >
                        tab
                        </v-icon>
                        <v-icon v-if="props.item.fecdescf && props.item.fechascf"
                        small
                        class="mr-2"
                        @click="deleteAsk(props.item)"
                        >
                        delete_forever
                        </v-icon>
                    </td>
                    <td class="text-xs-center"> {{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.fecadjudicacion.substr(0, 10) }}</td>
                    <td>{{ props.item.fecdescf ? props.item.fecdescf.substr(0, 10) : props.item.fecdescf }}</td>
                    <td>{{ props.item.fechascf ? props.item.fechascf.substr(0, 10) : props.item.fechascf }}</td>
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
    import moment from 'moment';
    export default {
        data: () => {
            return {
            snackbar:false,
            snacktext: 'Hola',
            timeout: 4000,
            page: 1,
            // Arrays
            rubros: [],
            proyectos:[],
            flujocajas:[],
            // Detail
            idflujocaja: '',
            idproyecto: '',
            idrubro: '',
            rubro: '',
            yearweek: '',
            fromto: '',
            tasadistribucion: '',
            importe: '',
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
            fecdescf: '',
            fechascf: '',
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
                { text: 'Fec.Inicio CF', value: 'fecdescf', sortable: true },
                { text: 'Fec.Fin CF', value: 'fechascf', sortable: true },
                { text: 'Tipo de cambio', value: 'ars1usd', sortable: true },
            ],
            headersDetalle: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: '#Semana', value: 'yearweek', sortable: true},
                { text: 'Desde-Hasta', value: 'fromto', sortable: true },
                { text: '%Distribucion', value: 'tasadistribucion', sortable: true }                               
                // { text: 'Creado', value: 'iduseralta', sortable: true },
                // { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                // { text: 'UltMod', value: 'iduserumod', sortable: true },
                // { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
            ],              
            search: '',
            editedIndex: -1,
            valida: 0,
            validaMensaje:[],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: '',
            eliminar: false,
            totalAsignado: 0,
            totalesRubros:[],
            totales: 0
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Error en Logica' : 'Actualizar Distribucion'
            },
        calcularTotal:function(){
                var resultado=0.0;
                for(var i=0;i<this.flujocajas.length;i++){
                    if (this.search == this.flujocajas[i].idrubro){
                        resultado=resultado+(this.flujocajas[i].activo?this.flujocajas[i].tasadistribucion:0);
                    }
                }
                return resultado * 100;
            }                             
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
            customFilter(items, search, filter) {
                search = search.toString().toLowerCase()
                return items.filter(row => row["idrubro"].toString()===search);

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
                axios.get('api/Flujocajas/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    // console.log(response);
                    me.flujocajas=response.data;
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
                var rubrosArray=[];
                axios.get('api/Rubros/Select',configuracion).then(function(response){
                    rubrosArray=response.data;
                    rubrosArray.map(function(x){
                        me.rubros.push({text: x.orden+': '+x.rubroes, value: x.idrubro });
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
                this.fecdescf = item.fecdescf?item.fecdescf.substr(0, 10):item.fecdescf;
                this.fechascf = item.fechascf?item.fechascf.substr(0, 10):item.fechascf;
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idflujocaja = item.idflujocaja;
                this.idproyecto = item.idproyecto;
                this.idrubro = item.idrubro;
                this.rubro = item.rubroorden + ': ' + item.rubroes;
                this.yearweek = item.yearweek;
                this.fromto = item.fromto;
                this.tasadistribucion = (item.tasadistribucion*100);
                this.importe = item.importe;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.editedIndex=1;
                this.dialogForm = true
            },
            createDetail(){
                let me=this;
                for (var x=0; x<this.rubros.length;x++){
                    for (var y=moment(me.fecdescf, "YYYY-MM-DD").weekYear() * 100 + moment(me.fecdescf, "YYYY-MM-DD").week();
                        y<=moment(me.fechascf, "YYYY-MM-DD").weekYear() * 100 + moment(me.fechascf, "YYYY-MM-DD").week();
                        y++){
                        this.idrubro = me.rubros[x].value;
                        this.yearweek = y
                        this.fromto = moment(y, "YYYYWW").startOf('week').format("DD-MM-YYYY") + "/" + moment(y, "YYYYWW").endOf('week').format("DD-MM-YYYY")
                        me.crear();
                    };
                };
                this.listarDetail();
                this.editIndex=-1;
                this.dialog = true;
                this.dialogForm = false;
            },
            deleteAsk(item){
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.proyecto = item.proyecto;                                  
                this.listarDetail();
                this.dialog = false;
                this.eliminar= true;
            },
            cancelarBorrar(){
                this.eliminar= false;
                this.dialog= false;
            },
            crear(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(me);
                axios.post('api/Flujocajas/Crear',{
                        'idproyecto': me.idproyecto,
                        'idrubro': me.idrubro,
                        'yearweek': me.yearweek,
                        'fromto': me.fromto,
                        'tasadistribucion': 0,
                        'importe': 0,
                        'iduseralta': me.$store.state.usuario.idusuario
                },configuracion).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });                
            },
            borrar(){
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                var i = 0;
                //console.log(this.flujocajas.length, this);
                for(var i=0; i<this.flujocajas.length;i++){
                    //console.log(this.flujocajas[i].idflujocaja);
                    axios.delete('api/Flujocajas/Eliminar/'+this.flujocajas[i].idflujocaja,
                    configuracion).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
                this.eliminar = false;
                this.closeDetail();               
            },
            checkDetail(){
                let me=this;
                me.totales = 0;
                var flujoRubro=[];
                me.totalesRubros = [];
                for (var x=0; x<me.rubros.length;x++){
                    flujoRubro = me.flujocajas.filter(z => z.idrubro===me.rubros[x].value);
                    var resultado=0.0;
                    for(var i=0;i<flujoRubro.length;i++){
                        resultado=resultado+(flujoRubro[i].activo?flujoRubro[i].tasadistribucion:0);
                    }
                    resultado = parseFloat(resultado * 100).toFixed(2);
                    while (resultado.length < 6 ) {
                            resultado = "0".concat(resultado);
                    }                    
                    me.totalesRubros.push(resultado + "% - [" + me.rubros[x].text + "]" );
                }
                me.totales = 1;
                this.closeDetail();               
            },
            closeDetail () {
                this.dialog = false;
                this.limpiarMaster();
            },
            closeForm () {
                this.dialogForm = false;
                this.validaMensaje = [];
                this.totalesRubros = [];
                this.limpiarDetail();
            },
            limpiarMaster(){
                this.idproyecto = '';                
                this.orden = '';
                this.proyecto = '';
                this.producto = '';
                this.fecadjudicacion = '';
                this.ars1usd = '';
                this.search='';                              
            },
            limpiarDetail() {
                this.idfuljocaja = '';
                this.rubro = '';
                this.yearweek = '';
                this.fromto = '',
                this.tasadistribucion = '';
                this.importe = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.editedIndex=-1;
                /*this.search='';
                */
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
                    axios.put('api/Flujocajas/Actualizar',{
                        'idflujocaja': me.idflujocaja,
                        'idproyecto': me.idproyecto,
                        'idrubro': me.idrubro,
                        'yearweek': me.yearweek,
                        'fromto': me.fromto,
                        'tasadistribucion': me.tasadistribucion / 100,
                        'importe': me.importe,
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
                    let me=this;
                    // console.log(me);
                    axios.post('api/Flujocajas/Crear',{
                        'idproyecto': me.idproyecto,
                        'idrubro': me.idrubro,
                        'yearweek': me.yearweek,
                        'fromto': me.fromto,
                        'tasadistribucion': me.tasadistribucion / 100,
                        'importe': me.importe,
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
                if (!this.tasadistribucion || this.tasadistribucion <= 0){ 
                    this.validaMensaje.push("Ingrese un valor positivo.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },

        }        
    }
</script>