<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Activar Proyectos Aprobados</v-toolbar-title>
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
                <v-dialog v-model="dialog" max-width="450px">
                    <v-card>
                        <v-card-title>
                        <span class="headline">Activar {{pad(orden, 5)}} - {{proyecto}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12>
                                        <input type="checkbox" id="visita" v-model="activapitch">
                                        <label for = "visita"> Pitch ? ({{pad(orden, 5)}}A)</label>
                                    </v-flex>                                
                                    <v-flex xs12 sm12 md12>
                                        <input type="checkbox" id="postih" v-model="activaproy">
                                        <label for = "postih"> Proyecto? ({{pad(orden, 5)}})</label>
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
                    </td>
                    <td>{{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.cliente }}</td>
                    <td>{{ props.item.ep }}</td>
                    <td>{{ props.item.origen }}</td>
                    <td>{{ props.item.territorio }}</td>
                    <td>{{ props.item.agencia }}</td>
                    <td>{{ props.item.pitch }}</td>
                    <td>{{ props.item.director }}</td>
                    <td>{{ props.item.codirector }}</td>
                    <td>{{ props.item.productora }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.impcosto }}</td>
                    <td>{{ props.item.porcontingencia }}</td>
                    <td>{{ props.item.porgastosfijo }}</td>
                    <td>{{ props.item.porganancia }}</td>
                    <td>{{ props.item.porfeedireccion }}</td>
                    <td>{{ props.item.porotrosgastos }}</td>
                    <td>{{ props.item.porcostofinanciero }}</td>
                    <td>{{ props.item.porimpuestoycomision }}</td>
                    <td>{{ props.item.impventa }}</td>
                    <td>{{ props.item.impcontribucion }}</td>
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
                    <td>
                        <div v-if="props.item.fecpitch">
                            {{ props.item.fecpitch.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecpitch }}
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
                        <div v-if="props.item.fecentrega">
                            {{ props.item.fecentrega.substr(0, 10) }}
                        </div>
                        <div v-else>
                            {{ props.item.fecentrega }}
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
                    <td>
                        <div v-if="props.item.visitaforanea">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>                    
                    <td>
                        <div v-if="props.item.postinhouse">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>                    
                    <td>{{ props.item.posiciones }}</td>
                    <td>
                        <div v-if="props.item.editinhouse">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>
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
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Orden', value: 'orden' },
                    { text: 'Nombre del Proyecto', value: 'proyecto' },
                    { text: 'Nombre del Cliente', value: 'cliente' },
                    { text: 'Executive Producer', value: 'ep' },
                    { text: 'Nombre del Origen', value: 'origen' },
                    { text: 'Territorio', value: 'territorio' },
                    { text: 'Nombre de Agencia', value: 'agencia' },
                    { text: 'Tipo de Pitch', value: 'pitch' },
                    { text: 'Nombre Director', value: 'director' },
                    { text: 'Nombre Co-director', value: 'codirector' },
                    { text: 'Productora', value: 'productora' },
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
                    { text: 'Estado', value: 'estado' },
                    { text: 'Fecha Ingreso', value: 'fecingreso' },
                    { text: 'Fecha Adjudic', value: 'fecadjudicacion' },
                    { text: 'Fecha Pitch', value: 'fecpitch' },
                    { text: 'Fecha Rodaje', value: 'fecrodaje' },
                    { text: 'Fecha Entrega', value: 'fecentrega' },
                    { text: 'Resultado', value: 'resultado' },
                    { text: 'Aprobacion', value: 'aprobacion' },
                    { text: 'Fecha de Aprobación', value: 'fecaprobacion' },
                    { text: 'Comentario', value: 'comentario' },
                    { text: 'VisExt', value: 'visitaforanea' },
                    { text: 'PostInHouse', value: 'postinhouse' },
                    { text: '#Posiciones', value: 'posiciones' },
                    { text: 'EditInHouse', value: 'editinhouse' },
                    { text: 'ARS/USD', value: 'ars1usd', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: false  },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fecha Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fecha Ult.Mod', value: 'fecumod', sortable: true }                   ],
                search: '',
                activapitch:false,
                activaproy:false,
                idlimbo:'',
                orden:'',
                proyecto:'',
                idcliente:'',
                cliente:'',
                idep:'',
                ep:'',
                idorigen:'',
                idagencia:'',
                idpitch:'',
                iddirector:'',
                idcodirector:'',
                idproductora:'',
                idtipoprod:'',
                impcosto:'',
                porcontingencia:'',
                porgastosfijo:'',
                porganancia:'',
                porfeedireccion:'',
                porotrosgastos:'',
                porcostofinanciero:'',
                porimpuestoycomision:'',
                impventa:'',
                impcontribucion:'',
                porcontribucion:'',
                idtipoproy:'',
                idestado:'',
                fecingreso:'',
                fecadjudicacion:'',
                fecpitch:'',
                fecrodaje:'',
                fecentrega:'',
                aprobacion:false,
                fecaprobacion:'',
                idresultado:'',
                resultado:'',
                comentario:'',
                visitaforanea:false,
                postinhouse:false,
                idposiciones:'',
                posiciones:'',
                editinhouse:false,
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
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
        },
        methods:{
            pad(n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.$store.state.usuario.rol =='Administrador' || this.$store.state.usuario.rol =='JefeAdministracion' ){
                    axios.get('api/Limbos/ListarAprobados',configuracion).then(function(response){
                        //console.log(response);
                        me.limbos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }else{
                    axios.get('api/Limbos/ListarAprobadosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.limbos=response.data;
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
                this.idcliente=item.idcliente;
                this.idep=item.idep;
                this.idorigen=item.idorigen;
                this.idagencia=item.idagencia;
                this.idpitch=item.idpitch;
                this.iddirector=item.iddirector;
                this.idcodirector=item.idcodirector;
                this.idproductora=item.idproductora;
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
                this.impcontribucion=item.impcontribucion;
                this.porcontribucion=item.porcontribucion;
                this.idtipoproy=item.idtipoproy;
                this.idestado=item.idestado;
                this.fecingreso=item.fecingreso.substr(0, 10);
                this.fecadjudicacion=item.fecadjudicacion?item.fecadjudicacion.substr(0, 10):item.fecadjudicacion;
                this.fecpitch=item.fecpitch?item.fecpitch.substr(0, 10):item.fecpitch;
                this.fecrodaje=item.fecrodaje?item.fecrodaje.substr(0, 10):item.fecrodaje;
                this.fecentrega=item.fecentrega?item.fecentrega.substr(0, 10):item.fecentrega;
                this.aprobacion=item.aprobacion;
                this.fecaprobacion=item.fecaprobacion?item.fecaprobacion.substr(0, 16):item.fecaprobacion;
                this.idresultado=item.idresultado;
                this.comentario=item.comentario;
                this.visitaforanea=item.visitaforanea;
                this.postinhouse=item.postinhouse;
                this.idposiciones=item.idposiciones;
                this.editinhouse=item.editinhouse;
                this.ars1usd=item.ars1usd;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
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
                this.idcliente="";
                this.idep="";
                this.idorigen="";
                this.idagencia="";
                this.idpitch="";
                this.iddirector="";
                this.idcodirector="";
                this.idproductora="";
                this.idtipoprod="";
                this.impcosto="";
                this.porcontingencia="";
                this.porgastosfijo="";
                this.porganancia="";
                this.porfeedireccion="";
                this.porotrosgastos="";
                this.porcostofinanciero="";
                this.porimpuestoycomision="";
                this.impventa="";
                this.impcontribucion="";
                this.porcontribucion="";
                this.idtipoproy="";
                this.idestado="";
                this.fecingreso=new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
                this.fecadjudicacion="";
                this.fecpitch="";
                this.fecrodaje="";
                this.fecentrega="";
                this.aprobacion=false;
                this.fecaprobacion="";
                this.idresultado="";
                this.comentario="";
                this.visitaforanea=false;
                this.postinhouse=false;
                this.idposiciones="";
                this.editinhouse=false;
                this.ars1usd=0;
                this.iduseralta="";
                this.fecalta="";
                this.iduserumod="";
                this.fecumod="";
            },
            guardar () {
                if (this.validar()){
                    return;
                }
                let me=this;
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.activapitch) {
                    //Código para guardar
                    //console.log(me);`
                    axios.post('api/Proyectos/Crear',{
                        'idraiz': '',
                        'orden': me.pad(me.orden, 5)+'A',
                        'proyecto': '[Pitch] ' + me.proyecto,
                        'idtipoprod': me.idtipoprod,
                        'idempresa': '',
                        'idorigen': me.idorigen,
                        'idagencia': me.idagencia,
                        'idproductora': me.idproductora,
                        'idcliente': me.idcliente,
                        'iddirector': me.iddirector,
                        'idcodirector': me.idcodirector,
                        'idep': me.idep,
                        'idlp': '',
                        'idcp': '',
                        'ars1usd': me.as1usd,
                        'fecadjudicacion': me.fecadjudicacion ? me.fecadjudicacion : me.fecaprobacion.substr(0,10),
                        'fecdesdxd': '',
                        'fechasdxd': '',
                        'fecdescf': '',
                        'fechascf': '',
                        'fecrodaje': '',
                        'fecoffline': '',
                        'feconline': '',
                        'iduseralta': me.$store.state.usuario.idusuario,
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
                if (this.activaproy) {
                    //Código para guardar
                    //console.log(me);
                    axios.post('api/Proyectos/Crear',{
                        'idraiz': '',
                        'orden': me.pad(me.orden, 5),
                        'proyecto': me.proyecto,
                        'idtipoprod': me.idtipoprod,
                        'idempresa': '',
                        'idorigen': me.idorigen,
                        'idagencia': me.idagencia,
                        'idproductora': me.idproductora,
                        'idcliente': me.idcliente,
                        'iddirector': me.iddirector,
                        'idcodirector': me.idcodirector,
                        'idep': me.idep,
                        'idlp': '',
                        'idcp': '',
                        'ars1usd': me.ars1usd,
                        'fecadjudicacion': me.fecadjudicacion ? me.fecadjudicacion : me.fecaprobacion.substr(0,10),
                        'fecdesdxd': '',
                        'fechasdxd': '',
                        'fecdescf': '',
                        'fechascf': '',
                        'fecrodaje': '',
                        'fecoffline': '',
                        'feconline': '',
                        'iduseralta': me.$store.state.usuario.idusuario,
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
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if (this.proyecto.length<3 || this.proyecto.length>50){
                    this.validaMensaje.push("El nombre del proyecto no debe tener menos de 3 caracteres y mas de 50 caracteres.");
                }
                if (!this.idcliente){
                    this.validaMensaje.push("Seleccione un Cliente.");
                }
                if (!this.idep){
                    this.validaMensaje.push("Seleccione un Executive Producer.");
                }
                if (!this.idorigen){
                    this.validaMensaje.push("Seleccione un Origen.");
                }
                if (!this.idagencia){
                    this.validaMensaje.push("Seleccione una Agencia.");
                }
                if (!this.idpitch){
                    this.validaMensaje.push("Seleccione un Pitch.");
                }
                if (!this.iddirector){
                    this.validaMensaje.push("Seleccione un Director.");
                }
                if (!this.idproductora){
                    this.validaMensaje.push("Seleccione una Productora.");
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
                if (!this.impventa){
                    this.validaMensaje.push("Ingrese un importe de Venta.");
                }
                if (!this.fecingreso){
                    this.validaMensaje.push("Ingrese una fecha de ingreso.");
                }
                if (!this.idposiciones){
                    this.validaMensaje.push("Seleccione las posiciones requeridas.");
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
