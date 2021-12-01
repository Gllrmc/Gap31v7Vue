<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Proyectos Cerrados</v-toolbar-title>
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
                <v-dialog v-model="dialog" max-width="400px">
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <input type="checkbox" id="open" v-model="cierreadmin">
                                    <label for="open"> Cerre Administrativo?</label>
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
                            <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Proyecto?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Proyecto?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el proyecto {{ adNombre }}
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
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="proyectos"
                :search="search"
                class="elevation-1"
				>
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                    </td>
                    <td>{{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.cliente }}</td>
                    <td>{{ props.item.empresa }}</td>
                    <td>{{ props.item.origen }}</td>
                    <td>{{ props.item.territorio }}</td>
                    <td>{{ props.item.agencia }}</td>
                    <td>{{ props.item.productora }}</td>
                    <td>{{ props.item.director }}</td>
                    <td>{{ props.item.codirector }}</td>
                    <td>{{ props.item.ep }}</td>
                    <td>{{ props.item.lp }}</td>
                    <td>{{ props.item.cp }}</td>
                    <td>{{ props.item.ars1usd }}</td>
                    <td>{{ props.item.fecadjudicacion.substr(0, 10) }}</td>
                    <td>
                        <div v-if="props.item.fecdesdxd">
                            {{ props.item.fecdesdxd.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecdesdxd }}
                        </div>
                    </td>
                    <td>
                        <div v-if="props.item.fechasdxd">
                            {{ props.item.fechasdxd.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fechasdxd }}
                        </div>
                    </td>
                    <td>
                        <div v-if="props.item.fecdescf">
                            {{ props.item.fecdescf.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecdescf }}
                        </div>
                    </td>
                    <td>
                        <div v-if="props.item.fechascf">
                            {{ props.item.fechascf.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fechascf }}
                        </div>
                    </td>
                    <td>
                        <div v-if="props.item.fecrodaje">
                            {{ props.item.fecrodaje.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecrodaje }}
                        </div>
                    </td>
                    <td>
                        <div v-if="props.item.fecoffline">
                            {{ props.item.fecoffline.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecoffline }}
                        </div>
                    </td>
                    <td>
                        <div v-if="props.item.feconline">
                            {{ props.item.feconline.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.feconline }}
                        </div>
                    </td>
                    <td>{{ props.item.cierreprod }}</td>
                    <td>
                        <div v-if="props.item.feccierreprod">
                            {{ props.item.feccierreprod.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.feccierreprod }}
                        </div>
                    </td>                    
                    <td>{{ props.item.cierreadmin }}</td>
                    <td>
                        <div v-if="props.item.feccierreadmin">
                            {{ props.item.feccierreadmin.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.feccierreadmin }}
                        </div>
                    </td>                    
                    <td>
                        <div v-if="props.item.activo">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
                    <td>{{ props.item.iduseralta }}</td>
                    <td>{{ props.item.fecalta.substr(0, 16) }}</td>
                    <td>{{ props.item.iduserumod }}</td>
                    <td>{{ props.item.fecumod.substr(0, 16) }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Resetear</v-btn>
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
                fecadjudicacion: null,
                fecdesdxd: null,
                fechasdxd: null,
                fecdescf: null,
                fechascf: null,
                fecrodaje: null,
                fecoffline: null,
                feconline: null,
                menu: false,
                menu1: false,
                menu2: false,
                menu3: false,
                menu4: false,
                menu5: false,
                menu6: false,
                menu7: false,
                menu8: false,
                origenes:[],
                tipoprods:[],
                proyectos:[],
                empresas:[],
                territorios:[],
                agencias:[],
                productoras:[],
                clientes:[],
                raices:[],
                directores:[],
                eps:[],
                lps:[],
                cps:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'tipoprod', sortable: true },
                    { text: 'Tipo Producción', value: 'producto', sortable: true },
                    { text: 'Cliente', value: 'cliente', sortable: true },
                    { text: 'Empresa', value: 'empresa', sortable: true },
                    { text: 'Origen', value: 'origen', sortable: true },
                    { text: 'Territorio', value: 'territorio', sortable: true },
                    { text: 'Agencia', value: 'agencia', sortable: true },
                    { text: 'Productora', value: 'productora', sortable: true },
                    { text: 'Director', value: 'director', sortable: true },
                    { text: 'Co-Director', value: 'codirector', sortable: true },
                    { text: 'E.P.', value: 'ep', sortable: true },
                    { text: 'L.P.', value: 'lp', sortable: true },
                    { text: 'C.P.', value: 'cp', sortable: true },
                    { text: 'ARS/USD', value: 'ars1usd', sortable: true },
                    { text: 'Fec.Adjudicación', value: 'fecadjudicacion', sortable: true },
                    { text: 'Fec.Inicio DxD', value: 'fecdesdxd', sortable: true },
                    { text: 'Fec.Fin DxD', value: 'fechasdxd', sortable: true },
                    { text: 'Fec.Inicio CF', value: 'fecdescf', sortable: true },
                    { text: 'Fec.Fin CF', value: 'fechascf', sortable: true },
                    { text: 'Fec.Rodaje', value: 'fecrodaje', sortable: true },
                    { text: 'Fec.Offline', value: 'fecoffline', sortable: true },
                    { text: 'Fec.Online', value: 'feconline', sortable: true },
                    { text: 'CierreProd', value: 'cierreprod', sortable: true },
                    { text: 'Fec.Cierre Producción', value: 'feccierreprod', sortable: true },
                    { text: 'CierreAdm', value: 'cierreadmin', sortable: true },
                    { text: 'Fec.Cierre Administración', value: 'feccierreadmin', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  },           
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],
                search: '',
                editedIndex: -1,
                idproyecto: '',
                idraiz: '',
                orden:'',
                proyecto:'',
                idtipoprod:'',
                idempresa:'',
                idorigen:'',
                idagencia:'',
                idproductora:'',
                idcliente:'',
                iddirector:'',
                idep:'',
                idlp:'',
                idcp:'',
                ars1usd:0,
                cierreprod:'',
                feccierreprod:'',
                cierreadmin:false,
                feccierreadmin:'',
                iduseralta:'',
                fecalta:'',
                iduserumod:'',
                fecumod:'',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''                         }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo proyecto' : 'Actualizar proyecto'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
        },

        created () {
            this.listar();
            this.select();
        },
        methods:{
            crearPDF(){
                var columns = [
                    {title: "#Proyecto", dataKey: "orden"},
                    {title: "Proyecto", dataKey: "proyecto"},
                    {title: "Tipo Produccion", dataKey: "tipoprod"},
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

                this.proyectos.map(function(x){
                    rows.push({orden:x.orden, proyecto:x.proyecto, tipoprod:x.tipoprod, cliente:x.cliente, empresa:x.empresa,
                    director:x.director, ep: x.ep, fecadjudicacion: x.fecadjudicacion, fecdesdxd: x.fecdesdxd,
                    fecoffline:x.offline, feconline:x.online, fecrodaje:x.fecrodaje});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Proyectos", 40, 30);
                    }
                });
                doc.save('Proyectos.pdf');
            },
            selectProyectosDeCliente(){
                let me=this;
                if (me.idcliente){
                    var proyectoRaizArray = [];
                    this.idraiz = "";
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    axios.get('api/Proyectos/SelectProyectosDeCliente/'+this.idcliente,configuracion)
                    .then(function(response){
                        //console.log(response);
                        proyectoRaizArray=response.data;
                        proyectoRaizArray.map(function(x){
                            me.raices.push({text: x.orden + ' ' + x.proyecto,value: x.idproyecto});
                        });
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me. snackbar = true;
                        console.log(error);
                    });
                }
            },            
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Proyectos/Listarhistorico',configuracion).then(function(response){
                    //console.log(response);
                    me.proyectos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var origenesArray=[];
                var tipoprodsArray=[];
                var empresasArray=[];
                var territoriosArray=[];
                var agenciasArray=[];
                var productorasArray=[];
                var directoresArray=[];
                var epsArray=[];
                var lpsArray=[];
                var cpsArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Origenes/Select',configuracion).then(function(response){
                    //console.log(response);
                    origenesArray=response.data;
                    origenesArray.map(function(x){
                        me.origenes.push({text: x.origen,value:x.idorigen});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Tipoprods/Select',configuracion).then(function(response){
                    //console.log(response);
                    tipoprodsArray=response.data;
                    tipoprodsArray.map(function(x){
                        me.tipoprods.push({text: x.tipoprod,value:x.idtipoprod});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Empresas/Select',configuracion).then(function(response){
                    //console.log(response);
                    empresasArray=response.data;
                    empresasArray.map(function(x){
                        me.empresas.push({text: x.empresa,value:x.idempresa});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
                axios.get('api/Territorios/Select',configuracion).then(function(response){
                    //console.log(response);
                    territoriosArray=response.data;
                    territoriosArray.map(function(x){
                        me.territorios.push({text: x.territorio,value:x.idterritorio});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
				axios.get('api/Agencias/Select',configuracion).then(function(response){
                    //console.log(response);
                    agenciasArray=response.data;
                    agenciasArray.map(function(x){
                        me.agencias.push({text: x.agencia,value:x.idagencia});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
				axios.get('api/Productoras/Select',configuracion).then(function(response){
                    //console.log(response);
                    productorasArray=response.data;
                    productorasArray.map(function(x){
                        me.productoras.push({text: x.productora,value:x.idproductora});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
                var clientesArray=[];
				axios.get('api/Clientes/Select',configuracion).then(function(response){
                    //console.log(response);
                    clientesArray=response.data;
                    clientesArray.map(function(x){
                        me.clientes.push({text: x.razonsocial,value:x.idcliente, activo:x.activo});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
				axios.get('api/Personas/SelectDirectores',configuracion).then(function(response){
                    //console.log(response);
                    directoresArray=response.data;
                    directoresArray.map(function(x){
                        me.directores.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
				axios.get('api/Personas/SelectEps',configuracion).then(function(response){
                    //console.log(response);
                    epsArray=response.data;
                    epsArray.map(function(x){
                        me.eps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
				axios.get('api/Personas/SelectLps',configuracion).then(function(response){
                    //console.log(response);
                    lpsArray=response.data;
                    lpsArray.map(function(x){
                        me.lps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
				axios.get('api/Personas/SelectCps',configuracion).then(function(response){
                    //console.log(response);
                    cpsArray=response.data;
                    cpsArray.map(function(x){
                        me.cps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
            },
            editItem (item) {
                // console.log(item);
                this.idproyecto = item.idproyecto;
                this.idcliente = item.idcliente;
                this.selectProyectosDeCliente();
                this.idraiz = item.idraiz;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.idtipoprod = item.idtipoprod;
                this.idempresa = item.idempresa;
                this.idorigen = item.idorigen;
                this.idagencia = item.idagencia;
                this.idproductora = item.idproductora;
                this.iddirector = item.iddirector;
                this.idcodirector = item.idcodirector;
                this.idep = item.idep;
                this.idlp = item.idlp;
                this.idcp = item.idcp;
                this.ars1usd = item.ars1usd;
                this.fecadjudicacion = item.fecadjudicacion.substr(0, 10);
                this.fecdesdxd = item.fecdesdxd?item.fecdesdxd.substr(0, 10):item.fecdesdxd;
                this.fechasdxd = item.fechasdxd?item.fechasdxd.substr(0, 10):item.fechasdxd;
                this.fecdescf = item.fecdescf?item.fecdescf.substr(0, 10):item.fecdescf;
                this.fechascf = item.fechascf?item.fechascf.substr(0, 10):item.fechascf;
                this.fecrodaje = item.fecrodaje?item.fecrodaje.substr(0, 10):item.fecrodaje;
                this.fecoffline = item.fecoffline?item.fecoffline.substr(0, 10):item.fecoffline;
                this.feconline = item.fecoffline?item.feconline.substr(0, 10):item.fecoffline;
                this.cierreprod = item.cierreprod;
                this.feccierreprod = item.feccierreprod;
                this.cierreadmin = item.cierreadmin;
                this.feccierreadmin = item.feccierreadmin;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idproyecto = "";
                this.idraiz = "";
                this.orden = "";
                this.proyecto = "";
                this.idtipoprod = "";
                this.idempresa = "";
                this.idorigen = "";
                this.idagencia = "";
                this.idproductora = "";
                this.idcliente = "";
                this.iddirector = "";
                this.idcodirector = "";
                this.idep = "";
                this.idlp = "";
                this.idcp = "";
                this.ars1usd = "";
                this.fecadjudicacion = "";
                this.fecdesdxd = "";
                this.fechasdxd = "";
                this.fecdescf = "";
                this.fechascf = "";
                this.fecrodaje = "";
                this.fecoffline = "";
                this.feconline = "";
                this.cierreprod = "";
                this.feccierreprod = "";
                this.cierreadmin = false;
                this.feccierreadmin = "";
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.raices = [];
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
                    // console.log(me);
                    axios.put('api/Proyectos/Actualizar',{
                        'idproyecto': me.idproyecto,
                        'idraiz': me.idraiz,
                        'orden': me.orden,
                        'proyecto': me.proyecto,
                        'idorigen': me.idorigen,
                        'idempresa': me.idempresa,
                        'idtipoprod': me.idtipoprod,
                        'idagencia': me.idagencia,
                        'idproductora': me.idproductora,
                        'idcliente': me.idcliente,
                        'iddirector': me.iddirector,
                        'idcodirector': me.idcodirector,
                        'idep': me.idep,
                        'idlp': me.idlp,
                        'idcp': me.idcp,
                        'ars1usd': me.ars1usd,
                        'fecadjudicacion': me.fecadjudicacion,
                        'fecdesdxd': me.fecdesdxd,
                        'fechasdxd': me.fechasdxd,
                        'fecdescf': me.fecdescf,
                        'fechascf': me.fechascf,
                        'fecrodaje': me.fecrodaje,
                        'fecoffline': me.fecoffline,
                        'feconline': me.feconline,
                        'cierreprod': me.cierreprod,
                        'feccierreprod': me.feccierreprod,
                        'cierreadmin': me.cierreadmin,
                        'feccierreadmin': me.feccierreadmin,
                        'iduseralta': me.iduseralta,
                        'fecalta': me.fecalta,
                        'iduserumod': me.$store.state.usuario.idusuario,
                        'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me. snackbar = true;
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    // console.log(me);
                    axios.post('api/Proyectos/Crear',{
                        'idraiz': me.idraiz,
                        'orden': me.orden,
                        'idtipoprod': me.idtipoprod,
                        'idorigen': me.idorigen,
                        'idempresa': me.idempresa,
                        'idtipoprod': me.idtipoprod,
                        'idagencia': me.idagencia,
                        'idproductora': me.idproductora,
                        'idcliente': me.idcliente,
                        'iddirector': me.iddirector,
                        'idcodirector': me.idcodirector,
                        'idep': me.idep,
                        'idlp': me.idlp,
                        'idcp': me.idcp,
                        'ars1usd': me.ars1usd,
                        'fecadjudicacion': me.fecadjudicacion,
                        'fecdesdxd': me.fecdesdxd,
                        'fechasdxd': me.fechasdxd,
                        'fecdescf': me.fecdescf,
                        'fechascf': me.fechascf,
                        'fecrodaje': me.fecrodaje,
                        'fecoffline': me.fecoffline,
                        'feconline': me.feconline,
                        'iduseralta': me.$store.state.usuario.idusuario,
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me. snackbar = true;
                        console.log(error);
                    });
                }
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (!this.orden){
                    this.validaMensaje.push("Ingrese #Proyecto generado en Gecom.");
                }
                if (this.proyecto.length<3 || this.proyecto.length>50){
                    this.validaMensaje.push("El proyecto debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (!this.idtipoprod){
                    this.validaMensaje.push("Ingrese una tipo de producción.");
                }
                if (!this.idorigen){
                    this.validaMensaje.push("Ingrese un origen.");
                }
                if (!this.iddirector){
                    this.validaMensaje.push("Ingrese un Director.");
                }
                if (!this.idep){
                    this.validaMensaje.push("Ingrese un EP.");
                }
                if (!this.fecadjudicacion){
                    this.validaMensaje.push("Ingrese fecha de adjudicacion.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.orden + '|' + item.proyecto;
                this.adId=item.idproyecto;                
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
                axios.put('api/Proyectos/Activar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Proyectos/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me. snackbar = true;
                    console.log(error);
                });
            }
        }        
    }
</script>
