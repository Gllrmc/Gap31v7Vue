<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Usuarios</v-toolbar-title>
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
                <v-dialog v-model="dialog" max-width="500px">
                    <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field v-model="userid" label="Userid">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-select v-model="idrol"
                                :items="roles" label="Rol">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-autocomplete 
                                    v-model="idpersona" 
                                    clearable 
                                    :items="personas"
                                    :search-input.sync="searchp" 
                                    label="Persona">
                                </v-autocomplete>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field v-model="telefono" label="Teléfono">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field v-model="email" label="Email">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field type="password" 
                                v-model="password" 
                                label="Password">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-switch v-model="pxch" class="mx-2" label="Solicitar Password"></v-switch>
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
                :items="usuarios"
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
                        <template v-if="props.item.condicion">
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
                    <td>{{ props.item.userid }}</td>
                    <td>{{ props.item.rol }}</td>
                    <td>{{ props.item.idpersona }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>
                        <div v-if="props.item.condicion">
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
                usuarios:[],
                roles:[],
                personas:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Userid', value: 'userid' },
                    { text: 'Rol', value: 'rol' },
                    { text: 'Idpersona', value: 'idpersona' },
                    { text: 'Teléfono', value: 'telefono', sortable: false  },
                    { text: 'Email', value: 'email', sortable: false  },
                    { text: 'Estado', value: 'condicion', sortable: false  }                
                ],
                search: '',
                searchp: '',
                editedIndex: -1,
                id: '',
                idrol:'',
                idpersona:'',
                userid:'',
                telefono: '',
                email: '',
                password:'',
                pxch:false,
                actPassword:false,
                passwordAnt:'',
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
                return this.editedIndex === -1 ? 'Nuevo usuario' : 'Actualizar usuario'
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
            genpasswd(n) {
                // 36 ** 11 > Number.MAX_SAFE_INTEGER
                if (n > 10)
                    throw new Error('Too big n for this function');
                var x = "0000000000" + Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36);
                return x.slice(-n);
            },            
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.usuarios=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var rolesArray=[];
                var personasArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                
                axios.get('api/Roles/Select',configuracion).then(function(response){
                    rolesArray=response.data;
                    rolesArray.map(function(x){
                        me.roles.push({text: x.nombre,value:x.idrol});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
                axios.get('api/Personas/Select',configuracion).then(function(response){
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
                this.id=item.idusuario;
                this.idrol=item.idrol;
                this.idpersona=item.idpersona;
                this.userid=item.userid;
                this.telefono=item.telefono;
                this.email=item.email;
                this.password=item.password_hash;
                this.passwordAnt=item.password_hash;
                this.pxch=item.pxch;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.id="";
                this.idrol="";
                this.idpersona="";
                this.userid="";
                this.telefono="";
                this.email="";
                this.password="";
                this.passwordAnt="";
                this.pxch=false;
                this.actPassword=false;
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
                    if (me.password!=me.passwordAnt){
                        me.actPassword=true;
                    }
                    axios.put('api/Usuarios/Actualizar',{
                        'idusuario':me.id,
                        'idrol':me.idrol,
                        'idpersona':me.idpersona,
                        'userid':me.userid,
                        'telefono': me.telefono,
                        'email':me.email,
                        'password':me.password,
                        'act_password':me.actPassword,
                        'pxch':me.pxch
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
                    axios.post('api/Usuarios/Crear',{
                        'idrol':me.idrol,
                        'idpersona':me.idpersona,
                        'userid':me.userid,
                        'telefono': me.telefono,
                        'email':me.email,
                        'password':me.password,
                        'pxch':me.pxch
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

                if (this.userid.length<3 || this.userid.length>100){
                    this.validaMensaje.push("El nombre debe tener más de 3 caracteres y menos de 100 caracteres.");
                }
                if (!this.idrol){
                    this.validaMensaje.push("Seleccione un rol.");
                }
                if (!this.email){
                    this.validaMensaje.push("Ingrese el email del usuario.");
                }
                if (!this.password){
                    this.validaMensaje.push("Ingrese el password del usuario.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.userid;
                this.adId=item.idusuario;                
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
                axios.put('api/Usuarios/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Usuarios/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
