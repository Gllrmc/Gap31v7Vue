<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Conceptos de Gastos Recurrentes</v-toolbar-title>
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
                    <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="concepto" clearable label="Concepto"></v-text-field>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-text-field v-model="cuentagcom" clearable label="Cuenta GCom"></v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-select v-model="texto" :items="textos" label="Color texto"></v-select>
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <v-select v-model="color" :items="colores" label="Color fondo"></v-select>
                                </v-flex>
                                <v-chip class="ma-2" :color="color" :text-color="texto" >
                                    Ejemplo de como se visualizará el concepto en el calendario
                                </v-chip>                                    
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
                :items="conceptos"
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
                    <td>{{ props.item.idconcepto }}</td>
                    <td><v-chip class="ma-2" :color="props.item.color" :text-color="props.item.texto" >{{ props.item.concepto }}</v-chip></td>
                    <td>{{ props.item.cuentagcom }}</td>
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
                    {value: '#9E9E9E', text: 'Gris'},
                    {value: '#000000', text: 'Negro'},
                    {value: '#FFFFFF', text: 'Blanco'}
                ],
                textos: [
                    {value: 'white', text: 'Blanco'},
                    {value: 'black', text: 'Negro'},
                ],
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Id', value: 'idconcepto' },
                    { text: 'Concepto de Gastos', value: 'concepto' },
                    { text: 'Cuenta GCom', value: 'cuentagcom' },
                    { text: 'Estado', value: 'activo', sortable: false  },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }                   ],
                search: '',
                editedIndex: -1,
                idconcepto:'',
                concepto:'',
                color: '',
                texto: '',
                cuentagcom: '',
                iduseralta:'',
                fecalta:'',
                iduserumod:'',
                fecumod:'',                
                conceptos:[                   
                ],
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
                return this.editedIndex === -1 ? 'Nuevo concepto' : 'Actualizar concepto'
            },
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
            crearPDF(){
                var columns = [
                    {title: "Id", dataKey: "idconcepto"},
                    {title: "Concepto", dataKey: "concepto"},
                    {title: "Texto", dataKey: "texto"},
                    {title: "Color", dataKey: "color"},
                    {title: "Cuenta Gcom", dataKey: "cuentagcom"},
                    {title: "Estado", dataKey: "activo"},
                ];
                var rows = [];

                this.conceptos.map(function(x){
                    rows.push({idconcepto:x.idconcepto,concepto:x.concepto,texto:x.texto,color:x.color,cuentagcom:x.cuentagcom,activo:x.activo ? "Activo" : "Inactivo"});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Conceptos", 40, 30);
                    }
                });
                doc.save('Conceptos.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Conceptos/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.conceptos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;                     
                    me.snackbar = true;                     
                    console.log(error);
                });
            },
            editItem (item) {
                this.idconcepto=item.idconcepto;
                this.concepto=item.concepto;
                this.color=item.color;
                this.texto=item.texto;
                this.cuentagcom=item.cuentagcom;
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
                this.idconcepto="";
                this.concepto="";
                this.color="";
                this.text="";
                this.cuentagcom="";
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
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    let me=this;
                    axios.put('api/Conceptos/Actualizar',{
                        'idconcepto':me.idconcepto,
                        'concepto': me.concepto,
                        'color': me.color,
                        'texto': me.texto,
                        'cuentagcom': me.cuentagcom,
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
                    let me=this;
                    axios.post('api/Conceptos/Crear',{
                        'concepto': me.concepto,
                        'color': me.color,
                        'texto': me.texto,
                        'cuentagcom': me.cuentagcom,
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

                if (this.concepto.length<3 || this.concepto.length>50){
                    this.validaMensaje.push("El nombre del concepto no debe tener menos de 3 caracteres y mas de 50 caracteres.");
                }
                if (!this.color){
                    this.validaMensaje.push("Debe elegir un color de Fondo para el concepto.");
                }
                if (!this.texto){
                    this.validaMensaje.push("Debe elegir un color de Texto para el concepto.");
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
                axios.put('api/Conceptos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Conceptos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
