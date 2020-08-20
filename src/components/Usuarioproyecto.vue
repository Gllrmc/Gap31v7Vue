<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Usuario x Proyecto</v-toolbar-title>
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
                <v-dialog v-model="dialog" max-width="550px">
                    <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-select v-model="idproyecto"
                                :items="proyectos" label="Proyecto">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-select v-model="idusuario"
                                :items="usuarios" label="Usuario">
                                </v-select>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <input type="checkbox" id="vivo" v-model="vivo">
                                <label for = "vivo">Acceso Vivo?</label>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <input type="checkbox" id="post" v-model="post">
                                <label for = "post">Acceso Post?</label>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <input type="checkbox" id="confidencial" v-model="confidencial">
                                <label for = "confidencial">Acceso Confidencial?</label>
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
                            la asignación: {{ adNombre }}
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
                <v-dialog v-model="adModalC" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">¿Clasificar?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desclasificar?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el acceso confidencial de: {{ adNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrarC">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activarC">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivarC">
                                Desactivar
                            </v-btn>
                        </v-card-actions>

                    </v-card>
                </v-dialog>                
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="usuarioproyectos"
                :search="search"
                class="elevation-1"
            >
                <template v-if="!props.item.cierreprod" slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                        <template v-if="props.item.confidencial">
                            <v-icon
                            small
                            class="mr-2"
                            @click="activarDesactivarMostrarC(2,props.item)"
                            >
                            visibility_off
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon
                            small
                            class="mr-2"
                            @click="activarDesactivarMostrarC(1,props.item)"
                            >
                            visibility
                            </v-icon>
                        </template>
                        <template v-if="props.item.activo">
                            <v-icon
                            small
                            class="mr-2"
                            @click="activarDesactivarMostrar(2,props.item)"
                            >
                            block
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon
                            small
                            class="mr-2"
                            @click="activarDesactivarMostrar(1,props.item)"
                            >
                            check
                            </v-icon>
                        </template>
                    </td>
                    <td>{{ props.item.proyectoorden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.userid }}</td>
                    <td>
                        <div v-if="props.item.vivo">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>                    
                    <td>
                        <div v-if="props.item.post">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>                    
                    <td>
                        <div v-if="props.item.confidencial">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>                    
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
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,                
                usuarioproyectos:[],
                proyectos:[],                
                usuarios:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'proyectoorden' },
                    { text: 'Proyecto', value: 'proyecto' },
                    { text: 'Usuario', value: 'userid' },
                    { text: 'Vivo', value: 'vivo', sortable: false  },
                    { text: 'Post', value: 'post', sortable: false  },
                    { text: 'Confidencial', value: 'confidencial', sortable: false  },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }              
                ],
                search: '',
                editedIndex: -1,
                idusuarioproyecto: '',
                idusuario:'',
                idproyecto: '',
                vivo: false,
                post: false,
                confidencial: false,
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',                
                idpersona:'',
                userid:'',
                telefono: '',
                email: '',
                password:'',
                actPassword:false,
                passwordAnt:'',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adModalC: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''             
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nueva asignación Usuario/Proyecto' : 'Actualizar relación Usuario/Proyecto'
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
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Usuarioproyectos/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.usuarioproyectos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var usuariosArray=[];
                var proyectosArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Usuarios/Listaractivos',configuracion).then(function(response){
                    usuariosArray=response.data;
                    usuariosArray.map(function(x){
                        me.usuarios.push({text: x.userid,value:x.idusuario});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
                axios.get('api/Proyectos/Select',configuracion).then(function(response){
                    proyectosArray=response.data;
                    proyectosArray.map(function(x){
                        me.proyectos.push({text: x.orden + ': '+x.proyecto,value:x.idproyecto});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });                
            },
            editItem (item) {
                this.idusuarioproyecto=item.idusuarioproyecto;
                this.idusuario=item.idusuario;
                this.idproyecto=item.idproyecto;
                this.vivo=item.vivo;
                this.post=item.post;
                this.confidencial=item.confidencial;
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
                this.idusuarioproyecto="";
                this.idusuario="";
                this.idproyecto="";
                this.vivo=false;
                this.post=false;
                this.confidencial=false;
                this.iduseralta="";
                this.fecalta="";
                this.iduserumod="";
                this.fecumod="";
                this.actPassword=false;
                this.editedIndex=-1;
            },
            guardar () {
                if (this.validar()){
                    return;
                }
                let me=this;
                var date = new Date();                   
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    axios.put('api/Usuarioproyectos/Actualizar',{
                        'idusuarioproyecto':me.idusuarioproyecto,
                        'idusuario':me.idusuario,
                        'idproyecto':me.idproyecto,
                        'vivo':me.vivo,
                        'post':me.post,
                        'confidencial':me.confidencial,
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
                    axios.post('api/Usuarioproyectos/Crear',{
                        'idusuario':me.idusuario,
                        'idproyecto':me.idproyecto,
                        'vivo':me.vivo,
                        'post':me.post,
                        'confidencial':me.confidencial,
                        'iduseralta': me.$store.state.usuario.idusuario,
                        'fecalta': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()                        
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

                if (!this.idproyecto){
                    this.validaMensaje.push("Seleccione un proyecto.");
                }
                if (!this.idusuario){
                    this.validaMensaje.push("Seleccione un usuario.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.proyectoorden + ': ' + item.proyecto + ' - ' + item.userid;
                this.adId=item.idusuarioproyecto;                
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
                axios.put('api/Usuarioproyectos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Usuarioproyectos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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

            activarDesactivarMostrarC(accion,item){
                this.adModalC=1;
                this.adNombre=item.userid + ' a ' + item.proyectoorden + ': ' + item.proyecto;
                this.adId=item.idusuarioproyecto;                
                if (accion==1){
                    this.adAccion=1;
                }
                else if (accion==2){
                    this.adAccion=2;
                }
                else{
                    this.adModalC=0;
                }
            },
            activarDesactivarCerrarC(){
                this.adModalC=0;
            },
            activarC(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Usuarioproyectos/ActivarC/'+this.adId,{},configuracion).then(function(response){
                    me.adModalC=0;
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
            desactivarC(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Usuarioproyectos/DesactivarC/'+this.adId,{},configuracion).then(function(response){
                    me.adModalC=0;
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
