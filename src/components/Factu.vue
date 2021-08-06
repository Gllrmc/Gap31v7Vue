<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Facturacion - Prospectos</v-toolbar-title>
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
                    <span class="headline">Facturacion para Prospecto #{{orden}}: {{proyecto}} </span>
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
                                            <v-flex xs3 sm3 md3>
                                                <v-select v-model="tipocomprobante"
                                                :items = "tipocomprobantes" 
                                                label = "Tipo">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs3 sm3 md3>
                                                <v-text-field 
                                                    v-model="numcomprobante" 
                                                    label="Comprobante" 
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
                                                                v-model="feccomprobante"
                                                                label="Fecha Facturacion"
                                                                prepend-icon="event"
                                                                readonly
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker 
                                                            v-model="feccomprobante"
                                                            @input="menu1 = false">
                                                        </v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </template> 
                                            <v-flex xs3 sm3 md3>
                                                <v-text-field 
                                                    type="number" 
                                                    v-model="impfactu" 
                                                    prefix="$"
                                                    label="Importe"
                                                    >
                                                </v-text-field>
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
                        <v-dialog v-model="adModal" max-width="450">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Facturación?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Facturación?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la Facturación {{ adNombre }}
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
                            :items="factus"
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
                                <td>{{ props.item.idfactu }}</td>
                                <td>{{ props.item.numfactu }}</td>
                                <td>{{ (props.item.feccomprobante) ? props.item.feccomprobante.substr(0,10) : "" }}</td>
                                <td>{{ tipocomprobantes.find(x => x.value===props.item.tipocomprobante ).text }}</td>
                                <td>{{ props.item.numcomprobante }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.impfactu) }}</td>
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
                            <strong>Total Ordenes: </strong>$ {{totalCalculado=(calcularTotal).toFixed(2)}}
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
                    <td>{{ (props.item.fecaprobacion) ? props.item.fecaprobacion.substr(0, 10) : "" }}</td>
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
                page: 1,
                // Arrays
                limbos:[],
                factus:[],
                // Detail
                idfactu: '',
                numfactu: '',
                feccomprobante: '',
                tipocomprobantes: [
                    {value: '01', text: 'Fc A'},
                    {value: '02', text: 'Fc B'},
                    {value: '07', text: 'Otro'},
                    {value: '08', text: 'Fc E'}
                ],
                tipocomprobante: '',
                numcomprobante: '',
                impfactu: '',
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
                    { text: '#Id', value: 'idfactu', sortable: true },
                    { text: '#Sec', value: 'numfactu', sortable: true },
                    { text: 'Fecha Cbte', value: 'feccomprobante', sortable: true },
                    { text: 'Cbte', value: 'tipocomprobante', sortable: true },
                    { text: '#Cbte', value: 'numcomprobante', sortable: true },
                    { text: 'Importe', value: 'impfactu', sortable: true },
                    { text: 'Nota', value: 'nota', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  },                                    
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],
                totalCalculado: 0,                 
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
                    return this.editedIndex === -1 ? 'Nuevo Facturación' : 'Actualizar Facturación'
                },
                calcularTotal:function(){
                        var subtotal=0.0;
                        for(var i=0;i<this.factus.length;i++){
                            subtotal+=(this.factus[i].activo?this.factus[i].impfactu:0);
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
                    axios.get('api/Limbos/ListarActivos',configuracion).then(function(response){
                        //console.log(response);
                        me.limbos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }else{
                    axios.get('api/Limbos/ListarActivosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
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
                axios.get('api/Factus/ListarLimbo/'+this.idlimbo,configuracion).then(function(response){
                    // console.log(response);
                    me.factus=response.data;
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
                this.fecaprobacion = (item.fecaprobacion) ? item.fecaprobacion.substr(0, 10) : "";
                this.ars1usd = item.ars1usd;
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                this.idfactu = item.idfactu;
                this.numfactu = item.numfactu;
                this.tipocomprobante = item.tipocomprobante;
                this.numcomprobante = item.numcomprobante;
                this.feccomprobante = (item.feccomprobante) ? item.feccomprobante.substr(0, 10) : "";
                this.impfactu = item.impfactu;
                this.nota = item.nota;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.editedIndex=1;
                this.dialogForm = true
            },
            deleteItem (item) {
                var me=this;
                var resulta = confirm('Esta seguro de querer borrar el registro?');
                if (resulta) {
                    let header={"Authorization" : "Bearer " + me.$store.state.token};
                    let configuracion= {headers : header};
                    axios.delete('api/Factus/Eliminar/'+item.idfactu,configuracion).then(function(response){
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
                this.idfactu = '';                
                this.orden = '';
                this.proyecto = '';
                this.cliente = '';
                this.ep = '';
                this.fecaprobacion = '';
                this.ars1usd = '',               
                this.totalCalculado = 0;
            },
            limpiarDetail() {
                this.idfactu = '';
                this.numfactu = '';
                this.tipocomprobante = '';
                this.numcomprobante = '';
                this.feccomprobante = '';
                this.impfactu = '';
                this.nota = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.totalCalculado=0;
                this.editedIndex=-1;
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
                    //Código para editar
                    //Código para guardar
                    // console.log(me);
                    axios.put('api/Factus/Actualizar',{
                        'idfactu': me.idfactu,
                        'feccomprobante': me.feccomprobante.substr(0,10),
                        'tipocomprobante': me.tipocomprobante,
                        'numcomprobante': me.numcomprobante,
                        'impfactu': me.impfactu,
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
                    axios.post('api/Factus/Crear',{
                        'idlimbo': me.idlimbo,
                        'feccomprobante': me.feccomprobante.substr(0,10),
                        'tipocomprobante': me.tipocomprobante,
                        'numcomprobante': me.numcomprobante,
                        'impfactu': me.impfactu,
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
                if (!this.feccomprobante){
                    this.validaMensaje.push("Ingrese una fecha.");
                }
                if (!this.impfactu){
                    this.validaMensaje.push("Ingrese un importe.");
                }
                if (!this.impfactu > 0){
                    this.validaMensaje.push("El importe debe ser positivo.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre='#' + item.numfactu + ' ' + item.feccomprobante.substr(0,10) + ' $ ' + item.impfactu;
                this.adId=item.idfactu;                
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
                axios.put('api/Factus/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Factus/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
        }        
    }
</script>