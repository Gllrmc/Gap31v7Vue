<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Empresas</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>            
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="empresa" label="Empresa">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="cuit" label="CUIT">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="direccion" label="Dirección">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="localidad" label="Localidad">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
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
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="telefono" label="telefono">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="email" label="eMail">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="webpage" label="Web Page">
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
                                <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="adModal" max-width="290">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Item?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Item?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Desactivar </span>
                                el ítem {{ adNombre }}
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
                :items="empresas"
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
                    <td>{{ props.item.empresa }}</td>
                    <td>{{ props.item.cuit }}</td>
                    <td>{{ props.item.direccion }}</td>
                    <td>{{ props.item.localidad }}</td>
                    <td>{{ props.item.cpostal }}</td>
                    <td>{{ props.item.provincia }}</td>
                    <td>{{ props.item.pais }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.email}}</td>
                    <td>{{ props.item.webpage }}</td>
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
                empresas:[],
                paises: [],
                provincias: [],               
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Empresa', value: 'empresa', sortable: true },
                    { text: 'CUIT', value: 'cuit', sortable: true },
                    { text: 'Dirección', value: 'direccion', sortable: true },
                    { text: 'Localidad', value: 'localidad', sortable: true },
                    { text: 'C.P.', value: 'cpostal', sortable: true },
                    { text: 'Provincia', value: 'provincia', sortable: true  },
                    { text: 'Pais', value: 'pais', sortable: true  },
                    { text: 'Telefono', value: 'telefono', sortable: true  },
                    { text: 'eMail', value: 'email', sortable: true  },
                    { text: 'Web Page', value: 'webpage', sortable: true  },
                    { text: 'Estado', value: 'activo', sortable: false  }                
                ],
                search: '',
                editedIndex: -1,
                idempresa: '',
                idpais:'',
                idprovincia:'',
                empresa: '',
                cuit: '',
                direccion: '',
                localidad: '',
                cpostal:'',
                email: '',
                telefono: '',
                webpage: '',
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
                return this.editedIndex === -1 ? 'Nueva empresa' : 'Actualizar empresa'
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
                    {title: "Empresa", dataKey: "empresa"},
                    {title: "CUIT", dataKey: "cuit"},
                    {title: "Dirección", dataKey: "direccion"}, 
                    {title: "Localidad", dataKey: "localidad"}, 
                    {title: "C.P.", dataKey: "cpostal"},
                    {title: "Provincia", dataKey: "provincia"}, 
                    {title: "Pais", dataKey: "pais"}, 
                    {title: "Teléfono", dataKey: "telefono"}, 
                    {title: "eMail", dataKey: "email"}, 
                    {title: "Web Page", dataKey: "webpage"},
                    {title: "Activo", dataKey: "activo"}
                ];
                var rows = [];

                this.empresas.map(function(x){
                    rows.push({empresa:x.empresa,cuit:x.cuit,direccion:x.direccion,localidad:x.localidad,cpostal:x.cpostal,provincia:x.provincia,pais:x.pais,
                    telefono:x.telefono,email:x.email,webpage:x.webpage,activo:x.activo});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Empresas", 40, 30);
                    }
                });
                doc.save('Empresas.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				console.log(configuracion);
                axios.get('api/Empresas/Listar',configuracion).then(function(response){
                    console.log(response);
                    me.empresas=response.data;
                }).catch(function(error){
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
                    console.log(response);
                    paisesArray=response.data;
                    paisesArray.map(function(x){
                        me.paises.push({text: x.pais,value:x.idpais});
                    });
                }).catch(function(error){
                    console.log(error);
                });
				axios.get('api/Provincias/Select',configuracion).then(function(response){
                    console.log(response);
                    provinciasArray=response.data;
                    provinciasArray.map(function(x){
                        me.provincias.push({text: x.provincia,value:x.idprovincia});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.idempresa=item.idempresa;
                this.idprovincia=item.idprovincia;
                this.idpais=item.idpais;
                this.empresa=item.empresa;
                this.cuit=item.cuit;
                this.direccion=item.direccion;
                this.localidad=item.localidad;
                this.cpostal=item.cpostal;
                this.telefono=item.telefono;
                this.email=item.email;
                this.webpage=item.webpage;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idempresa="";
                this.idpais="";
                this.idprovincia="";
                this.empresa="";
                this.cuit="";
                this.direccion="";
                this.localidad="";
                this.telefono="";
                this.email="";
                this.webpage="";
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
                    axios.put('api/Empresas/Actualizar',{
                        'idempresa':me.idempresa,
                        'idpais':me.idpais,
                        'idprovincia':me.idprovincia,
                        'empresa': me.empresa,
                        'cuit': me.cuit,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'telefono': me.telefono,
                        'email': me.email,
                        'webpage': me.webpage,
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
                    axios.post('api/Empresas/Crear',{
                        'idpais':me.idpais,
                        'idprovincia':me.idprovincia,
                        'empresa': me.empresa,
                        'cuit': me.cuit,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'telefono': me.telefono,
                        'email': me.email,
                        'webpage': me.webpage,
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

                if (this.empresa.length<3 || this.empresa.length>50){
                    this.validaMensaje.push("La empresa debe tener más de 3 caracteres y menos de 50 caracteres.");
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
                this.adNombre=item.empresa;
                this.adId=item.idempresa;                
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
                axios.put('api/Empresas/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Empresas/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
