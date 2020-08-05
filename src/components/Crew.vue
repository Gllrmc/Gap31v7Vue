<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Crews</v-toolbar-title>
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
                                <v-flex xs3 sm3 md3>
                                    <v-select v-model="idpersona"
                                    :items = "personas" label = "Crew">
                                    </v-select>
                                </v-flex>                                
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="cuil" label="CUIL">
                                    </v-text-field>
                                </v-flex>
                                <template>
                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="fecnacimiento"
                                        label="Fecha Nacimiento"
                                        prepend-icon="event"
                                        readonly
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                    ref="picker"
                                    v-model="fecnacimiento"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    min="1950-01-01"
                                    @change="save"
                                    ></v-date-picker>
                                </v-menu>
                                </template>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="nacionalidad" label="Nacionalidad">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="estudioscursados" label="Estudios Cursados">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs2 sm2 md2>
                                    <v-select v-model="estadocivil"
                                    :items = "estadocivils" label = "Estado Civil">
                                    </v-select>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="datosconyugue" label="Datos Cónyugue">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs1 sm1 md1>
                                    <v-text-field v-model="cantidadhijos" label="#Hijos">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="listammaanacimientohijos" label="<MMAA;> Nacimiento Hijos">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="sindicato" label="Sindicato">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="numafiliadosindicato" label="#Afiliado Sindicato">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="obrasocial" label="Obra Social">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                    <v-text-field v-model="numafiliadoobrasocial" label="#Afiliado Obra Social">
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
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Crew?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Crew?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Desactivar </span>
                                el crew {{ adNombre }}
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
                :items="crews"
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
                    <td>{{ props.item.cuil }}</td>
                    <td>{{ props.item.fecnacimiento.substr(0, 10) }}</td>
                    <td>{{ props.item.nacionalidad }}</td>
                    <td>{{ props.item.estudioscursados }}</td>
                    <td>{{ props.item.estadocivil }}</td>
                    <td>{{ props.item.datosconyugue }}</td>
                    <td>{{ props.item.cantidadhijos }}</td>
                    <td>{{ props.item.listammaanacimientohijos }}</td>
                    <td>{{ props.item.sindicato }}</td>
                    <td>{{ props.item.numafiliadosindicato }}</td>
                    <td>{{ props.item.obrasocial }}</td>
                    <td>{{ props.item.numafiliadoobrasocial }}</td>
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
                fecnacimiento: null,
                menu: false,
                off:false,
                crews:[],
                personas:[],               
                estadocivils:['Soltero/a','Casado/a','Separado/a','Divorciado/a','Viudo/a'],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: true },
                    { text: 'CUIL', value: 'cuil', sortable: true },
                    { text: 'FecNacimiento', value: 'fecnacimiento', sortable: true },
                    { text: 'Nacionalidad', value: 'nacionalidad', sortable: true  },
                    { text: 'Estudios Cursados', value: 'estudioscursados', sortable: true  },
                    { text: 'Estado Civil', value: 'estadocivil', sortable: true },
                    { text: 'Datos Conyugue', value: 'datosconyugue', sortable: true },
                    { text: '#Hijos', value: 'cantidadhijos', sortable: true },
                    { text: 'MMAA; Nac.Hijos', value: 'listammaanacimientohijos', sortable: true  },
                    { text: 'Sindicato', value: 'sindicato', sortable: true  },
                    { text: '#Afiliado Sindicato', value: 'numafiliadosindicato', sortable: true  },
                    { text: 'Obra Social', value: 'obrasocial', sortable: true  },
                    { text: '#Afiliado Obra Social', value: 'numafiliadoobrasocial', sortable: true  },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                search: '',
                editedIndex: -1,
                idcrew: '',
                idpersona: '',
                cuil:'',
                nacionalidad:'',
                estudioscursados:'',
                estadocivil:'',
                datosconyugue:'',
                cantidadhijos:0,
                listammaanacimientohijos:'',
                sindicato:'',
                numafiliadosindicato:'',
                obrasocial:'',
                numafiliadoobrasocial:'',
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
                return this.editedIndex === -1 ? 'Nuevo crew' : 'Actualizar crew'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
            menu (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
            }
        },

        created () {
            this.listar();
            this.select();
        },
        methods:{
            save (date) {
                    this.$refs.menu.save(date)
                },
            crearPDF(){
                var columns = [
                    {title: "Nombre", dataKey: "nombre"},
                    {title: "CUIL", dataKey: "cuil"},
                    {title: "FecNacimiento", dataKey: "fecnacimiento"},
                    {title: "Nacionalidad", dataKey: "nacionalidad"}, 
                    {title: "Estado Civil", dataKey: "estadocivil"}, 
                    {title: "Sindicato", dataKey: "sindicato"}, 
                    {title: "#Afiliado", dataKey: "numafiliadosindicato"},
                    {title: "Obrasocial", dataKey: "obrasocial"}, 
                    {title: "#Afiliado", dataKey: "numafiliadoobrasocial"}, 
                    {title: "Activo", dataKey: "activo"}
                ];
                var rows = [];

                this.crews.map(function(x){
                    rows.push({nombre:x.nombre,cuil:x.cuil, fecnacimiento:x.fecnacimiento, nacionalidad:x.nacionalidad,
                    estadocivil:x.estadocivil, sindicato:x.sindicato,numafiliadosindicato:x.numafiliadosindicato,obrasocial:x.obrasocial,
                    numafiliadoobrasocial:x.numafiliadoobrasocial, activo:x.activo});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('l', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Crews", 40, 30);
                    }
                });
                doc.save('Crews.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				console.log(configuracion);
                axios.get('api/Crews/Listar',configuracion).then(function(response){
                    console.log(response);
                    me.crews=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me=this;
                var personasArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Personas/SelectContactoCrew',configuracion).then(function(response){
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
                this.idcrew = item.idcrew;
                this.idpersona = item.idpersona;
                this.cuil = item.cuil;
                this.fecnacimiento = item.fecnacimiento.substr(0, 10);
                this.nacionalidad = item.nacionalidad;
                this.estudioscursados = item.estudioscursados;
                this.estadocivil = item.estadocivil;
                this.datosconyugue = item.datosconyugue;
                this.cantidadhijos = item.cantidadhijos;
                this.listammaanacimientohijos = item.listammaanacimientohijos;
                this.sindicato = item.sindicato;
                this.numafiliadosindicato = item.numafiliadosindicato;
                this.obrasocial = item.obrasocial;
                this.numafiliadoobrasocial = item.numafiliadoobrasocial;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.idcrew="";
                this.idpersona="";
                this.cuil="";
                this.fecnacimiento="";
                this.nacionalidad="";
                this.estudioscursados="";
                this.estadocivil="";
                this.datosconyugue="";
                this.cantidadhijos=0;
                this.listammaanacimientohijos="";
                this.sindicato="";
                this.numafiliadosindicato="";
                this.obrasocial="";
                this.numafiliadoobrasocial="";
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
                    axios.put('api/Crews/Actualizar',{
                        'idcrew': me.idcrew,
                        'idpersona':me.idpersona,
                        'cuil':me.cuil,
                        'fecnacimiento':me.fecnacimiento,
                        'nacionalidad':me.nacionalidad,
                        'estudioscursados':me.estudioscursados,
                        'estadocivil':me.estadocivil,
                        'datosconyugue':me.datosconyugue,
                        'cantidadhijos':me.cantidadhijos,
                        'listammaanacimientohijos':me.listammaanacimientohijos,
                        'sindicato':me.sindicato,
                        'numafiliadosindicato':me.numafiliadosindicato,
                        'obrasocial':me.obrasocial,
                        'numafiliadoobrasocial':me.numafiliadoobrasocial
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
                    axios.post('api/Crews/Crear',{
                        'idpersona':me.idpersona,
                        'cuil':me.cuil,
                        'fecnacimiento':me.fecnacimiento,
                        'nacionalidad':me.nacionalidad,
                        'estudioscursados':me.estudioscursados,
                        'estadocivil':me.estadocivil,
                        'datosconyugue':me.datosconyugue,
                        'cantidadhijos':me.cantidadhijos,
                        'listammaanacimientohijos':me.listammaanacimientohijos,
                        'sindicato':me.sindicato,
                        'numafiliadosindicato':me.numafiliadosindicato,
                        'obrasocial':me.obrasocial,
                        'numafiliadoobrasocial':me.numafiliadoobrasocial
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

                if (this.nacionalidad.length<3 || this.nacionalidad.length>50){
                    this.validaMensaje.push("La nacionalidad debe tener más de 3 caracteres y menos de 20 caracteres.");
                }
                if (!this.cuil){
                    this.validaMensaje.push("Ingrese un CUIL.");
                }
                if (!this.fecnacimiento){
                    this.validaMensaje.push("Ingrese fecha de nacimiento.");
                }
                if (!this.estadocivil){
                    this.validaMensaje.push("Ingrese estado civil.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId=item.idcrew;                
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
                axios.put('api/Crews/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Crews/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
