<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Personas</v-toolbar-title>
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
                <v-dialog v-model="dialog" max-width="1000px">
                    <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="nombre" label="Nombre">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <v-text-field v-model="emailpersonal" label="eMail">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <v-text-field v-model="telefonopersonal" label="Telefono">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 xs3 sm3 md3>
                                <v-select v-model="tipodocumento" 
                                :items="tipodocumentos" label="Tipo Doc.">
                                </v-select>
                            </v-flex>                                
                            <v-flex xs3 sm3 md3>
                                <v-text-field v-model="numdocumento" label="Nro. Documento">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="esdirector" v-model="esdirector">
                                <label for = "esdirector"> Es director?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="esep" v-model="esep">
                                <label for = "esp"> Es EP?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="eslp" v-model="eslp">
                                <label for = "eslp"> Es LP?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="escp" v-model="escp">
                                <label for = "escp"> Es CP?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="escrew" v-model="escrew">
                                <label for = "escrew"> Es Crew?</label>
                            </v-flex>                                
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="manejafondos" v-model="manejafondos">
                                <label for = "manejafondos"> Maneja Fondos?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="esproveedor" v-model="esproveedor">
                                <label for = "esproveedor"> Es proveedor?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="escliente" v-model="escliente">
                                <label for = "escliente"> Es Cliente?</label>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="domicilio" label="Domicilio">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="localidad" label="Localidad">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="cpostal" label="C.P.">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="idprovincia"
                                :items = "provincias" label = "Provincia">
                                </v-select>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="idpais"
                                :items = "paises" label = "País">
                                </v-select>
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
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Persona?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Persona?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            a {{ adNombre }}
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
                :items="personas"
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
                        </template>
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.emailpersonal }}</td>
                    <td>{{ props.item.telefonopersonal }}</td>
                    <td>
                        <div v-if="props.item.manejafondos">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.esdirector">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.esep">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.eslp">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.escp">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.escrew">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.esproveedor">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>
                        <div v-if="props.item.escliente">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>                   
                    <td>{{ props.item.domicilio }}</td>
                    <td>{{ props.item.localidad }}</td>
                    <td>{{ props.item.cpostal }}</td>                    
                    <td>{{ props.item.provincia }}</td>
                    <td>{{ props.item.pais }}</td>
                    <td>{{ props.item.tipodocumento }}</td>
                    <td>{{ props.item.numdocumento }}</td>
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
    import autoTable from 'jspdf-autotable';
    export default {
        data(){
            return {
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                personas:[],
                paises: [],
                provincias: [],               
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombre Completo', value: 'nombre', sortable: true },
                    { text: 'eMail', value: 'emailpersonal', sortable: true  },
                    { text: 'Telefono', value: 'telefonopersonal', sortable: true  },
                    { text: 'Fondos?', value: 'manejafondos', sortable: true  },                    
                    { text: 'Director?', value: 'esdirector', sortable: true  },
                    { text: 'EP?', value: 'esep', sortable: true  },
                    { text: 'LP?', value: 'eslp', sortable: true  },
                    { text: 'CP?', value: 'escp', sortable: true  },
                    { text: 'Crew?', value: 'escrew', sortable: true  },
                    { text: 'Proveedor?', value: 'esproveedor', sortable: true  },
                    { text: 'Cliente?', value: 'escliente', sortable: true  },
                    { text: 'Domicilio', value: 'domicilio', sortable: true },
                    { text: 'Localidad', value: 'localidad', sortable: true },
                    { text: 'C.P.', value: 'cpostal', sortable: true },
                    { text: 'Provincia', value: 'provincia', sortable: true  },
                    { text: 'Pais', value: 'pais', sortable: true  },
                    { text: 'Tipo Doc.', value: 'tipodocumento', sortable: true  },
                    { text: 'Númenro', value: 'numdocumento', sortable: true  },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                search: '',
                editedIndex: -1,
                idpersona: '',
                idpais:'',
                idprovincia:'',
                nombre: '',
                domicilio: '',
                localidad: '',
                cpostal: '',
                emailpersonal: '',
                telefonopersonal: '',
                tipodocumentos: ['CUIL','CUIT','DNI','PAS','LC','CI'],
                tipodocumento: '',
                numdocumento: '',
                manejafondos: false,
                esdirector: false,
                esep: false,
                eslp: false,
                escp: false,
                escrew: false,
                esproveedor: false,
                escliente: false,                
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
                return this.editedIndex === -1 ? 'Nueva persona' : 'Actualizar persona'
            }
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
                    {title: "Nombre", dataKey: "nombre"},
                    {title: "eMail", dataKey: "emailpersonal"}, 
                    {title: "Teléfono", dataKey: "telefonopersonal"}, 
                    {title: "Maneja Fondos", dataKey: "manejafondos"},
                    {title: "DIR", dataKey: "esdirector"},
                    {title: "EP", dataKey: "esep"},
                    {title: "LP", dataKey: "eslp"},
                    {title: "CP", dataKey: "escp"},
                    {title: "Crew", dataKey: "escrew"},
                    {title: "Prov", dataKey: "esproveedor"},
                    {title: "Cli", dataKey: "escliente"},
                    {title: "Domicilio", dataKey: "domicilio"}, 
                    {title: "Localidad", dataKey: "localidad"},
                    {title: "C.P.", dataKey: "cpostal"},
                    {title: "Provincia", dataKey: "provincia"}, 
                    {title: "Pais", dataKey: "pais"}, 
                    {title: "Tipo Doc.", dataKey: "tipodocumento"},
                    {title: "Número", dataKey: "numdocumento"},
                    {title: "Activo", dataKey: "activo"}
                ];
                var rows = [];

                this.personas.map(function(x){
                    rows.push({nombre:x.nombre,emailpersonal:x.emailpersonal,
                    telefonopersonal:x.telefonopersonal,manejafondos:x.manejafondos, esdirector:x.esdirector, esep:x.esep,eslp:x.eslp,escp:x.escp,
                    escrew:x.escrew, esproveedor:x.esproveedor,escliente:x.escliente,
                    domicilio:x.domicilio,localidad:x.localidad,cpostal: x.cpostal, provincia:x.provincia,pais:x.pais,tipodocumento:x.tipodocumento,numdocumento:x.numdocumento,activo:x.activo});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Personas", 40, 30);
                    }
                });
                doc.save('Personas.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Personas/Listar',configuracion).then(function(response){
                    me.personas=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
				var paisesArray=[];
				var provinciasArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Paises/Select',configuracion).then(function(response){
                    paisesArray=response.data;
                    paisesArray.map(function(x){
                        me.paises.push({text: x.pais,value:x.idpais});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
				axios.get('api/Provincias/Select',configuracion).then(function(response){
                    provinciasArray=response.data;
                    provinciasArray.map(function(x){
                        me.provincias.push({text: x.provincia,value:x.idprovincia});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            editItem (item) {
                this.idpersona=item.idpersona;
                this.idprovincia=item.idprovincia;
                this.idpais=item.idpais;
                this.nombre=item.nombre;
                this.domicilio=item.domicilio;
                this.localidad=item.localidad;
                this.cpostal=item.cpostal;                
                this.emailpersonal=item.emailpersonal;
                this.telefonopersonal=item.telefonopersonal;
                this.tipodocumento=item.tipodocumento;
                this.numdocumento=item.numdocumento;
                this.manejafondos=item.manejafondos;
                this.esdirector=item.esdirector;
                this.esep=item.esep;
                this.eslp=item.eslp;
                this.escp=item.escp;
                this.escrew=item.escrew;
                this.esproveedor=item.esproveedor;
                this.escliente=item.escliente;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idpersona="";
                this.idpais="";
                this.idprovincia="";
                this.nombre="";
                this.domicilio="";
                this.localidad="";
                this.cpostal="";
                this.emailpersonal="";
                this.telefonopersonal="";
                this.tipodocumento="";
                this.numdocumento="";
                this.manejafondos=false;
                this.esdirector=false;
                this.esep=false;
                this.eslp=false;
                this.escp=false;
                this.escrew=false;
                this.esproveedor=false;
                this.escliente=false;
                this.editedIndex=1;
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
                    axios.put('api/Personas/Actualizar',{
                        'idpersona': me.idpersona,
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'nombre': me.nombre,
                        'domicilio': me.domicilio,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'emailpersonal': me.emailpersonal,
                        'telefonopersonal': me.telefonopersonal,
                        'tipodocumento': me.tipodocumento,
                        'numdocumento': me.numdocumento,
                        'manejafondos': me.manejafondos,
                        'esdirector': me.esdirector,
                        'esep': me.esep,
                        'eslp': me.eslp,
                        'escp': me.escp,
                        'escrew': me.escrew,
                        'esproveedor': me.esproveedor,
                        'escliente': me.escliente
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
                    axios.post('api/Personas/Crear',{
                        'idpais':me.idpais,
                        'idprovincia':me.idprovincia,
                        'nombre': me.nombre,
                        'domicilio': me.domicilio,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'emailpersonal': me.emailpersonal,
                        'telefonopersonal': me.telefonopersonal,
                        'tipodocumento': me.tipodocumento,
                        'numdocumento': me.numdocumento,
                        'manejafondos': me.manejafondos,
                        'esdirector': me.esdirector,
                        'esep': me.esep,
                        'eslp': me.eslp,
                        'escp': me.escp,
                        'escrew': me.escrew,
                        'esproveedor': me.esproveedor,
                        'escliente': me.escliente
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

                if (this.nombre.length<3 || this.nombre.length>100){
                    this.validaMensaje.push("El nombre debe tener más de 3 caracteres y menos de 100 caracteres.");
                }
                if (!this.idpais){
                    this.validaMensaje.push("Seleccione un país.");
                }
                if (!this.idprovincia){
                    this.validaMensaje.push("Seleccione una provincia.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId=item.idpersona;                
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
                axios.put('api/Personas/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Personas/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
