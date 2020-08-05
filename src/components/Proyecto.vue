<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Proyecto</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="1000px">
                        <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>            
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs6 sm6 md6>
                                        <v-text-field v-model="proyecto" label="Proyecto">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 sm6 md6>
                                        <v-text-field v-model="producto" label="Producto">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 sm6 md6>
                                        <v-select v-model="idcliente"
                                        @change="selectProyectosDeCliente()"
                                        :items = "clientes" label = "Cliente">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs6 sm6 md6>
                                        <v-select v-model="idraiz"
                                        :items = "raices" label = "Proyecto Raíz">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idempresa"
                                        :items = "empresas" label = "Empresa">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idterritorio"
                                        :items = "territorios" label = "Territorio">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idagencia"
                                        :items = "agencias" label = "Agencia">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idproductora"
                                        :items = "productoras" label = "Productora">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="iddirector"
                                        :items = "directores" label = "Director">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idep"
                                        :items = "eps" label = "E.P.">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idlp"
                                        :items = "lps" label = "L.P.">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-select v-model="idcp"
                                        :items = "cps" label = "C.P.">
                                        </v-select>
                                    </v-flex>
                                    <template>
                                        <v-flex xs12 sm3 md3>
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
                                                        v-model="fecadjudicacion"
                                                        label="Fecha Adjudicación"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="fecadjudicacion" @input="menu1 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
                                            <v-menu
                                                v-model="menu6"
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
                                                        v-model="fecrodaje"
                                                        label="Rodaje"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="fecrodaje" @input="menu6 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
                                            <v-menu
                                                v-model="menu7"
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
                                                        v-model="fecoffline"
                                                        label="Offline"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="fecoffline" @input="menu7 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
                                            <v-menu
                                                v-model="menu8"
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
                                                        v-model="feconline"
                                                        label="Online"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="feconline" @input="menu8 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
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
                                                        v-model="fecdesdxd"
                                                        label="Inicio DxD"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker 
                                                    v-model="fecdesdxd" 
                                                    @input="menu2 = false">
                                                </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
                                            <v-menu
                                                v-model="menu3"
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
                                                        v-model="fechasdxd"
                                                        label="Fin DxD"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker 
                                                    v-model="fechasdxd"
                                                    :min = "fecdesdxd" 
                                                    @input="menu3 = false">
                                                </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
                                            <v-menu
                                                v-model="menu4"
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
                                                        v-model="fecdescf"
                                                        label="Inicio CF"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="fecdescf" @input="menu4 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <template>
                                        <v-flex xs12 sm3 md3>
                                            <v-menu
                                                v-model="menu5"
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
                                                        v-model="fechascf"
                                                        label="Fin CF"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker 
                                                    v-model="fechascf"
                                                    :min = "fecdescf" 
                                                    @input="menu5 = false">
                                                </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </template>
                                    <v-flex xs3 sm3 md3>
                                        <v-text-field type="number" v-model="ars1usd" label="ARS/USD">
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
                    </v-dialog>                </v-toolbar>
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
                        </template>                    </td>
                    <td>{{ props.item.idproyecto }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.producto }}</td>
                    <td>{{ props.item.cliente }}</td>
                    <td>{{ props.item.empresa }}</td>
                    <td>{{ props.item.territorio }}</td>
                    <td>{{ props.item.agencia }}</td>
                    <td>{{ props.item.productora }}</td>
                    <td>{{ props.item.director }}</td>
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
                    <td>{{ props.item.feccierreprod }}</td>
                    <td>{{ props.item.cierreadmin }}</td>
                    <td>{{ props.item.feccierreadmin }}</td>
                    <td>{{ props.item.iduseralta }}</td>
                    <td>{{ props.item.fecalta }}</td>
                    <td>{{ props.item.iduserumod }}</td>
                    <td>{{ props.item.fecumod }}</td>
                    <td>
                        <div v-if="props.item.activo">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
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
                    { text: 'Id', value: 'idproyecto', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Producto', value: 'producto', sortable: true },
                    { text: 'Cliente', value: 'cliente', sortable: true },
                    { text: 'Empresa', value: 'empresa', sortable: true },
                    { text: 'Territorio', value: 'territorio', sortable: true },
                    { text: 'Agencia', value: 'agencia', sortable: true },
                    { text: 'Productora', value: 'productora', sortable: true },
                    { text: 'Director', value: 'director', sortable: true },
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
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                search: '',
                editedIndex: -1,
                idproyecto: '',
                idraiz: '',
                proyecto:'',
                producto:'',
                idempresa:'',
                idterritorio:'',
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
                cierreadmin:'',
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

                this.proyectos.map(function(x){
                    rows.push({proyecto:x.proyecto, producto:x.producto, cliente:x.cliente, empresa:x.empresa,
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
                var proyectoRaizArray = [];
                this.idraiz = "";
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Proyectos/SelectProyectosDeCliente/'+this.idcliente,configuracion)
                .then(function(response){
                    //console.log(response);
                    proyectoRaizArray=response.data;
                    proyectoRaizArray.map(function(x){
                        me.raices.push({text: x.proyecto,value:x.idproyecto});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },            
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Proyectos/Listar',configuracion).then(function(response){
                    console.log(response);
                    me.proyectos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me=this;
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
				axios.get('api/Empresas/Select',configuracion).then(function(response){
                    //console.log(response);
                    empresasArray=response.data;
                    empresasArray.map(function(x){
                        me.empresas.push({text: x.empresa,value:x.idempresa});
                    });
                }).catch(function(error){
                    console.log(error);
                });
                axios.get('api/Territorios/Select',configuracion).then(function(response){
                    //console.log(response);
                    territoriosArray=response.data;
                    territoriosArray.map(function(x){
                        me.territorios.push({text: x.territorio,value:x.idterritorio});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Agencias/Select',configuracion).then(function(response){
                    //console.log(response);
                    agenciasArray=response.data;
                    agenciasArray.map(function(x){
                        me.agencias.push({text: x.agencia,value:x.idagencia});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Productoras/Select',configuracion).then(function(response){
                    //console.log(response);
                    productorasArray=response.data;
                    productorasArray.map(function(x){
                        me.productoras.push({text: x.productora,value:x.idproductora});
                    });
                }).catch(function(error){
                    console.log(error);
                });
                var clientesArray=[];
				axios.get('api/Clientes/Select',configuracion).then(function(response){
                    //console.log(response);
                    clientesArray=response.data;
                    clientesArray.map(function(x){
                        me.clientes.push({text: x.razonsocial,value:x.idcliente});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Personas/SelectDirectores',configuracion).then(function(response){
                    //console.log(response);
                    directoresArray=response.data;
                    directoresArray.map(function(x){
                        me.directores.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Personas/SelectEps',configuracion).then(function(response){
                    //console.log(response);
                    epsArray=response.data;
                    epsArray.map(function(x){
                        me.eps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Personas/SelectLps',configuracion).then(function(response){
                    //console.log(response);
                    lpsArray=response.data;
                    lpsArray.map(function(x){
                        me.lps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Personas/SelectCps',configuracion).then(function(response){
                    //console.log(response);
                    cpsArray=response.data;
                    cpsArray.map(function(x){
                        me.cps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.idproyecto = item.idproyecto;
                this.idcliente = item.idcliente;
                this.selectProyectosDeCliente();
                this.idraiz = item.idraiz;
                this.proyecto = item.proyecto;
                this.producto = item.producto;
                this.idempresa = item.idempresa;
                this.idterritorio = item.idterritorio;
                this.idagencia = item.idagencia;
                this.idproductora = item.idproductora;
                this.iddirector = item.iddirector;
                this.idep = item.idep;
                this.idlp = item.idlp;
                this.idcp = item.idcp;
                this.ars1usd = item.ars1usd;
                this.fecadjudicacion = item.fecadjudicacion.substr(0, 10);
                if (item.fecdesdxd ) {
                    this.fecdesdxd = item.fecdesdxd.substr(0, 10);
                }
                else{
                    this.fecdesdxd = item.fecdesdxd;
                }
                if (item.fechasdxd){
                    this.fechasdxd = item.fechasdxd.substr(0, 10);
                }
                else{
                    this.fechasdxd = item.fechasdxd;
                }
                if (item.fecdescf){
                    this.fecdescf = item.fecdescf.substr(0, 10);
                }
                else{
                    this.fecdescf = item.fecdescf;
                }
                if (item.fechascf){
                    this.fechascf = item.fechascf.substr(0, 10);
                }
                else{
                    this.fechascf = item.fechascf;
                }
                if (item.fecrodaje){
                    this.fecrodaje = item.fecrodaje.substr(0, 10);
                }
                else{
                    this.fecrodaje = item.fecrodaje;
                }
                if (item.fecoffline){
                    this.fecoffline = item.fecoffline.substr(0, 10);
                }
                else{
                    this.fecoffline = item.fecoffline
                }
                if (item.feconline){
                    this.feconline = item.feconline.substr(0, 10);
                }
                else{
                    this.feconline = item.feconline;
                }
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
                this.proyecto = "";
                this.producto = "";
                this.idempresa = "";
                this.idterritorio = "";
                this.idagencia = "";
                this.idproductora = "";
                this.idcliente = "";
                this.iddirector = "";
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
                this.cierreadmin = "";
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
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    let me=this;
                    console.log(me);
                    axios.put('api/Proyectos/Actualizar',{
                        'idproyecto': me.idproyecto,
                        'idraiz': me.idraiz,
                        'proyecto': me.proyecto,
                        'producto': me.producto,
                        'idempresa': me.idempresa,
                        'idterritorio': me.idterritorio,
                        'idagencia': me.idagencia,
                        'idproductora': me.idproductora,
                        'idcliente': me.idcliente,
                        'iddirector': me.iddirector,
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
                        'fecumod': new Date().toISOString()
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    console.log(me);
                    axios.post('api/Proyectos/Crear',{
                        'idraiz': me.idraiz,
                        'proyecto': me.proyecto,
                        'producto': me.producto,
                        'idempresa': me.idempresa,
                        'idterritorio': me.idterritorio,
                        'idagencia': me.idagencia,
                        'idproductora': me.idproductora,
                        'idcliente': me.idcliente,
                        'iddirector': me.iddirector,
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
                        console.log(error);
                    });
                }
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (this.proyecto.length<3 || this.proyecto.length>50){
                    this.validaMensaje.push("El proyecto debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (!this.idempresa){
                    this.validaMensaje.push("Ingrese una empresa.");
                }
                if (!this.idterritorio){
                    this.validaMensaje.push("Ingrese un territorio.");
                }
                if (!this.idagencia){
                    this.validaMensaje.push("Ingrese una agencia.");
                }
                if (!this.idproductora){
                    this.validaMensaje.push("Ingrese una productora.");
                }
                if (!this.idcliente){
                    this.validaMensaje.push("Ingrese un cliente.");
                }
                if (!this.iddirector){
                    this.validaMensaje.push("Ingrese un Director.");
                }
                if (!this.idep){
                    this.validaMensaje.push("Ingrese un EP.");
                }
                if (!this.ars1usd){
                    this.validaMensaje.push("Ingrese tipo de cambio ARS/USD.");
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
                this.adNombre=item.proyecto;
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
                    console.log(error);
                });
            }
        }        
    }
</script>
