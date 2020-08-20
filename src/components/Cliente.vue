<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Clientes</v-toolbar-title>
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
                                <v-text-field v-model="razonsocial" label="Razon social">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="situacioniva"
                                :items = "situacionesiva" label = "IVA">
                                </v-select>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-text-field v-model="cuit" label="CUIT">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="situacioniibb"
                                :items = "situacionesiibb" @change="validarJurisdiccion()"  label = "IIBB">
                                </v-select>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="jurisdiccion"
                                :items = "jurisdicciones" :disabled="!esMl" label = "Jurisdicción">
                                </v-select>
                            </v-flex>                                
                            <v-flex xs6 sm6 md6>
                                <v-text-field v-model="email" label="eMail">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-text-field v-model="telefono" label="Telefono">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="direccion" label="Dirección">
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
                            <v-flex xs4 sm4 md4>
                                <v-select v-model="idprovincia"
                                :items = "provincias" label = "Provincia">
                                </v-select>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-select v-model="idpais"
                                :items = "paises" label = "País">
                                </v-select>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-select v-model="idpersona" clearable
                                :items = "personas" label = "Contacto">
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
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Cliente?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Cliente?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el cliente {{ adNombre }}
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
                :items="clientes"
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
                    <td>{{ props.item.razonsocial }}</td>
                    <td>{{ props.item.cuit }}</td>
                    <td>{{ props.item.situacioniva }}</td>
                    <td>{{ props.item.situacioniibb }}</td>
                    <td>{{ props.item.jurisdiccion }}</td>                      
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.direccion }}</td>
                    <td>{{ props.item.localidad }}</td>
                    <td>{{ props.item.cpostal }}</td>
                    <td>{{ props.item.provincia }}</td>
                    <td>{{ props.item.pais }}</td>
                    <td>{{ props.item.persona }}</td>
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
                clientes:[],
                paises: [],
                provincias: [],
                personas:[],               
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Razon Social', value: 'razonsocial', sortable: true },
                    { text: 'CUIT', value: 'cuit', sortable: true },
                    { text: 'IVA', value: 'situacioniva', sortable: true },
                    { text: 'IIBB', value: 'situacioniibb', sortable: true },
                    { text: 'Jurisdicción', value: 'jurisdiccion', sortable: true },                    
                    { text: 'eMail', value: 'email', sortable: true  },
                    { text: 'Telefono', value: 'telefono', sortable: true  },
                    { text: 'Dirección', value: 'direccion', sortable: true },
                    { text: 'Localidad', value: 'localidad', sortable: true },
                    { text: 'C.P.', value: 'cpostal', sortable: true },
                    { text: 'Provincia', value: 'provincia', sortable: true  },
                    { text: 'Pais', value: 'pais', sortable: true  },
                    { text: 'Contacto', value: 'persona', sortable: true  },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                search: '',
                editedIndex: -1,
                idpersona: '',
                idpais:'',
                idprovincia:'',
                idcliente:'',
                razonsocial: '',
                cuit:'',
                cuitoriginal:'',
                situacionesiva: [
                    {value: '01', text: 'IVA Responsable Inscripto'},
                    {value: '02', text: 'IVA Responsable no Inscripto'},
                    {value: '03', text: 'IVA no Responsable'},
                    {value: '04', text: 'IVA Sujeto Exento'},
                    {value: '05', text: 'Consumidor Final'},
                    {value: '06', text: 'Responsable Monotributo'},
                    {value: '07', text: 'Sujeto no Categorizado'},
                    {value: '08', text: 'Proveedor del Exterior'},
                    {value: '09', text: 'Cliente del Exterior'},
                    {value: '10', text: 'IVA Liberado – Ley Nº 19.640'},
                    {value: '11', text: 'IVA Responsable Inscripto – Agente de Percepción'},
                    {value: '12', text: 'Pequeño Contribuyente Eventual'},
                    {value: '13', text: 'Monotributista Social'},
                    {value: '14', text: 'Pequeño Contribuyente Eventual Social'}
                ],
                situacionesiibb: [
                    {value: '1', text: 'No Inscripto'},
                    {value: '2', text: 'Local'},
                    {value: '3', text: 'Convenio Multilateral'},
                    {value: '4', text: 'Regimen Simplificado'},
                    {value: '5', text: 'Excento'}
                ],                
                jurisdicciones: [
                    {value: '901', text: 'Capital Federal'},
                    {value: '902', text: 'Buenos Aires'},
                    {value: '903', text: 'Catamarca'},
                    {value: '904', text: 'Córdoba'},
                    {value: '905', text: 'Corrientes'},
                    {value: '906', text: 'Chaco'},
                    {value: '907', text: 'Chubut'},
                    {value: '908', text: 'Entre Ríos'},
                    {value: '909', text: 'Formosa'},
                    {value: '910', text: 'Jujuy'},
                    {value: '911', text: 'La Pampa'},
                    {value: '912', text: 'La Rioja'},
                    {value: '913', text: 'Mendoza'},
                    {value: '914', text: 'Misiones'},
                    {value: '915', text: 'Neuquén'},
                    {value: '916', text: 'Río Negro'},
                    {value: '917', text: 'Salta'},
                    {value: '918', text: 'San Juan'},
                    {value: '919', text: 'San Luis'},
                    {value: '920', text: 'Santa Cruz'},
                    {value: '921', text: 'Santa Fe'},
                    {value: '922', text: 'Santiago del Estero'},
                    {value: '923', text: 'Tierra del Fuego'},
                    {value: '924', text: 'Tucumán'}
                ],                
                situacioniva:'',
                situacioniibb: '',
                jurisdiccion: '',                
                email:'',
                telefono:'',
                direccion: '',
                localidad: '',
                cpostal: '',
                idpersona:'',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',                
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                esMl: ''            
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo cliente' : 'Actualizar cliente'
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
                    {title: "R.Social", dataKey: "razonsocial"},
                    {title: "CUIT", dataKey: "cuit"},
                    {title: "Sitacion IVA", dataKey: "situacioniva"},
                    {title: "eMail", dataKey: "email"}, 
                    {title: "Teléfono", dataKey: "telefono"}, 
                    {title: "Dirección", dataKey: "direccion"}, 
                    {title: "Localidad", dataKey: "localidad"},
                    {title: "C.P.", dataKey: "cpostal"}, 
                    {title: "Provincia", dataKey: "provincia"}, 
                    {title: "Pais", dataKey: "pais"}, 
                    {title: "Activo", dataKey: "activo"}
                ];
                var rows = [];

                this.clientes.map(function(x){
                    rows.push({razonsocial:x.razonsocial,cuit:x.cuit, situacioniva:x.situacioniva, email:x.email,
                    telefono:x.telefono, direccion:x.direccion,localidad:x.localidad,provincia:x.provincia,pais:x.pais,
                    activo:x.activo});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Clientes", 40, 30);
                    }
                });
                doc.save('Clientes.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				// console.log(configuracion);
                axios.get('api/Clientes/Listar',configuracion).then(function(response){
                    // console.log(response);
                    me.clientes=response.data;
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
                var personasArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Paises/Select',configuracion).then(function(response){
                    //console.log(response);
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
                    //console.log(response);
                    provinciasArray=response.data;
                    provinciasArray.map(function(x){
                        me.provincias.push({text: x.provincia,value:x.idprovincia});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                });
				axios.get('api/Personas/SelectContactoCliente',configuracion).then(function(response){
                    //console.log(response);
                    personasArray=response.data;
                    personasArray.map(function(x){
                        me.personas.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                });
            },
            editItem (item) {
                this.idcliente=item.idcliente;
                this.idprovincia=item.idprovincia;
                this.idpais=item.idpais;
                this.razonsocial=item.razonsocial;
                this.cuit=item.cuit;
                this.cuitoriginal=item.cuit;
                this.situacioniva=item.situacioniva;
                this.situacioniibb=item.situacioniibb;
                this.jurisdiccion=item.jurisdiccion;
                this.validarJurisdiccion();                                
                this.email=item.email;
                this.telefono=item.telefono;
                this.direccion=item.direccion;
                this.localidad=item.localidad;
                this.cpostal=item.cpostal;
                this.idpersona=item.idpersona;
                this.iduseralta=item.iduseralta;
                this.fecalta=item.fecalta;
                this.iduserumod=item.iduserumod;
                this.fecumod=item.fecumod;                
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idcliente="";
                this.idpais="";
                this.idprovincia="";
                this.razonsocial="";
                this.cuit="";
                this.cuitoriginal="";
                this.situacioniva="";
                this.situacioniibb="";
                this.jurisdiccion="";                
                this.email="";
                this.telefono="";
                this.direccion="";
                this.localidad="";
                this.cpostal="";
                this.idpersona="";
                this.editedIndex=-1;
                this.validaMensaje=[];
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
                    // console.log(me);
                    axios.put('api/Clientes/Actualizar',{
                        'idcliente': me.idcliente,
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'razonsocial': me.razonsocial,
                        'cuit': me.cuit,
                        'situacioniva': me.situacioniva,
                        'situacioniibb': me.situacioniibb,
                        'jurisdiccion': me.jurisdiccion,                        
                        'email': me.email,
                        'telefono': me.telefono,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'idpersona': me.idpersona,
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
                    let me=this;
                    // console.log(me);
                    axios.post('api/Clientes/Crear',{
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'razonsocial': me.razonsocial,
                        'cuit': me.cuit,
                        'situacioniva': me.situacioniva,
                        'situacioniibb': me.situacioniibb,
                        'jurisdiccion': me.jurisdiccion,                        
                        'email': me.email,
                        'telefono': me.telefono,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'idpersona': me.idpersona,
                        'iduseralta': me.$store.state.usuario.idusuario,
                        'fecalta': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString(),
                        'iduserumod': me.$store.state.usuario.idusuario                        
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
            validarJurisdiccion(){
                if (this.situacioniibb == '3'){
                    this.esMl = true;
                }
                else {
                    this.esMl = false;
                    this.jurisdiccion = '';
                }
            },            
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (this.razonsocial.length<3 || this.razonsocial.length>50){
                    this.validaMensaje.push("La razon social debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (!this.idpais){
                    this.validaMensaje.push("Seleccione un país.");
                }
                if (!this.idprovincia){
                    this.validaMensaje.push("Seleccione una provincia.");
                }
                if (!this.cuitValido(this.cuit)){
                    this.validaMensaje.push("Numero de CUIT duplicado.");
                }                
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            cuitValido(ref){
                let valido = true;
                if (ref.substr(0,2)<'50'&&!(this.cuitoriginal==this.cuit)){
                    for (let i=0; i < this.clientes.length; i++){
                        if (this.clientes[i]["cuit"] === ref) {
                            valido = false;
                            break;
                        }
                    }
                };
                return valido;
            },            
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.razonsocial;
                this.adId=item.idcliente;                
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
                axios.put('api/Clientes/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Clientes/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
