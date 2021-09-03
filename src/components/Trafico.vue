<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <export-excel
                    :data   = "json_data"
                    :fields = "json_fields"
                    worksheet = "Trafico"
                    type    = "xls"
                    name    = "GAPdata.xls"      
                    >
                    <v-btn color="primary" dark class="mb-2" @click="crearXLS()">Exportar XLS</v-btn>
                </export-excel>
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Reunión de Tráfico</v-toolbar-title>
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
                    >
                </v-divider>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="limbos"
                :search="search"
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.ep }}</td>
                    <td>{{ props.item.origen }}</td>
                    <td>{{ props.item.territorio }}</td>
                    <td>{{ props.item.pitch }}</td>
                    <td>{{ props.item.director }}</td>
                    <td>{{ props.item.codirector }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.tipoproy }}</td>
                    <td>{{ props.item.estado }}</td>
                    <td>{{ props.item.fecingreso.substr(0, 10) }}</td>
                    <td>
                        <div v-if="props.item.fecadjudicacion">
                            {{ props.item.fecadjudicacion.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecadjudicacion }}
                        </div>
                    </td>
                    <td>{{ props.item.comentario?props.item.comentario.substr(0, 50):"" }}</td>
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
    import autoTable from 'jspdf-autotable';
    export default {
        data(){
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
                origenes:[],
                eps:[],
                pitchs:[],
                directores:[],
                tipoprods:[],
                tipoproys:[],
                estados:[],
                resultados:[],
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                dialog: false,
                headers: [
                    { text: 'Orden', value: 'orden' },
                    { text: 'Nombre del Proyecto', value: 'proyecto' },
                    { text: 'Executive Producer', value: 'ep' },
                    { text: 'Nombre del Origen', value: 'origen' },
                    { text: 'Territorio', value: 'territorio' },
                    { text: 'Tipo de Pitch', value: 'pitch' },
                    { text: 'Nombre Director', value: 'director' },
                    { text: 'Nombre Co-director', value: 'codirector' },
                    { text: 'Tipo Produción', value: 'tipoprod' },
                    { text: 'Tipo de Proyecto', value: 'tipoproy' },
                    { text: 'Estado', value: 'estado' },
                    { text: 'Fecha Ingreso', value: 'fecingreso' },
                    { text: 'Fecha Adjudic', value: 'fecadjudicacion' },
                    { text: 'Comentario', value: 'comentario' },
                ],
                search: '',
                editedIndex: -1,
                idlimbo:'',
                orden:'',
                proyecto:'',
                idep:'',
                ep:'',
                idorigen:'',
                origen:'',
                idpitch:'',
                pitch:'',
                iddirector:'',
                director:'',
                idcodirector:'',
                codirector:'',
                idtipoprod:'',
                tipoprod:'',
                impcosto:'',
                porcontingencia:'',
                porgastosfijo:'',
                porganancia:'',
                porfeedireccion:'',
                porotrosgastos:'',
                porcostofinanciero:'',
                porimpuestoycomision:'',
                impventa:'',
                porcontribucion:'',
                idtipoproy:'',
                tipoproy:'',
                idestado:'',
                estado:'',
                fecingreso:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().substr(0,10),
                fecadjudicacion:'',
                aprobacion:false,
                fecaprobacion:'',
                idresultado:'',
                resultado:'',
                comentario:'',
                ars1usd:0,
                iduseralta:'',
                fecalta:'',
                iduserumod:'',
                fecumod:'',                
                limbos:[                   
                ],
                validaMensaje:[],
                adAccion: 0,
                adNombre: '',
                adId: ''             
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo prospecto' : 'Actualizar prospecto'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.select();
            this.listar();
        },
        methods:{
            crearXLS(){
                this.json_fields = {
                    'Orden': 'orden',
                    'Proyecto': 'proyecto',
                    'ExecutiveProducer': 'ep',
                    'Origen': 'origen',
                    'Pitch': 'pitch',
                    'Director': 'director',
                    'CoDirector': 'codirector',
                    'TipoProduccion': 'tipoprod',
                    'TipoProyecto': 'tipoproy',
                    'Estado': 'activo',
                    'FechaIngreso': {field: 'fecingreso',
                        callback: (value) => {return value.substr(0,10)}
                        },
                    'FechaAdjud.': {field: 'fecadjudicacion',
                        callback: (value) => {return value.substr(0,10)}
                        },
                    'Comentario': 'comentario',
                },
                this.json_data = this.limbos.filter(x => x.activo === true);
                },          
            crearPDF(){
                var columns = [
                    {title: "Id", dataKey: "idlimbo"},
                    {title: "Orden", dataKey: "orden"},
                    {title: "Proyecto", dataKey: "proyecto"},
                    {title: "Estado", dataKey: "activo"},
                ];
                var rows = [];

                this.limbos.map(function(x){
                    rows.push({idlimbo:x.idlimbo,orden:x.orden,proyecto:x.proyecto,activo:x.activo ? "Activo" : "Inactivo"});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Limbos", 40, 30);
                    }
                });
                doc.save('Limbos.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Limbos/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.limbos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var origenesArray=[];
                var epsArray=[];
                var pitchsArray=[];
                var directoresArray=[];
                var tipoprodsArray=[];
                var tipoproysArray=[];
                var estadosArray=[];
                var resultadosArray=[];
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
				axios.get('api/Personas/SelectEps',configuracion).then(function(response){
                    //console.log(response);
                    epsArray=response.data;
                    epsArray.map(function(x){
                        me.eps.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Pitchs/Select',configuracion).then(function(response){
                    //console.log(response);
                    pitchsArray=response.data;
                    pitchsArray.map(function(x){
                        me.pitchs.push({text: x.pitch,value:x.idpitch});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
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
				axios.get('api/Tipoproys/Select',configuracion).then(function(response){
                    //console.log(response);
                    tipoproysArray=response.data;
                    tipoproysArray.map(function(x){
                        me.tipoproys.push({text: x.tipoproy,value:x.idtipoproy,impvenmay:x.impvenmay,impvenmen:x.impvenmen,
                                        porganmay:x.porganmay, porganmen:x.porganmen});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Estados/Select',configuracion).then(function(response){
                    //console.log(response);
                    estadosArray=response.data;
                    estadosArray.map(function(x){
                        me.estados.push({text: x.estado,value:x.idestado});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Resultados/Select',configuracion).then(function(response){
                    //console.log(response);
                    resultadosArray=response.data;
                    resultadosArray.map(function(x){
                        me.resultados.push({text: x.resultado,value:x.idresultado});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            editItem (item) {
                this.idlimbo=item.idlimbo;
                this.orden=item.orden;
                this.proyecto=item.proyecto;
                this.idep=item.idep;
                this.idorigen=item.idorigen;
                this.idpitch=item.idpitch;
                this.iddirector=item.iddirector;
                this.idcodirector=item.idcodirector;
                this.idtipoprod=item.idtipoprod;
                this.impcosto=item.impcosto;
                this.porcontingencia=item.porcontingencia;
                this.porgastosfijo=item.porgastosfijo;
                this.porganancia=item.porganancia;
                this.porfeedireccion=item.porfeedireccion;
                this.porotrosgastos=item.porotrosgastos;
                this.porcostofinanciero=item.porcostofinanciero;
                this.porimpuestoycomision=item.porimpuestoycomision;
                this.impventa=item.impventa;
                this.porcontribucion=item.porcontribucion;
                this.idtipoproy=item.idtipoproy;
                this.idestado=item.idestado;
                this.fecingreso=item.fecingreso.substr(0, 10);
                this.fecadjudicacion=item.fecadjudicacion?item.fecadjudicacion.substr(0, 10):item.fecadjudicacion;
                this.aprobacion=item.aprobacion;
                this.fecaprobacion=item.fecaprobacion?item.fecaprobacion.substr(0, 16):item.fecaprobacion;
                this.idresultado=item.idresultado;
                this.comentario=item.comentario;
                this.ars1usd=item.ars1usd;
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
                var date = new Date();
                this.idlimbo="";
                this.orden="";
                this.proyecto="";
                this.idep="";
                this.idorigen="";
                this.idpitch="";
                this.iddirector="";
                this.idcodirector="";
                this.idtipoprod="";
                this.impcosto= 0;
                this.porcontingencia= 0;
                this.porgastosfijo= 0;
                this.porganancia= 0;
                this.porfeedireccion= 0;
                this.porotrosgastos= 0;
                this.porcostofinanciero= 0;
                this.porimpuestoycomision= 0;
                this.impventa= 0;
                this.porcontribucion= 0;
                this.idtipoproy="";
                this.idestado="";
                this.fecingreso=new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
                this.fecadjudicacion="";
                this.aprobacion=false;
                this.fecaprobacion="";
                this.idresultado="";
                this.comentario="";
                this.ars1usd=ars1usd;
                this.iduseralta="";
                this.fecalta="";
                this.iduserumod="";
                this.fecumod="";                
                this.editedIndex=-1;
            },
        }        
    }
</script>
