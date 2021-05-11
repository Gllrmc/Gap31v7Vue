<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Pitches - Registro de Pitch</v-toolbar-title>
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
                    <span class="headline">Regpitchs para Prospecto #{{orden}}: {{proyecto}} </span>
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
                                    <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                                </v-card-actions>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs2 sm2 md2>
                                                <v-text-field 
                                                    v-model="numregpitch" 
                                                    label="#Secuencia" 
                                                    disabled>
                                                </v-text-field>
                                            </v-flex>
                                            <template>
                                                <v-flex xs4 sm4 md4>
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
                                                                v-model="fecregpitch"
                                                                label="Fecha Pitch"
                                                                prepend-icon="event"
                                                                readonly
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker 
                                                            v-model="fecregpitch"
                                                            @input="menu1 = false">
                                                        </v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </template> 
                                            <v-flex xs4 sm4 md4>
                                                <v-text-field 
                                                    type="number" 
                                                    v-model="impregpitch" 
                                                    prefix="$"
                                                    label="Importe"
                                                    >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <form enctype="multipart/form-data">
                                                    <div class="field">
                                                        <label for="file" class="label"></label>
                                                        <input 
                                                        style="display:none" 
                                                        type="file"
                                                        accept="application/pdf"
                                                        @change="onFileSelected($event.target.files)"
                                                        ref="fileInput"/>
                                                    </div>
                                                        <v-btn @click="$refs.fileInput.click()">Buscar</v-btn>
                                                        <v-btn @click="onSaveAs(pdfregpitch)">Desc Pitch</v-btn>
                                                </form> 
                                            </v-flex>
                                            <v-flex xs12>
                                                <div>       
                                                <canvas id="the-canvas" style="border:1px  solid black"></canvas>
                                                </div>
                                            </v-flex>                                            
                                            <v-flex xs12 sm12 md12>
                                                <v-text-field v-model="nota" label="Notas">
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
                        <v-dialog v-model="adModal" max-width="400">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar el Pitch?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar el Pitch?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    el Pitch {{ adNombre }}
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
                            :items="regpitchs"
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
                                    <v-icon v-if="$store.state.usuario.rol =='Administrador' || $store.state.usuario.rol =='JefeAdministracion'"
                                    small
                                    @click="deleteItem(props.item)"
                                    >
                                    delete
                                    </v-icon>
                                    <template>
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
                                    </template>
                                </td>
                                <td>{{ props.item.idregpitch }}</td>
                                <td>{{ props.item.numregpitch }}</td>
                                <td>{{ (props.item.fecregpitch) ? props.item.fecregpitch.substr(0,10) : "" }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.impregpitch) }}</td>
                                <td>{{ props.item.pdfregpitch }}</td>
                                <td>{{ (props.item.nota) ? props.item.nota.substr(0,20) : ""  }}</td>
                                <td class="justify-center ">
                                    <div v-if="props.item.activo">
                                        <span class="blue--text">Activo</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">Inactivo</span>
                                    </div>
                                </td>
                                <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                                <td>{{ (props.item.fecalta) ? props.item.fecalta.substr(0, 16) : "" }}</td>
                                <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                                <td>{{ (props.item.fecumod) ? props.item.fecumod.substr(0, 16) : "" }}</td>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Total Ordenes: </strong>$ {{totalPagado=(calcularTotal).toFixed(2)}}
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
                :items="limbos"
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
                    <td>{{ props.item.cliente }}</td>
                    <td>{{ props.item.ep }}</td>
                    <td>{{ props.item.fecaprobacion.substr(0, 10) }}</td>
                    <td>{{ props.item.ars1usd }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listarMaster">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.487/pdf.min.js"></script>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import pdfjsLib from 'pdfjs-dist';      
    export default {
            data: () => {
                return {
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                fd: new FormData,
                originalregpitchguid: '',
                guid: '',                
                page: 1,
                // Arrays
                limbos:[],
                regpitchs:[],
                // Detail
                idregpitch: '',
                numregpitch: '',
                fecregpitch: '',
                impregpitch: '',
                pdfregpitch: '',
                nota: '',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                // Master
                idlimbo: '',
                orden: '',
                proyecto: '',
                cliente: '',
                ep : '',
                fecaprobacion: '',
                ars1usd: '',
                menu1: false,
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Orden', value: 'orden' },
                    { text: 'Nombre del Proyecto', value: 'proyecto' },
                    { text: 'Nombre del Cliente', value: 'cliente' },
                    { text: 'Executive Producer', value: 'ep' },
                    { text: 'Fecha de Aprobación', value: 'fecaprobacion' },
                    { text: 'ARS/USD', value: 'ars1usd', sortable: true },
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Id', value: 'idregpitch', sortable: true },
                    { text: '#Sec', value: 'numregpitch', sortable: true },
                    { text: 'Fecha Registro', value: 'fecregpitch', sortable: true },
                    { text: 'Importe', value: 'impregpitch', sortable: true },
                    { text: 'PDF', value: 'pdfregpitch', sortable: true },
                    { text: 'Nota', value: 'nota', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  },                                    
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],
                totalPagado: 0,                 
                search: '',
                editedIndex: -1,
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
                    return this.editedIndex === -1 ? 'Nuevo Pitch' : 'Actualizar Pitch'
                },
                calcularTotal:function(){
                        var subtotal=0.0;
                        for(var i=0;i<this.regpitchs.length;i++){
                            subtotal+=(this.regpitchs[i].activo?this.regpitchs[i].impregpitch:0);
                        }
                        return subtotal;
                    },                       
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
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            listarMaster(){
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
            listarDetail(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Regpitchs/ListarLimbo/'+this.idlimbo,configuracion).then(function(response){
                    // console.log(response);
                    me.regpitchs=response.data;
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
            },
            editMasterItem (item) {
                this.idlimbo = item.idlimbo;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.cliente = item.cliente;
                this.ep = item.ep;
                this.fecaprobacion = item.fecaprobacion.substr(0, 10);
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idregpitch = item.idregpitch;
                this.numregpitch = item.numregpitch;
                this.fecregpitch = (item.fecregpitch) ? item.fecregpitch.substr(0, 10) : "";
                this.impregpitch = item.impregpitch;
                this.pdfregpitch = item.pdfregpitch;
                this.originalregpitchguid = item.pdfregpitch;
                this.nota = item.nota;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.onDownload(this.pdfregpitch);
                this.editedIndex=1;
                this.dialogForm = true
            },
            deleteItem (item) {
                var me=this;
                var resulta = confirm('Esta seguro de querer borrar el registro?');
                if (resulta) {
                    let header={"Authorization" : "Bearer " + me.$store.state.token};
                    let configuracion= {headers : header};
                    axios.delete('api/Regpitchs/Eliminar/'+item.idregpitch,configuracion).then(function(response){
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
                this.idregpitch = '';                
                this.orden = '';
                this.proyecto = '';
                this.cliente = '';
                this.ep = '';
                this.fecaprobacion = '';
                this.ars1usd = '',               
                this.totalPagado = 0;
            },
            limpiarDetail() {
                this.idregpitch = '';
                this.numregpitch = '';
                this.fecregpitch = '';
                this.impregpitch = '';
                this.pdfregpitch = '',
                this.nota = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.totalPagado=0;
                this.editedIndex=-1;
                this.onClear();
            },            
            guardar () {
                if (this.validar()){
                    return;
                }
                let me=this;
                var date = new Date();
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                if (me.editedIndex > -1) {
                    if (me.pdfregpitch && me.originalregpitchguid != me.pdfregpitch ){
                        me.onDelete(me.originalregpitchguid);
                        me.originalregpitchguid='';
                        me.onUpload();
                    }
                    //Código para editar
                    //Código para guardar
                    // console.log(me);
                    axios.put('api/Regpitchs/Actualizar',{
                        'idregpitch': me.idregpitch,
                        'fecregpitch': me.fecregpitch.substr(0,10),
                        'impregpitch': me.impregpitch,
                        'pdfregpitch': me.pdfregpitch,
                        'nota': me.nota,
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
                    this.onUpload();
                    // console.log(me);
                    axios.post('api/Regpitchs/Crear',{
                        'idlimbo': me.idlimbo,
                        'fecregpitch': me.fecregpitch.substr(0,10),
                        'impregpitch': me.impregpitch,
                        'pdfregpitch': me.pdfregpitch,
                        'nota': me.nota,
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
                if (!this.fecregpitch){
                    this.validaMensaje.push("Ingrese una fecha.");
                }
                if (!this.impregpitch){
                    this.validaMensaje.push("Ingrese un importe.");
                }
                if (!this.impregpitch > 0){
                    this.validaMensaje.push("El importe debe ser positivo.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre='#' + item.numregpitch + ' ' + item.fecregpitch.substr(0,10) + ' $ ' + item.impregpitch;
                this.adId=item.idregpitch;                
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
                axios.put('api/Regpitchs/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Regpitchs/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
            onFileSelected(fileList){

                var file = fileList[0];
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                this.guid = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
                this.pdfregpitch = this.guid;
                this.fd.append("file", file, this.guid)

                var fileReader = new FileReader();

                fileReader.onload = function() {
                    var typedarray = new Uint8Array(this.result);                    

                    var loadingTask = pdfjsLib.getDocument(typedarray);

                    loadingTask.promise.then(function(pdf) {
                        console.log('PDF loaded');
                        
                        // Fetch the first page
                        var pageNumber = 1;
                        pdf.getPage(pageNumber).then(function(page) {
                            console.log('Page loaded');
                            
                            var scale = 1.2;
                            var viewport = page.getViewport({scale: scale});

                            // Prepare canvas using PDF page dimensions
                            var canvas = document.getElementById('the-canvas');
                            var context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            // Render PDF page into canvas context
                            var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                            };
                            var renderTask = page.render(renderContext);
                            renderTask.promise.then(function () {
                            console.log('Page rendered');
                            });
                        });
                        }, function (reason) {
                        // PDF loading error
                        console.error(reason);
                        }
                    );
                };
                fileReader.readAsArrayBuffer(file);
            },        
            async onUpload(){
                let me=this;                    
                let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
                await axios.post('api/Express/UploadFiles',this.fd,configuracion)
                    .then(res => {
                    console.log(res.data);
                    this.fd = new FormData;
                }).catch(error => {
                    this.fd = new FormData;
                    this.dialog = false;
                    this.guid = '';
                    this.pdfregpitch = '';
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);                        
                });
            },
            onDownload(file){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};        
                axios.get('api/Express/DownloadFile/'+file,configuracion)
                .then(res => {
                //console.log(res.data)
                var pdfData = atob(res.data)
                var loadingTask = pdfjsLib.getDocument({data: pdfData});

                loadingTask.promise.then(function(pdf) {
                    console.log('PDF loaded');
                    
                    // Fetch the first page
                    var pageNumber = 1;
                    pdf.getPage(pageNumber).then(function(page) {
                        console.log('Page loaded');
                        
                        var scale = 1.2;
                        var viewport = page.getViewport({scale: scale});

                        // Prepare canvas using PDF page dimensions
                        var canvas = document.getElementById('the-canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.promise.then(function () {
                        console.log('Page rendered');
                        });
                    });
                    }, function (reason) {
                    // PDF loading error
                    console.error(reason);
                    });
                }).catch(error => {
                console.log(error);
                });
            },
            onSaveAs(file){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};        
                axios.get('api/Express/DownloadFile/'+file,configuracion)
                .then(res => {
                //console.log(res.data)
                var FileSaver = require('file-saver');
                var pdfData = atob(res.data)
                var byteNumbers = new Array(pdfData.length);
                for (var i = 0 ; i < pdfData.length; i++){
                    byteNumbers[i] = pdfData.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray],{type: "application/pdf" });
                FileSaver.saveAs(blob, 'Export.pdf');
                });          
            },                
            onClear(){
                var canvas = document.getElementById('the-canvas');
                var context = canvas.getContext("2d");
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0,0, canvas.width, canvas.height);
            },      
            onDelete(file){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};        
                axios.delete('api/Express/DeleteFile/'+file,configuracion)
                .then(res => {
                console.log(res.data);
                }).catch(error => {
                console.log(error);
                });
            }                
        }        
    }
</script>