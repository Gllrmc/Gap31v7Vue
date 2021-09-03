<template> 
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Cierre de Prospectos</v-toolbar-title>
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
                    <v-dialog v-model="dialog" max-width="1200px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                        </v-card-title>
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="orden" label="Nro Limbo" disabled></v-text-field>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <v-text-field v-model="proyecto" label="Nombre del Proyecto"></v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-select v-model="idestado"
                                    :items = "estados" label = "Estado">
                                    </v-select>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-autocomplete 
                                        v-model="idorigen"
                                        clearable
                                        :search-input.sync="searchor" 
                                        :items = "origenes" 
                                        label = "Origen">
                                    </v-autocomplete>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-select 
                                        v-model="idpitch"
                                        :items = "pitchs" 
                                        label = "Pitch">
                                    </v-select>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-select v-model="idtipoprod"
                                    :items = "tipoprods" label = "Tipo de Produccion">
                                    </v-select>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-select v-model="idtipoproy"
                                    disabled
                                    :items = "tipoproys" 
                                    label = "Tipo de Proyecto">
                                    </v-select>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-autocomplete 
                                        v-model="idep"
                                        clearable
                                        :search-input.sync="searchep" 
                                        :items = "eps" 
                                        label = "E.P.">
                                    </v-autocomplete>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-autocomplete 
                                        v-model="iddirector"
                                        :search-input.sync="searchdi" 
                                        :items = "directores" 
                                        label = "Director">
                                    </v-autocomplete>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-autocomplete 
                                        v-model="idcodirector"
                                        clearable
                                        :search-input.sync="searchco" 
                                        :items = "directores" 
                                        label = "Co-director">
                                    </v-autocomplete>
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <v-text-field v-model="impcosto"
                                        prefix="$"
                                        label="Costo"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porcontingencia"
                                        prefix="%"
                                        label="Contingencia"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porgastosfijo"
                                        prefix="%"
                                        label="Gasto Fijo"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porganancia"
                                        prefix="%"
                                        label="Ganacia"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porfeedireccion"
                                        prefix="%"
                                        label="Fee dirección"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porotrosgastos"
                                        prefix="%"
                                        label="Otros Gastos"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porcostofinanciero"
                                        prefix="%"
                                        label="Cto.Financiero"
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="porimpuestoycomision"
                                        prefix="%"
                                        label="Imp. y Com."
                                        type="number"
                                        @change="calcularDerivados"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <v-text-field v-model="impventa"
                                        prefix="$"
                                        label="Venta"
                                        type="number"
                                        disabled
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <v-text-field v-model="impcontribucion"
                                        prefix="$"
                                        label="Contribución"
                                        type="number"
                                        disabled
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs2 sm2 md2>
                                    <v-text-field v-model="porcontribucion"
                                        prefix="%"
                                        label="Contribución"
                                        type="number"
                                        disabled
                                        >
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
                                            min-width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="fecingreso"
                                                    label="Ingreso"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="fecingreso" @input="menu1 = false"></v-date-picker>
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
                                            min-width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="fecadjudicacion"
                                                    label="Adjudicacion"
                                                    prepend-icon="event"
                                                    readonly
                                                    clearable 
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker 
                                                v-model="fecadjudicacion"
                                                :min = "fecingreso" 
                                                @input="menu2 = false">
                                            </v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </template>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="ars1usd"
                                        prefix="$"
                                        label="ARS/USD"
                                        type="number"
                                        >
                                    </v-text-field>    
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-select v-model="idresultado"
                                    :items = "resultados" clearable label = "Resultado">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-textarea v-model="comentario"
                                        auto-grow
                                        clearable
                                        filled
                                        label="Comentarios"
                                        >
                                    </v-textarea>
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
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Prospecto?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Prospecto?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el prospecto {{ adNombre }}
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
                :items="limbos"
                :search="search"
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon small class="mr-2" 
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                        <template v-if="props.item.activo">
                            <v-icon small
                            @click="activarDesactivarMostrar(2,props.item)"
                            >
                            block
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon small
                            @click="activarDesactivarMostrar(1,props.item)"
                            >
                            check
                            </v-icon>
                        </template>
                    </td>
                    <td>{{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.ep }}</td>
                    <td>{{ props.item.origen }}</td>
                    <td>{{ props.item.territorio }}</td>
                    <td>{{ props.item.pitch }}</td>
                    <td>{{ props.item.director }}</td>
                    <td>{{ props.item.codirector }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.impcosto }}</td>
                    <td>{{ props.item.porcontingencia }}</td>
                    <td>{{ props.item.porgastosfijo }}</td>
                    <td>{{ props.item.porganancia }}</td>
                    <td>{{ props.item.porfeedireccion }}</td>
                    <td>{{ props.item.porotrosgastos }}</td>
                    <td>{{ props.item.porcostofinanciero }}</td>
                    <td>{{ props.item.porimpuestoycomision }}</td>
                    <td>{{ props.item.impventa.toFixed(2) }}</td>
                    <td>{{ props.item.impcontribucion.toFixed(2) }}</td>
                    <td>{{ props.item.porcontribucion.toFixed(2) }}</td>
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
                    <td>{{ props.item.resultado }}</td>
                    <td>
                        <div v-if="props.item.aprobacion">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>                    
                    <td>{{ props.item.fecaprobacion }}</td>
                    <td>{{ props.item.comentario?props.item.comentario.substr(0, 50):"" }}</td>
                    <td>{{ props.item.ars1usd?props.item.ars1usd.toFixed(2):"" }}</td>
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
    import autoTable from 'jspdf-autotable';
    export default {
        data(){
            return {
                menu1:'',
                menu2:'',
                menu3:'',
                menu4:'',
                menu5:'',
                searchep:'',
                searchor:'',
                searchag:'',
                searchdi:'',
                searchco:'',
                searchcl:'',
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
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Orden', value: 'orden' },
                    { text: 'Nombre del Proyecto', value: 'proyecto' },
                    { text: 'Executive Producer', value: 'ep' },
                    { text: 'Nombre del Origen', value: 'origen' },
                    { text: 'Territorio', value: 'territorio' },
                    { text: 'Tipo de Pitch', value: 'pitch' },
                    { text: 'Nombre Director', value: 'director' },
                    { text: 'Nombre Co-director', value: 'codirector' },
                    { text: 'Tipo Produción', value: 'tipoprod' },
                    { text: 'Costo', value: 'impcosto' },
                    { text: '%Cont', value: 'porcontingencia' },
                    { text: '%GtsFijo', value: 'porgastosfijo' },
                    { text: '%Gan', value: 'porganancia' },
                    { text: '%FeeDir', value: 'porfeedireccion' },
                    { text: '%OtrGts', value: 'porotrosgastos' },
                    { text: '%CtoFin', value: 'porcostofinanciero' },
                    { text: '%Imp&Com', value: 'porimpuestoycomision' },
                    { text: 'U$D Venta', value: 'impventa' },
                    { text: 'U$S CMarg.', value: 'impcontribucion' },
                    { text: '%CMarg.', value: 'porcontribucion' },
                    { text: 'Tipo de Proyecto', value: 'tipoproy' },
                    { text: 'ARS/USD', value: 'ars1usd', sortable: true },
                    { text: 'Estado', value: 'estado' },
                    { text: 'Fecha Ingreso', value: 'fecingreso' },
                    { text: 'Fecha Adjudic', value: 'fecadjudicacion' },
                    { text: 'Resultado', value: 'resultado' },
                    { text: 'Aprobacion', value: 'aprobacion' },
                    { text: 'Fecha Aprob', value: 'fecaprobacion' },
                    { text: 'Comentario', value: 'comentario' },
                    { text: 'Estado', value: 'activo', sortable: false  },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fecha Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fecha Ult.Mod', value: 'fecumod', sortable: true }                   ],
                search: '',
                editedIndex: -1,
                idlimbo:'',
                orden:'',
                proyecto:'',
                idep:'',
                ep:'',
                idorigen:'',
                territorio:'',
                origen:'',
                idpitch:'',
                pitch:'',
                iddirector:'',
                director:'',
                idcodirector:'',
                codirector:'',
                idtipoprod:'',
                tipoprod:'',
                impcosto: 0,
                porcontingencia: 0,
                porgastosfijo: 0,
                porganancia: 0,
                porfeedireccion: 0,
                porotrosgastos: 0,
                porcostofinanciero: 0,
                porimpuestoycomision: 0,
                impventa: 0,
                impcontribucion: 0,
                porcontribucion: 0,
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
                ars1usd: 0,
                iduseralta:'',
                fecalta:'',
                iduserumod:'',
                fecumod:'',                
                limbos:[],
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''             
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo aprobación' : 'Actualizar aprobación'
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
            calcularDerivados(){
                this.impventa = (this.impcosto * ( 1 + this.porcontingencia / 100 ) * ( 1 + this.porgastosfijo / 100 + this.porganancia / 100) * ( 1 + this.porfeedireccion / 100) * ( 1 + this.porotrosgastos / 100 ) * ( 1 + this.porcostofinanciero / 100 ) * ( 1 + this.porimpuestoycomision / 100 ));
                this.porcontribucion = (!(Number(this.impventa) === 0) ? ((this.porganancia / 100 + this.porgastosfijo / 100 ) * ( 1 + this.porcontingencia / 100 ) * this.impcosto / this.impventa) : 0) * 100;
                this.impcontribucion = this.impventa * this.porcontribucion / 100;
                this.impventa = this.impventa.toFixed(2);
                this.impcontribucion = this.impcontribucion.toFixed(2);
                this.porcontribucion = this.porcontribucion.toFixed(2);
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
                if (this.$store.state.usuario.rol =='Administrador' || this.$store.state.usuario.rol =='JefeAdministracion' ){
                    axios.get('api/Limbos/Listar',configuracion).then(function(response){
                        //console.log(response);
                        me.limbos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }else{
                    axios.get('api/Limbos/Listarusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.limbos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });                    
                }
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
                        me.origenes.push({text: x.origen,value:x.idorigen,territorio: x.territorio});
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
                        me.resultados.push({text: x.resultado,value:x.idresultado, esaprobacion: x.esaprobacion});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
                if (this.$store.state.usuario.rol =='Administrador' || this.$store.state.usuario.rol =='JefeAdministracion' ){
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
                }else{
                    axios.get('api/Personas/SelectEpsusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
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
                }
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
                this.impventa=item.impventa.toFixed(0);
                this.impcontribucion=item.impcontribucion.toFixed(0);
                this.porcontribucion=item.porcontribucion.toFixed(2);
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
                this.impcontribucion= 0;
                this.porcontribucion= 0;
                this.idtipoproy="";
                this.idestado="";
                this.fecingreso=new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
                this.fecadjudicacion="";
                this.aprobacion=false;
                this.fecaprobacion="";
                this.idresultado="";
                this.comentario="";
                this.ars1usd=0;
                this.iduseralta="";
                this.fecalta="";
                this.iduserumod="";
                this.fecumod="";                
                this.editedIndex=-1;
            },
            guardar () {
                this.calculosAdicionales();
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
                    axios.put('api/Limbos/Actualizar',{
                        'idlimbo':me.idlimbo,
                        'orden': me.orden,
                        'proyecto': me.proyecto,
                        'idep': me.idep,
                        'idorigen': me.idorigen,
                        'idpitch': me.idpitch,
                        'iddirector': me.iddirector,
                        'idcodirector': me.idcodirector,
                        'idtipoprod': me.idtipoprod,
                        'impcosto': me.impcosto,
                        'porcontingencia': me.porcontingencia,
                        'porgastosfijo': me.porgastosfijo,
                        'porganancia': me.porganancia,
                        'porfeedireccion': me.porfeedireccion,
                        'porotrosgastos': me.porotrosgastos,
                        'porcostofinanciero': me.porcostofinanciero,
                        'porimpuestoycomision': me.porimpuestoycomision,
                        'idtipoproy': me.idtipoproy,
                        'idestado': me.idestado,
                        'fecingreso': me.fecingreso,
                        'fecadjudicacion': me.fecadjudicacion,
                        'aprobacion': me.aprobacion,
                        'fecaprobacion': me.fecaprobacion,
                        'idresultado': me.idresultado,
                        'comentario': me.comentario,
                        'ars1usd': me.ars1usd,
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
                        me.snackbar = true;                     
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    axios.post('api/Limbos/Crear',{
                        'proyecto': me.proyecto,
                        'idep': me.idep,
                        'idorigen': me.idorigen,
                        'idpitch': me.idpitch,
                        'iddirector': me.iddirector,
                        'idcodirector': me.idcodirector,
                        'idtipoprod': me.idtipoprod,
                        'impcosto': me.impcosto,
                        'porcontingencia': me.porcontingencia,
                        'porgastosfijo': me.porgastosfijo,
                        'porganancia': me.porganancia,
                        'porfeedireccion': me.porfeedireccion,
                        'porotrosgastos': me.porotrosgastos,
                        'porcostofinanciero': me.porcostofinanciero,
                        'porimpuestoycomision': me.porimpuestoycomision,
                        'idtipoproy': me.idtipoproy,
                        'idestado': me.idestado,
                        'fecingreso': me.fecingreso,
                        'fecadjudicacion': me.fecadjudicacion,
                        'aprobacion': me.aprobacion,
                        'fecaprobacion': me.fecaprobacion,
                        'idresultado': me.idresultado,
                        'comentario': me.comentario,
                        'ars1usd': me.ars1usd,
                        'iduseralta': me.$store.state.usuario.idusuario
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;                     
                        me.snackbar = true;                     
                        console.log(error);

                    });
                }
            },
            calculosAdicionales(){
                // Tipo de proyecto
                if (this.impventa && this.porganancia){
                    for (let i=0; i<this.tipoproys.length; i++){
                        if (Number(this.impventa) >= this.tipoproys[i]["impvenmay"] && Number(this.impventa) < this.tipoproys[i]["impvenmen"]){
                            if (Number(this.porganancia) >= this.tipoproys[i]["porganmay"] && Number(this.porganancia) < this.tipoproys[i]["porganmen"]){
                                this.idtipoproy = this.tipoproys[i]["value"];
                                break;
                            }
                        }
                    }
                }
                //Si es aprobacion => cargar fecha de aprobacion
                if (this.resultados.filter(x => x.value === this.idresultado).map(x =>x.esaprobacion)[0]){
                    var date = new Date();
                    this.aprobacion=true;
                    this.fecaprobacion = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                }
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if (this.proyecto.length<3 || this.proyecto.length>50){
                    this.validaMensaje.push("El nombre del proyecto no debe tener menos de 3 caracteres y mas de 50 caracteres.");
                }
                if (!this.idep){
                    this.validaMensaje.push("Seleccione un Executive Producer.");
                }
                if (!this.idorigen){
                    this.validaMensaje.push("Seleccione un Origen.");
                }
                if (!this.idpitch){
                    this.validaMensaje.push("Seleccione un Pitch.");
                }
                if (!this.iddirector){
                    this.validaMensaje.push("Seleccione un Director.");
                }
                if (!this.idtipoprod){
                    this.validaMensaje.push("Seleccione un Tipo de Producción.");
                }
                if (!this.idtipoproy){
                    this.validaMensaje.push("Error en parametrizacion del tipo de proyecto.");
                }
                if (!this.idestado){
                    this.validaMensaje.push("Seleccione un Estado.");
                }
                if (!this.impcosto){
                    this.validaMensaje.push("Ingrese un importe de Costo.");
                }
                if (!this.porganancia){
                    this.validaMensaje.push("Ingrese un porcentaje de Ganancia.");
                }
                if (!this.impventa){
                    this.validaMensaje.push("Ingrese un importe de Venta.");
                }
                if (!this.fecingreso){
                    this.validaMensaje.push("Ingrese una fecha de ingreso.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.proyecto;
                this.adId=item.idlimbo;                
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
                axios.put('api/Limbos/Activar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
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
                axios.put('api/Limbos/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;                     
                    me.snackbar = true;                     
                    console.log(error);

                });
            }
        }        
    }
</script>
