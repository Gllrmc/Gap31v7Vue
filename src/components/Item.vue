<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Items</v-toolbar-title>
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
                                    <v-select v-model="idsubrubro"
                                    :items="subrubros" label="Subrubros">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="itemes" label="Item(ES)"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="itemen" label="Item(EN)"></v-text-field>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <input type="radio" id="si" value="SI" v-model="tipoitem">
                                    <label for="si"> Simple</label>
                                    <br>
                                    <input type="radio" id="dd" value="DD" v-model="tipoitem">
                                    <label for="dd"> Day by Day</label>
                                </v-flex>
                                <v-flex xs2 sm2 md2>
                                    <input type="checkbox" id="chksubitems" v-model="tienesubitems">
                                    <label for = "chksubitems"> Subitems?</label>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-text-field v-model="cuentagcom" type="number" label="Cuenta GCOM">
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
                :items="items"
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
                    <td>{{ props.item.itemes }}</td>
                    <td>{{ props.item.subrubroen }}</td>
                    <td>{{ props.item.itemen }}</td>
                    <td>{{ props.item.tipoitem }}</td>
                    <td>
                        <div v-if="props.item.tienesubitems">
                            <span class="green--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
                        </div>
                    </td>
                    <td>{{ props.item.cuentagcom }}</td>
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
                items:[],
                subrubros:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Orden', value: 'orden' },
                    { text: 'Subrubro (ES)', value: 'subrubroes' },
                    { text: 'Item (ES)', value: 'itemes' },
                    { text: 'Subrubro (EN)', value: 'subrubroen' },
                    { text: 'Item (EN)', value: 'itemen' },
                    { text: 'Tipo Item', value: 'tipoitem' },
                    { text: 'Tiene Subitems?', value: 'tienesubitems' },
                    { text: 'Cuenta GCOM', value: 'cuentagcom' },
                    { text: 'Estado', value: 'activo', sortable: false  }                
                ],
                search: '',
                editedIndex: -1,
                id: '',
                // Inicializar variables Lookup
                idsubrubro:'',
                orden: '',
                subrubroes: '',
                itemes: '',
                subrubroen: '',
                itemen: '',
                tipoitem: 'SI',
                tienesubitems: false,
                cuentagcom: '',
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
                return this.editedIndex === -1 ? 'Nuevo item' : 'Actualizar item'
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
                    {title: "Subrubro", dataKey: "subrubroes"}, 
                    {title: "Itemes", dataKey: "itemes"},
                    {title: "Tipo Item", dataKey: "tipoitem"},
                    {title: "Tiene Subitems?", dataKey: "tienesubitems"},
                    {title: "Cuenta GCOM", dataKey: "cuentagcom"}
                ];
                var rows = [];

                this.items.map(function(x){
                    rows.push({orden:x.orden,subrubroes:x.subrubroes,itemes:x.itemes,tipoitem:x.tipoitem,tienesubitems:x.tienesubitems,cuentagcom:x.cuentagcom});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Items", 40, 30);
                    }
                });
                doc.save('Items.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                console.log(configuracion);
                axios.get('api/Items/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.items=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                var rubrosArray=[];
                axios.get('api/Subrubros/Select',configuracion).then(function(response){
                    //console.log(response);
                    rubrosArray=response.data;
                    rubrosArray.map(function(x){
                        me.subrubros.push({text: x.subrubroes+' / '+ x.subrubroen, value: x.idsubrubro });
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.iditem=item.iditem;
                this.idsubrubro=item.idsubrubro;
                this.itemes=item.itemes;
                this.itemen=item.itemen;
                this.tipoitem=item.tipoitem;
                this.tienesubitems=item.tienesubitems;
                this.cuentagcom=item.cuentagcom
                this.orden=item.orden;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.iditem="";
                this.idsubrubro="";
                this.itemes="";
                this.itemen="";
                this.orden="";
                this.tipoitem="";
                this.tienesubitems="";
                this.cuentagcom="";
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
                    axios.put('api/Items/Actualizar',{
                        'iditem':me.iditem,
                        'idsubrubro':me.idsubrubro,
                        'orden':me.orden,
                        'itemes': me.itemes,
                        'itemen':me.itemen,
                        'tipoitem':me.tipoitem,
                        'tienesubitems' :me.tienesubitems,
                        'cuentagcom' :me.cuentagcom
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
                    axios.post('api/Items/Crear',{
                        'idsubrubro':me.idsubrubro,
                        'orden':me.orden,
                        'itemes': me.itemes,
                        'itemen':me.itemen,
                        'tipoitem':me.tipoitem,
                        'tienesubitems' :me.tienesubitems,
                        'cuentagcom' :me.cuentagcom
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

                if (this.itemes.length<3 || this.itemes.length>50){
                    this.validaMensaje.push("El item(ES) debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (this.itemen.length<3 || this.itemen.length>50){
                    this.validaMensaje.push("El item(EN) debe tener más de 3 caracteres y menos de 50 caracteres.");
                }                
                if (!this.idsubrubro){
                    this.validaMensaje.push("Seleccione un subrubro.");
                }
                if (!this.tipoitem){
                    this.validaMensaje.push("Ingrese el tipo de item.");
                }
                if (this.cuentagcom.length>6){
                    this.validaMensaje.push("La cuenta gcom no debe sobrepasar los 6 caracteres.");
                }                
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.itemes;
                this.adId=item.iditem;                
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
                axios.put('api/Items/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Items/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
