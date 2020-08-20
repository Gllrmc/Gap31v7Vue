<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Distribucion de Fondos - Pedidos</v-toolbar-title>
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
            <v-dialog v-model="dialog" max-width="1400px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Distribucion Fondos Proyecto #{{orden}} | Pedido #{{numpedido}}</span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="700px">
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs6 sm6 md6>
                                            <v-autocomplete 
                                                v-model="idusuario" 
                                                clearable 
                                                :items="usuarios"
                                                :search-input.sync="searchr" 
                                                label="Responsable">
                                            </v-autocomplete>
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
                                                            v-model="fecdistribucion"
                                                            label="Fecha Distribución"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker 
                                                        v-model="fecdistribucion"
                                                        :min = "fecpedido"  
                                                        @input="menu1 = false">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
                                        <v-flex xs3 sm3 md3>
                                            <v-text-field type="number" v-model="importe" prefix="$" label="Importe">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12>
                                            <v-text-field v-model="notas" label="Notas">
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Distribución de Fondo?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Distribución de Fondo?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Desactivar </span>
                                    la distribución de fondo de {{ adNombre }}
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
                        <v-dialog v-model="adModal2" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion2==1">¿Marcar como Rendido?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion2==2">¿Desmarcar como Rendido?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion2==1">Marcar </span>
                                    <span v-if="adAccion2==2">Desmarcar </span>
                                    la distribución de fondo de {{ adNombre }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                                        Cancelar
                                    </v-btn>
                                    <v-btn v-if="adAccion2==1" color="orange darken-4" flat="flat" @click="activar2">
                                        Marcar
                                    </v-btn>
                                    <v-btn v-if="adAccion2==2" color="orange darken-4" flat="flat" @click="desactivar2">
                                        Desmarcar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>                                       
                        <v-data-table
                        :headers="headersDetalle"
                        :items="distribucionfondos"
                        class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td class="justify-center layout px-20">
                                    <v-icon v-if="!props.item.devolucion && !props.item.rendido"
                                    small
                                    class="mr-2"
                                    @click="editDetailItem(props.item)"
                                    >
                                    edit
                                    </v-icon>
                                    <template v-if="!props.item.devolucion && !props.item.rendido">
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
                                    <template v-if="!props.item.devolucion">
                                        <template v-if="props.item.rendido">
                                            <v-icon
                                            small
                                            @click="activarDesactivarRendir(2,props.item)"
                                            >
                                            lock
                                            </v-icon>
                                        </template>
                                        <template v-else>
                                            <v-icon
                                            small
                                            @click="activarDesactivarRendir(1,props.item)"
                                            >
                                            lock_open
                                            </v-icon>
                                        </template>    
                                    </template>                                         
                                </td>
                                <td>{{ props.item.usuario }}</td>
                                <td>{{ props.item.fecdistribucion.substr(0, 10) }}</td>
                                <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                                <td class="text-xs-center">
                                    <div v-if="props.item.devolucion">
                                        <span class="red--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="green--text">No</span>
                                    </div>
                                </td>  
                                <td class="text-xs-center">
                                    <div v-if="props.item.rendido">
                                        <span class="green--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="blue--text">No</span>
                                    </div>
                                </td>  
                                <td>{{ props.item.notas ? props.item.notas.substr(0, 20) : props.item.notas }}</td>
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
                        <v-flex class="text-xs-right">
                            <strong>Solicitado: </strong>$ {{totalSolicitado.toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong> Entregado: </strong>$ {{totalEntregado=(calcularTotal).toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong> Disponile: </strong>$ {{totalDisponible=(totalSolicitado-totalEntregado).toFixed(2)}}
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
                :items="pedidofondos"
                :search="search"
                class="elevation-1"
                >
                <template slot="items" slot-scope="props">
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
                    <td class="text-xs-center">{{ props.item.numpedido }}</td>
                    <td>{{ props.item.responsable }}</td>
                    <td>{{ props.item.fecpedido.substr(0, 10) }}</td>
                    <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                    <td>{{ props.item.notas ? props.item.notas.substr(0, 20) : props.item.notas }}</td>
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
                pedidofondos:[],
                distribucionfondos:[],
                usuarios:[],
                idpedidofondo: '',
                idproyecto: '',
                orden: '',
                idusuario: '',
                numpedido: '',
                fecpedido: '',
                importe: 0,
                notas: '',
                iddistribucionfondo:'',
                fecdistribucion: '',
                devolucion: false,                
                rendido: false,
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                menu1: false,
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: '#Pedido', value: 'numpedido', sortable: true },
                    { text: 'Responsable', value: 'responsable', sortable: true },
                    { text: 'Fecha Pedido', value: 'fecpedido', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Notas', value: 'notas', sortable: true }          
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Usuario Responsable', value: 'usuario', sortable: true },
                    { text: 'Fecha de entrega', value: 'fecdistribucion', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Devolucion?', value: 'devolucion', sortable: true },
                    { text: 'Rendido?', value: 'rendido', sortable: true },
                    { text: 'Notas y/o Observaciones', value: 'notas', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fecha/Hora de Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'F/H Ultima Modificación', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                                      
                ],
                totalSolicitado: 0,
                totalEntregado: 0,
                totalDisponible: 0,                   
                search: '',
                searchr: '',
                editedIndex: -1,
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                adModal2: 0,
                adAccion2: 0                                         }
            },
            computed: {
                formTitle () {
                    return this.editedIndex === -1 ? 'Nueva distribución' : 'Actualizar distribución'
                },
            calcularTotal:function(){
                    var resultado=0.0;
                    for(var i=0;i<this.distribucionfondos.length;i++){
                        resultado=resultado+(this.distribucionfondos[i].activo?this.distribucionfondos[i].importe:0);
                    }
                    return resultado;
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
                    axios.get('api/Pedidofondos/ListarActivos',configuracion).then(function(response){
                        //console.log(response);
                        me.pedidofondos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }else{
                    axios.get('api/Pedidofondos/Listaractivosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.pedidofondos=response.data;
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
                axios.get('api/Distribucionfondos/ListarPedidofondo/'+this.idpedidofondo,configuracion).then(function(response){
                    //console.log(response);
                    me.distribucionfondos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var usuariosArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Usuarios/SelectUsuario',configuracion).then(function(response){
                    //console.log(response);
                    usuariosArray=response.data;
                    usuariosArray.map(function(x){
                        me.usuarios.push({text: x.userid,value:x.idusuario});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            editMasterItem (item) {
                //console.log(item);                
                this.idpedidofondo = item.idpedidofondo;
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.idusuario = item.idusuario;
                this.numpedido = item.numpedido;
                this.fecpedido = item.fecpedido.substr(0, 10);
                this.importe = item.importe;
                this.totalSolicitado = item.importe;
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                //console.log(item);
                this.iddistribucionfondo = item.iddistribucionfondo;
                this.idusuario = item.idusuario;
                this.fecdistribucion = item.fecdistribucion.substr(0, 10);
                this.devolucion = item.devolucion;
                this.importe = item.importe;
                this.notas = item.notas;
                this.rendido = item.rendido;
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
                this.idpedidofondo = '';
                this.idproyecto = '';
                this.orden = '';
                this.idusuario = '';
                this.numpedido = '';
                this.fecpedido = '';
                this.importe = '';
                this.totalSolicitado = 0;                
                this.totalEntregado = 0;
                this.totalDisponible = 0;  
            },
            limpiarDetail() {
                this.iddistribucionfondo = '';
                this.idusuario = '';
                this.fecdistribucion = '';
                this.devolucion = false;
                this.importe = 0;
                this.notas = '';
                this.rendido = '';
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.totalEntregado = 0;
                this.totalDisponible = 0;
                this.searchr = '';
                this.editedIndex=-1;
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
                    axios.put('api/Distribucionfondos/Actualizar',{
                        'iddistribucionfondo': me.iddistribucionfondo,
                        'idpedidofondo': me.idpedidofondo,
                        'idusuario': me.idusuario,
                        'fecdistribucion': me.fecdistribucion,
                        'devolucion': me.devolucion,
                        'importe': me.importe,
                        'notas': me.notas,
                        'rendido': me.rendido,
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
                    axios.post('api/Distribucionfondos/Crear',{
                        'idpedidofondo': me.idpedidofondo,
                        'idusuario': me.idusuario,
                        'fecdistribucion': me.fecdistribucion,
                        'devolucion': me.devolucion,
                        'importe': me.importe,
                        'notas': me.notas,
                        'rendido': false,
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
                if (!this.idusuario){
                    this.validaMensaje.push("Ingrese un usuario responsable.");
                }
                if (!this.fecdistribucion){
                    this.validaMensaje.push("Ingrese una fecha de distribución de fondo.");
                }
                if (!this.importe || Number(this.importe) <= 0 ){
                    this.validaMensaje.push("Ingrese un importe positivo.");
                }
                if (this.totalDisponible-Number(this.importe)<0 && this.editedIndex == -1  ){
                    this.validaMensaje.push("Valide los montos ingresados vs disponibles.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.usuario + '/ $ ' + item.importe;
                this.adId=item.iddistribucionfondo;                
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
                this.adModal2=0;
            },
            activar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Distribucionfondos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Distribucionfondos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
            activarDesactivarRendir(accion,item){
                this.adModal2=1;
                this.adNombre=item.usuario + '/ $ ' + item.importe;
                this.adId=item.iddistribucionfondo;                
                if (accion==1){
                    this.adAccion2=1;
                }
                else if (accion==2){
                    this.adAccion2=2;
                }
                else{
                    this.adModal2=0;
                }
            },
            activar2(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Distribucionfondos/ActivarRendido/'+this.adId,{},configuracion).then(function(response){
                    me.adModal2=0;
                    me.adAccion2=0;
                    me.adNombre="";
                    me.adId="";
                    me.listarDetail();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            desactivar2(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Distribucionfondos/DesactivarRendido/'+this.adId,{},configuracion).then(function(response){
                    me.adModal2=0;
                    me.adAccion2=0;
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
