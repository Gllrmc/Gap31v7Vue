<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Presupuesto</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field v-if="verProyectos==0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="verProyectos" max-width="1000px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Seleccione un Proyecto</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field append-icon="search" 
                                        class="text-xs-center" v-model="texto"
                                        label="Ingrese proyecto a buscar" @keyup.enter="listarProyectos()">

                                        </v-text-field>
                                        <template>
                                            <v-data-table
                                                :headers="cabeceraProyectos"
                                                :items="proyectos"
                                                class="elevation-1"
                                            >
                                                <template slot="items" slot-scope="props">
                                                    <td class="justify-center layout px-0">
                                                        <v-icon
                                                        small
                                                        class="mr-2"
                                                        @click="mostrarPresupuesto(props.item)"
                                                        >
                                                        check
                                                        </v-icon>
                                                    </td>
                                                    <td>{{props.item.idproyecto }}</td>
                                                    <td>{{props.item.proyecto}}</td>
                                                    <td>{{props.item.producto}}</td>
                                                    <td>{{props.item.cliente}}</td>
                                                </template>
                                                <template slot="no-data">
                                                    <h3>No hay proyectos para mostrar.</h3>
                                                </template>
                                            </v-data-table> 
                                        </template>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-if="verProyectos==0" v-model="dialog" max-width="1000px">
                    <v-btn slot="activator" @click="ocultarPresupuesto()" color="primary" dark class="mb-2">Volver</v-btn>
                    <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>            
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs6 sm6 md6>
                                        <v-text-field v-model="idproyecto" readonly label="#Proyecto">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 sm6 md6>
                                        <v-text-field v-model="proyecto" readonly label="Proyecto">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 sm6 md6>
                                        <v-select v-model="iditem"
                                        @change="selectSubitem(item.iditem)"                                        
                                        :items = "items" label = "Item">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs6 sm6 md6>
                                        <v-select v-model="idsubitem"
                                        :items = "subitems" label = "Subitem">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs3 sm3 md3>
                                        <v-text-field type="number" v-model="importe" label="Importe">
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
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar item presupuestario?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar item presupuestario?</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el item presupuestario {{ adNombre }}
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
            <v-data-table v-if="verProyectos==0"
                :headers="headers"
                :items="presupuestos"
                :search="search"
                class="elevation-1"
                >
                <v-btn @click="salirDetalle()"><v-icon>keyboard_return</v-icon></v-btn>

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
                    <td>{{ props.item.idproyecto }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.itemes }}</td>
                    <td>{{ props.item.subitemes }}</td>
                    <td>{{ props.item.importe }}</td>
                    <td>{{ props.item.origen }}</td>
                    <td>{{ props.item.iduseralta }}</td>
                    <td>{{ props.item.fecalta }}</td>
                    <td>{{ props.item.iduserumod }}</td>
                    <td>{{ props.item.fecumod }}</td>
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
    import autoTable from 'jspdf-autotable'
    export default {
        data: () => {
            return {
                idproyectoMaster:'',
                presupuestos:[],
                items:[],
                subitems:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'idproyecto', sortable: true },
                    { text: 'Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Item', value: 'itemes', sortable: true },
                    { text: 'Subitem', value: 'subitemes', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Origen', value: 'origen', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                cabeceraProyectos: [
                    {text: 'Seleccionar', value: 'seleccionar', sortable: false },
                    { text: '#Proyecto', value: 'idproyecto'},
                    { text: 'Proyecto', value: 'proyecto' },
                    { text: 'Producto', value: 'producto' },
                    { text: 'Cliente', value: 'cliente' }
                ],              
                proyectos:[],
                texto:'',                                  
                search: '',
                editedIndex: -1,
                idpresupuesto:'',
                idproyecto:'',
                proyecto:'',
                iditem:'',
                itemes:'',
                itemen:'',
                idsubitem:'',
                subitemes:'',
                subitemen:'',
                importe:0,
                origen:'',
                iduseralta:'',
                fecalta:'',
                iduserumod:'',
                fecumod:'',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                verProyectos:1,
                verPresupuesto:0
             }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo item presupuestario' : 'Actualizar item presupuestario'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
        },

        created () {
            this.listarMaster();
            this.select();
        },
        methods:{
            listarMaster(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Proyectos/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.proyectos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            }, 
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Presupuestos/ListarProyecto/'+this.idproyectoMaster,configuracion).then(function(response){
                    console.log(response);
                    me.presupuestos=response.data;
                }).catch(function(error){
                    console.log(error);
                });               
            },
            listarProyectos(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                let url='';
                if (me.texto){
                    url = 'api/Proyectos/ListarFiltro/'+me.texto
                } else {
                    url = 'api/Proyectos/Listar'
                };
                axios.get(url,configuracion).then(function(response){
                    //console.log(response);
                    me.proyectos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            mostrarPresupuesto(item){
                this.idproyectoMaster=item.idproyecto;
                this.verProyectos=0;
                this.verPresupuesto=1;
                this.listar();
            },
            ocultarPresupuesto(){
                this.verPresupuesto=0;
                this.verProyectos=1;
                limpiar();
            },
            select(){
                let me=this;
                var proyectosArray=[];
                var itemsArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Proyectos/Select',configuracion).then(function(response){
                    //console.log(response);
                    proyectosArray=response.data;
                    proyectosArray.map(function(x){
                        me.proyectos.push({text: x.proyecto,value:x.idproyecto});
                    });
                }).catch(function(error){
                    console.log(error);
                });
                axios.get('api/Items/Select',configuracion).then(function(response){
                    //console.log(response);
                    itemsArray=response.data;
                    itemsArray.map(function(x){
                        me.items.push({text: x.itemes + "/" + x.itemen,value:x.iditem});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            selectSubitems(item){
                let me=this;
                var subitemsArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Subitem/Select/'+item,configuracion).then(function(response){
                    //console.log(response);
                    subitemsArray=response.data;
                    subitemsArray.map(function(x){
                        me.subitems.push({text: x.subitemes+'/'+x.subitemen,value:x.idsubitem});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.idpresupuesto = item.idpresupuesto;
                this.idproyecto = item.idproyecto;
                this.proyecto = item.proyecto;
                this.iditem = item.iditem;
                this.idsubitem = item.idsubitem;
                this.importe = item.importe;
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
                this.idpresupuesto = '';
                this.idproyecto = '';
                this.iditem = '';
                this.idsubitem = '';
                this.importe = '';
                this.origen = '';
                this.iduseralta = '';
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.subitems = [];
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
                    axios.put('api/Presupuestos/Actualizar',{
                        'idpresupuesto': me.idpresupuesto,
                        'idproyecto': me.idproyectoMaster,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'importe': me.importe,
                        'origen': 'App',
                        'iduseralta': me.iduseralta,
                        'fecalta': me.fecalta,
                        'iduserumod': me.$store.state.usuario.idusuario,
                        'fecumod': new Date().toISOString()
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
                    axios.post('api/Presupuestos/Crear',{
                        'idproyecto': me.idproyectoMaster,
                        'iditem': me.iditem,
                        'idsubitem': me.idsubitem,
                        'importe': me.importe,
                        'origen': 'App',
                        'iduseralta': me.iduseralta,
                        'fecalta': me.fecalta,
                        'iduseralta': me.$store.state.usuario.idusuario,
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

                if (!this.idproyecto){
                    this.validaMensaje.push("Ingrese un proyecto.");
                }
                if (!this.iditem){
                    this.validaMensaje.push("Ingrese un item.");
                }
                if (!this.importe){
                    this.validaMensaje.push("Ingrese un importe.");
                }
                if (this.importe<0){
                    this.validaMensaje.push("Ingrese un importe positivo.");
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.itemes + " " + item.subitemes;
                this.adId=item.idpresupuesto;                
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
                axios.put('api/Presupuestos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Presupuestos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
