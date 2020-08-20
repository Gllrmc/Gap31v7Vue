<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Subrubros</v-toolbar-title>
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
                            <v-flex xs2 sm2 md2>
                                <v-text-field v-model="orden" label="Orden">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs10 sm10 md10>
                                <v-select v-model="idrubro"
                                :items="rubros" label="Rubros">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="subrubroes" label="Subrubro(ES)"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="subrubroen" label="Subrubro(EN)"></v-text-field>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="vivo" v-model="vivo">
                                <label for = "vivo"> Es Vivo?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="post" v-model="post">
                                <label for = "post"> Es Post?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <input type="checkbox" id="conf" v-model="conf">
                                <label for = "conf"> Es Confidencial?</label>
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                                <v-text-field type="number" v-model="numhoja" label="#Hoja">
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
                :items="subrubros"
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
                    <td>{{ props.item.orden }}</td>
                    <td>{{ props.item.subrubroes }}</td>
                    <td>{{ props.item.rubroorden }}</td>
                    <td>{{ props.item.rubroes }}</td>
                    <td>{{ props.item.numhoja }}</td>
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
                        <div v-if="props.item.conf">
                            <span class="blue--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="red--text">No</span>
                        </div>
                    </td>
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
                rubros:[],
                subrubros:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Orden', value: 'orden' },
                    { text: 'Subrubro (ES)', value: 'subrubroes' },
                    { text: '#Rubro', value: 'rubroorden' },
                    { text: 'Rubro (ES)', value: 'rubroes' },
                    { text: '#Hoja', value: 'numhoja' },
                    { text: 'Es Vivo?', value: 'vivo' },
                    { text: 'Es Post?', value: 'post' },
                    { text: 'Es Conf?', value: 'conf' },
                    { text: 'Estado', value: 'activo', sortable: false  }                
                ],
                search: '',
                editedIndex: -1,
                id: '',
                // Inicializar variables Lookup
                idrubro:'',
                rubroorden:'',
                orden: '',
                subrubroes: '',
                subrubroen: '',
                numhoja: '',
                vivo:false,
                post:false,
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
                return this.editedIndex === -1 ? 'Nuevo subrubro' : 'Actualizar subrurbro'
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
                    {title: "Orden", dataKey: "orden"},
                    {title: "Rubro", dataKey: "idrubro"}, 
                    {title: "Subrubroes", dataKey: "subrubroes"},
                    {title: "Subrubroen", dataKey: "subrubroen"}, 
                    {title: "#Hoja", dataKey: "numhoja"}
                ];
                var rows = [];

                this.subrubros.map(function(x){
                    rows.push({orden:x.orden,idrubro:x.idrubro,subrubroes:x.subrubroes,subrubroen:x.subrubroen,numhoja:x.numhoja});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Subrubros", 40, 30);
                    }
                });
                doc.save('Subrubros.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                // console.log(configuracion);
                axios.get('api/Subrubros/Listar',configuracion).then(function(response){
                    // console.log(response);
                    me.subrubros=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            select(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                var rubrosArray=[];
                axios.get('api/Rubros/Select',configuracion).then(function(response){
                    rubrosArray=response.data;
                    rubrosArray.map(function(x){
                        me.rubros.push({text: x.orden + ': ' + x.rubroes, value: x.idrubro });
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            editItem (item) {
                this.idsubrubro=item.idsubrubro;
                this.idrubro=item.idrubro;
                this.subrubroes=item.subrubroes;
                this.subrubroen=item.subrubroen;
                this.numhoja=item.numhoja;
                this.vivo=item.vivo;
                this.post=item.post;
                this.conf=item.conf;
                this.orden=item.orden;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idsubrubro="";
                this.idrubro="";
                this.subrubroes="";
                this.subrubroen="";
                this.orden="";
                this.numhoja="";
                this.vivo=false;
                this.post=false;
                this.conf=false;
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
                    axios.put('api/Subrubros/Actualizar',{
                        'idsubrubro':me.idsubrubro,
                        'idrubro':me.idrubro,
                        'orden':me.orden,
                        'subrubroes': me.subrubroes,
                        'subrubroen':me.subrubroen,
                        'numhoja':me.numhoja,
                        'post':me.post,
                        'conf':me.conf,
                        'vivo':me.vivo
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
                    axios.post('api/Subrubros/Crear',{
                        'idrubro':me.idrubro,
                        'orden':me.orden,
                        'subrubroes': me.subrubroes,
                        'subrubroen':me.subrubroen,
                        'numhoja':me.numhoja,
                        'post':me.post,
                        'conf':me.conf,
                        'vivo':me.vivo
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

                if (this.subrubroes.length<3 || this.subrubroes.length>50){
                    this.validaMensaje.push("El subrubro(ES) debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (this.subrubroen.length<3 || this.subrubroen.length>50){
                    this.validaMensaje.push("El subrubro(EN) debe tener más de 3 caracteres y menos de 50 caracteres.");
                }                
                if (!this.idrubro){
                    this.validaMensaje.push("Seleccione un rubro.");
                }
                if (!this.numhoja || this.numhoja==0){
                    this.validaMensaje.push("Ingrese el numero de hoja.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.subrubroes;
                this.adId=item.idsubrubro;                
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
                axios.put('api/Subrubros/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Subrubros/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
