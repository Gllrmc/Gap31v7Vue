<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Proveedores</v-toolbar-title>
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
                                    <v-text-field v-model="cuit" label="CUIT">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-select v-model="situacioniva"
                                    :items = "situacionesiva" label = "IVA">
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
                                    <v-select v-model="idpersona"
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
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Proveedor?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Proveedor?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Desactivar </span>
                                el proveedor {{ adNombre }}
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
                :items="proveedores"
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
                proveedores:[],
                paises: [],
                provincias: [],
                personas:[],               
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Razon Social', value: 'razonsocial', sortable: true },
                    { text: 'CUIT', value: 'cuit', sortable: true },
                    { text: 'IVA', value: 'situacioniva', sortable: true },
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
                idproveedor:'',
                razonsocial: '',
                cuit:'',
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
                situacioniva:'',
                email:'',
                telefono:'',
                direccion: '',
                localidad: '',
                cpostal: '',
                idpersona:'',
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
                return this.editedIndex === -1 ? 'Nuevo proveedor' : 'Actualizar proveedor'
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

                this.proveedores.map(function(x){
                    rows.push({razonsocial:x.razonsocial,cuit:x.cuit, situacioniva:x.situacioniva, email:x.email,
                    telefono:x.telefono, direccion:x.direccion,localidad:x.localidad,provincia:x.provincia,pais:x.pais,
                    activo:x.activo});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Proveedores", 40, 30);
                    }
                });
                doc.save('Proveedores.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				console.log(configuracion);
                axios.get('api/Proveedores/Listar',configuracion).then(function(response){
                    console.log(response);
                    me.proveedores=response.data;
                }).catch(function(error){
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
                    console.log(error);
                });
				axios.get('api/Provincias/Select',configuracion).then(function(response){
                    //console.log(response);
                    provinciasArray=response.data;
                    provinciasArray.map(function(x){
                        me.provincias.push({text: x.provincia,value:x.idprovincia});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Personas/SelectContactoProveedor',configuracion).then(function(response){
                    //console.log(response);
                    personasArray=response.data;
                    personasArray.map(function(x){
                        me.personas.push({text: x.nombre,value:x.idpersona});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.idproveedor=item.idproveedor;
                this.idprovincia=item.idprovincia;
                this.idpais=item.idpais;
                this.razonsocial=item.razonsocial;
                this.cuit=item.cuit;
                this.situacioniva=item.situacioniva;
                this.email=item.email;
                this.telefono=item.telefono;
                this.direccion=item.direccion;
                this.localidad=item.localidad;
                this.cpostal=item.cpostal;
                this.idpersona=item.idpersona;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idproveedor="";
                this.idpais="";
                this.idprovincia="";
                this.razonsocial="";
                this.cuit="";
                this.situacioniva="";
                this.email="";
                this.telefono="";
                this.direccion="";
                this.localidad="";
                this.cpostal="";
                this.idpersona="";
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
                    console.log(me);
                    axios.put('api/Proveedores/Actualizar',{
                        'idproveedor': me.idproveedor,
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'razonsocial': me.razonsocial,
                        'cuit': me.cuit,
                        'situacioniva': me.situacioniva,
                        'email': me.email,
                        'telefono': me.telefono,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'idpersona': me.idpersona
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    console.log(me);
                    axios.post('api/Proveedores/Crear',{
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'razonsocial': me.razonsocial,
                        'cuit': me.cuit,
                        'situacioniva': me.situacioniva,
                        'email': me.email,
                        'telefono': me.telefono,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'idpersona': me.idpersona
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
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
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.razonsocial;
                this.adId=item.idproveedor;                
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
                axios.put('api/Proveedores/Activar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Proveedores/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            }
        }        
    }
</script>
