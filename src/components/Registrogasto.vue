<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Registro de Gastos Recurrentes</v-toolbar-title>
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
                    <v-dialog v-model="dialog" max-width="650px">
                    <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs4 sm4 md4>
                                    <v-select v-model="idconcepto" :items="conceptos" label="Concepto"></v-select>
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
                                                    v-model="fecgasto"
                                                    label="Vencimiento"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker 
                                                v-model="fecgasto"
                                                @input="menu1 = false">
                                            </v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </template> 
                                <v-flex xs4 sm4 md4>
                                    <v-text-field 
                                        type="number" 
                                        v-model="importe" 
                                        prefix="$"
                                        label="Importe"
                                        >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-select v-model="idforpago" :items="forpagos" label="Forma de Pago"></v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nota" clearable label="Nota"></v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-switch v-model="pendiente" class="mx-2" label="Pendiente?"></v-switch>
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
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Estado?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Estado?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el concepto {{ adNombre }}
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
                :items="gastos"
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
                        <v-icon v-if="$store.state.usuario.rol =='Administrador' || $store.state.usuario.rol =='JefeAdministracion'"
                        small
                        @click="deleteItem(props.item)"
                        >
                        delete
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
                    <td>{{ props.item.idgasto }}</td>
                    <td>
                        <v-chip v-if="props.item.pendiente" class="ma-2" :color="props.item.color" :text-color="props.item.texto" >{{ props.item.concepto }}</v-chip>
                        <v-chip v-else class="ma-2" >{{ props.item.concepto }}</v-chip>
                    </td>
                    <td>{{ (props.item.fecgasto)?props.item.fecgasto.substr(0,10):"" }}</td>
                    <td>
                        <div v-if="props.item.pendiente">
                            <span class="red--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>
                    <td>{{ props.item.importe }}</td>
                    <td>{{ props.item.forpago }}</td>
                    <td>{{ (props.item.nota)?props.item.nota.substr(0,20):"" }}</td>
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
                colores: [
                    {value: '#F44336', text: 'Rojo'},
                    {value: '#E91E63', text: 'Rosa'},
                    {value: '#9C27B0', text: 'Violeta'},
                    {value: '#673AB7', text: 'Violeta oscuro'},                    
                    {value: '#3F51B5', text: 'Indigo'},
                    {value: '#2196F3', text: 'Azul'},
                    {value: '#03A9F4', text: 'Celeste'},
                    {value: '#00BCD4', text: 'Cianico'},
                    {value: '#009688', text: 'Turquesa'},
                    {value: '#4CAF50', text: 'Verde'},
                    {value: '#8BC34A', text: 'Verde claro'},                    
                    {value: '#CDDC39', text: 'Lima'},
                    {value: '#FFEB3B', text: 'Amarillo'},
                    {value: '#FFC107', text: 'Ambar'},
                    {value: '#FF9800', text: 'Naranja'},
                    {value: '#FF5722', text: 'Naranja oscuro'},
                    {value: '#795548', text: 'Marron'},
                    {value: '#607D8B', text: 'Lívido'},                    
                    {value: '#9E9E9E', text: 'Gris'}
                ],
                textos: [
                    {value: 'white', text: 'Blanco'},
                    {value: 'black', text: 'Negro'},
                ],
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                dialog: false,
                conceptos:[],
                forpagos:[],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Id', value: 'idgasto' },
                    { text: 'Concepto de Gastos', value: 'concepto' },
                    { text: 'Vencimiento', value: 'fecgasto' },
                    { text: 'Pendiente', value: 'pendiente' },
                    { text: 'Importe', value: 'importe' },
                    { text: 'Forma de Pago', value: 'forpago' },
                    { text: 'Observaciones/Notas', value: 'nota' },
                    { text: 'Estado', value: 'activo', sortable: true  },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }                   ],
                search: '',
                editedIndex: -1,
                idgasto:'',
                idconcepto:'',
                fecgasto:'',
                importe: 0.00,
                idforpago:'',
                nota:'',
                pendiente: true,
                iduseralta:'',
                fecalta:'',
                iduserumod:'',
                fecumod:'',                
                gastos:[                   
                ],
                menu1: false,
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
                return this.editedIndex === -1 ? 'Nuevo Gasto' : 'Actualizar Gasto'
            },
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
            this.select();
        },
        methods:{
            crearPDF(){
                var columns = [
                    {title: "Id", dataKey: "idgasto"},
                    {title: "Concepto", dataKey: "concepto"},
                    {title: "Vencimiento", dataKey: "fecgasto"},
                    {title: "Importe", dataKey: "importe"},
                    {title: "Forma de pago", dataKey: "forpago"},
                    {title: "Pendiente", dataKey: "pendiente"},
                    {title: "Estado", dataKey: "activo"},
                ];
                var rows = [];

                this.gastos.map(function(x){
                    rows.push({idgasto:x.idgasto,concepto:x.concepto,fexgasto:x.fecgasto,importe:x.importe,forpago:x.forpago,activo:x.pendiente ? "Si" : "No",activo:x.activo ? "Activo" : "Inactivo"});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Gastos", 40, 30);
                    }
                });
                doc.save('Gastos.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Gastos/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.gastos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;                     
                    me.snackbar = true;                     
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var conceptosArray=[];
                var forpagosArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Conceptos/Select',configuracion).then(function(response){
                    //console.log(response);
                    conceptosArray=response.data.sort((a, b) => (a.concepto > b.concepto) ? 1 : -1);
                    conceptosArray.map(function(x){
                        me.conceptos.push({text: x.concepto,value:x.idconcepto});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
                axios.get('api/Forpagos/Select',configuracion).then(function(response){
                    //console.log(response);
                    forpagosArray=response.data.sort((a, b) => (a.forpago > b.forpago) ? 1 : -1);
                    forpagosArray.map(function(x){
                        me.forpagos.push({text: x.forpago,value:x.idforpago});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            editItem (item) {
                this.idgasto=item.idgasto;
                this.idconcepto=item.idconcepto;
                this.fecgasto=item.fecgasto.substr(0,10);
                this.importe=item.importe;
                this.idforpago=item.idforpago;
                this.pendiente=item.pendiente;
                this.nota=item.nota;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;              
                this.editedIndex=1;
                this.dialog = true
            },
            deleteItem (item) {
                var me=this;
                var resulta = confirm('Esta seguro de querer borrar el registro?');
                if (resulta) {
                    let header={"Authorization" : "Bearer " + me.$store.state.token};
                    let configuracion= {headers : header};
                    axios.delete('api/Gastos/Eliminar/'+item.idgasto,configuracion).then(function(response){
                        me.close();
                        me.limpiar();
                        me.listar();
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idgasto="";
                this.idconcepto="";
                this.fecgasto="";
                this.importe=0;
                this.idforpago="";
                this.pendiente=true;
                this.nota="";
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";                
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
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    axios.put('api/Gastos/Actualizar',{
                        'idgasto': me.idgasto,
                        'idconcepto':me.idconcepto,
                        'fecgasto': me.fecgasto,
                        'importe': me.importe,
                        'idforpago': me.idforpago,
                        'nota': me.nota,
                        'pendiente': me.pendiente,
                        'iduserumod': me.$store.state.usuario.idusuario,
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
                    axios.post('api/Gastos/Crear',{
                        'idconcepto':me.idconcepto,
                        'fecgasto': me.fecgasto,
                        'importe': me.importe,
                        'idforpago': me.idforpago,
                        'nota': me.nota,
                        'pendiente': me.pendiente,
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
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (!this.idconcepto){
                    this.validaMensaje.push("Debe elegir un concepto.");
                }
                if (!this.importe || this.importe<0 ){
                    this.validaMensaje.push("Debe ingresar un importe positivo.");
                }
                if (!this.idforpago){
                    this.validaMensaje.push("Debe elegir una Forma de Pago.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.concepto;
                this.adId=item.idconcepto;                
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
                axios.put('api/Gastos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Gastos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
