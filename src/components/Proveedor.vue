<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>Proveedores</v-toolbar-title>
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
                            <v-flex xs10 sm10 md10>
                                <v-text-field v-model="razonsocial" label="Razon social">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs2 sm2 md2>
                                <input type="checkbox" id="generico" v-model="generico">
                                <label for = "generico"> Generico?</label>
                            </v-flex>                            
                            <v-flex xs5 sm5 md5>
                                <v-select v-model="situacioniva"
                                :items = "situacionesiva" label = "IVA">
                                </v-select>
                            </v-flex>
                            <v-flex xs2 sm2 md2>
                                <v-select v-model="tipocomprobantegenerico"
                                :items = "tipocomprobantes" label = "Cbte.Generico"
                                :disabled="!generico">
                                </v-select>
                            </v-flex>                              
                            <v-flex xs5 sm5 md5>
                                <v-text-field v-model="cuit" label="CUIT"
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="situacioniibb"
                                :items = "situacionesiibb" @change="validarJurisdiccion()"  label = "IIBB"
                                :disabled="generico">
                                </v-select>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="jurisdiccion"
                                :items = "jurisdicciones" 
                                :disabled="!esMl" 
                                label = "Jurisdicción">
                                </v-select>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-text-field v-model="email" label="eMail"
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-text-field v-model="telefono" label="Telefono"
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="direccion" label="Dirección"
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="localidad" label="Localidad"
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="cpostal" label="C.P."
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-select v-model="idprovincia"
                                :items = "provincias" label = "Provincia"
                                :disabled="generico">
                                </v-select>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-select v-model="idpais"
                                :items = "paises" label = "País" @change="selectCuit()"
                                :disabled="generico">
                                </v-select>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                                <v-text-field v-model="formadepago" label="Forma de Pago"
                                :disabled="generico">
                                </v-text-field>
                            </v-flex>                                
                            <v-flex xs4 sm4 md4>
                                <v-select v-model="idpersona" clearable
                                :items = "personas" label = "Contacto"
                                :disabled="generico">
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
            <v-dialog v-model="dialogAp" max-width="1100px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Alternativas de Pago Proveedor #{{idproveedor}}: {{proveedor}} </span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogApForm" max-width="750px">
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitleAp }}</span>
                                </v-card-title>            
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="orden" label="Orden">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs7 sm7 md7>
                                            <v-text-field v-model="beneficiario" label="Beneficiario">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs3 sm3 md3>
                                            <v-text-field v-model="cuitcuil" label="CUIT/CUIL">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs5 sm5 md5>
                                            <v-text-field v-model="banco" label="Banco">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="tipocuenta" label="Tipo">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs5 sm5 md5>
                                            <v-text-field v-model="numcuenta" label="#Cuenta">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs6 sm6 md6>
                                            <v-text-field v-model="cbu" label="CBU">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs6 sm6 md6>
                                            <v-text-field v-model="alias" label="Alias">
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
                                    <v-btn color="blue darken-1" flat @click.native="closeApForm">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="guardarAp">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>                            
                        <v-dialog v-model="adModalAp" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Alternativa Pago?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Alternativa Pago?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccionAp==1">Activar </span>
                                    <span v-if="adAccionAp==2">Desactivar </span>
                                    la Alternativa de Pago {{ adNombreAp }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrarAp">
                                        Cancelar
                                    </v-btn>
                                    <v-btn v-if="adAccionAp==1" color="orange darken-4" flat="flat" @click="activarAp">
                                        Activar
                                    </v-btn>
                                    <v-btn v-if="adAccionAp==2" color="orange darken-4" flat="flat" @click="desactivarAp">
                                        Desactivar
                                    </v-btn>
                                </v-card-actions> 
                            </v-card>
                        </v-dialog>                
                        <v-data-table
                            :headers="headersDetalle"
                            :items="alternativapagos"
                            class="elevation-1"
                            >
                            <template slot="items" slot-scope="props">
                                <td class="justify-center layout px-20">
                                    <v-icon
                                    small
                                    class="mr-2"
                                    @click="editDetailItem(props.item)"
                                    >
                                    edit
                                    </v-icon>
                                    <template>
                                        <template v-if="props.item.activo">
                                            <v-icon
                                            small
                                            @click="activarDesactivarMostrarAp(2,props.item)"
                                            >
                                            block
                                            </v-icon>
                                        </template>
                                        <template v-else>
                                            <v-icon
                                            small
                                            @click="activarDesactivarMostrarAp(1,props.item)"
                                            >
                                            check
                                            </v-icon>
                                        </template>
                                    </template>
                                </td>
                                <td>{{ props.item.orden }}</td>
                                <td>{{ props.item.beneficiario }}</td>
                                <td>{{ props.item.banco }}</td>
                                <td>{{ props.item.cuitcuil }}</td>
                                <td>{{ props.item.tipocuenta }}</td>
                                <td>{{ props.item.numcuenta }}</td>
                                <td>{{ props.item.cbu }}</td>
                                <td>{{ props.alias }}</td>
                                <td class="justify-center ">
                                    <div v-if="props.item.activo">
                                        <span class="blue--text">Activo</span>
                                    </div>
                                    <div v-else>
                                        <span class="red--text">Inactivo</span>
                                    </div>
                                </td>
                                <td class="text-xs-center">{{ props.item.iduseralta }}</td>
                                <td>{{ props.item.fecalta.substr(0, 16) }}</td>
                                <td class="text-xs-center">{{ props.item.iduserumod }}</td>
                                <td>{{ props.item.fecumod.substr(0, 16) }}</td>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark class="mb-2" @click.native="createDetailAp">Nuevo</v-btn>
                        <v-btn color="success" dark class="mb-2" @click.native="closeDetailAp">Salir</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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
                        <v-icon v-if="props.item.activo"
                        small
                        class="mr-2"
                        @click="editAlternativapago(props.item)"
                        >
                        tab
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
                        <div v-if="props.item.generico">
                            <span class="red--text">Si</span>
                        </div>
                        <div v-else>
                            <span class="blue--text">No</span>
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
                proveedores:[],
                paises: [],
                provincias: [],
                personas:[],
                alternativapagos:[],               
                dialog: false,
                dialogAp: false,
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
                    { text: 'Generico', value: 'generico', sortable: true },
                    { text: 'Cbte.Generico', value: 'tipocomprobantegenerico', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Orden', value: 'orden', sortable: true },
                    { text: 'Beneficiario', value: 'beneficiario', sortable: true },
                    { text: 'Banco', value: 'banco', sortable: true },
                    { text: 'CUIT/CUIL', value: 'cuitcuil', sortable: true },
                    { text: 'Tipo', value: 'tipocuenta', sortable: true },
                    { text: '#Cuenta', value: 'numcuenta', sortable: true },
                    { text: 'CBU', value: 'cbu', sortable: true },
                    { text: 'Alias', value: 'alias', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  },                                    
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],
                tipocomprobantes: [
                    {value: '01', text: 'Fc A'},
                    {value: '02', text: 'Fc B'},
                    {value: '03', text: 'Tk A'},
                    {value: '04', text: 'Tk B'},
                    {value: '05', text: 'Fc C'},
                    {value: '06', text: 'Fc M'},
                    {value: '07', text: 'Otro'}
                ],                              
                search: '',
                editedIndex: -1,
                editedIndexAp: -1,
                idpersona: '',
                idpais:'',
                idprovincia:'',
                idproveedor:'',
                proveedor:'',
                razonsocial: '',
                generico: false,
                tipocomprobantegenerico: '',
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
                    // {value: '09', text: 'Cliente del Exterior'},
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
                formadepago: '',
                idpersona:'',
                //Detail Alternativas Pago
                idalternativapago: '',
                orden: '',
                beneficiario: '',
                banco: '',
                cuitcuil: '',
                tipocuenta: '',
                numcuenta: '',
                cbu: '',
                alias: '',
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                valida: 0,
                validaMensaje:[],
                esMl:false,
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adModalAp: 0,
                adAccionAp: 0,
                adNombreAp: 0,
                adId: '',
                dialogApForm: false           
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo proveedor' : 'Actualizar proveedor'
            },
            formTitleAp () {
                return this.editedIndexAp === -1 ? 'Nueva alternativa pago de ' + this.proveedor : 'Actualizar alternativa pago de ' + this.proveedor
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
            dialogApForm (val) {
            val || this.closeApForm()
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
                    {title: "IVA", dataKey: "situacioniva"},
                    {title: "IIBB", dataKey: "situacioniibb"},
                    {title: "Jurisdicción", dataKey: "jurisdiccion"},
                    {title: "eMail", dataKey: "email"}, 
                    {title: "Teléfono", dataKey: "telefono"}, 
                    {title: "Dirección", dataKey: "direccion"}, 
                    {title: "Localidad", dataKey: "localidad"},
                    {title: "C.P.", dataKey: "cpostal"}, 
                    {title: "Provincia", dataKey: "provincia"}, 
                    {title: "Pais", dataKey: "pais"}, 
                    {title: "Generico", dataKey: "generico"},                     
                    {title: "Activo", dataKey: "activo"}
                ];
                var rows = [];

                this.proveedores.map(function(x){
                    rows.push({razonsocial:x.razonsocial,generico:x.generico, cuit:x.cuit, situacioniva:x.situacioniva, email:x.email,
                    situacioniibb:x.situacioniibb, jurisdiccion:x.jurisdiccion,
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
				//console.log(configuracion);
                axios.get('api/Proveedores/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.proveedores=response.data;
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
                    paisesArray=response.data.sort((a, b) => (a.pais > b.pais) ? 1 : -1);
                    paisesArray.map(function(x){
                        me.paises.push({text: x.pais,value:x.idpais, cuit:x.cuit});
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
				axios.get('api/Personas/SelectContactoProveedor',configuracion).then(function(response){
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
                this.idproveedor=item.idproveedor;
                this.idprovincia=item.idprovincia;
                this.idpais=item.idpais;
                this.razonsocial=item.razonsocial;
                this.generico=item.generico;
                this.tipocomprobantegenerico=item.tipocomprobantegenerico;
                this.cuit=item.cuit;
                this.situacioniva=item.situacioniva;
                this.situacioniibb=item.situacioniibb;
                this.jurisdiccion=item.jurisdiccion;
                this.validarJurisdiccion();
                this.email=item.email;
                this.telefono=item.telefono;
                this.direccion=item.direccion;
                this.localidad=item.localidad;
                this.cpostal=item.cpostal;
                this.formadepago=item.formadepago;
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
                this.idproveedor="";
                this.idpais="";
                this.idprovincia="";
                this.razonsocial="";
                this.generico=false;
                this.tipocomprobantegenerico='';
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
                this.formadepago="";
                this.idpersona="";
                this.idpais="";
                this.idprovincia="";
                this.editedIndex=-1;
                this.validaMensaje = [];                
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
                    axios.put('api/Proveedores/Actualizar',{
                        'idproveedor': me.idproveedor,
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'razonsocial': me.razonsocial,
                        'generico':me.generico,
                        'tipocomprobantegenerico':me.tipocomprobantegenerico,
                        'cuit': me.cuit,
                        'situacioniva': me.situacioniva,
                        'situacioniibb': me.situacioniibb,
                        'jurisdiccion': me.jurisdiccion,
                        'email': me.email,
                        'telefono': me.telefono,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'formadepago': me.formadepago,
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
                    axios.post('api/Proveedores/Crear',{
                        'idpais': me.idpais,
                        'idprovincia': me.idprovincia,
                        'razonsocial': me.razonsocial,
                        'generico':me.generico,
                        'tipocomprobantegenerico':me.tipocomprobantegenerico,                        
                        'cuit': me.cuit,
                        'situacioniva': me.situacioniva,
                        'situacioniibb': me.situacioniibb,
                        'jurisdiccion': me.jurisdiccion,
                        'email': me.email,
                        'telefono': me.telefono,
                        'direccion': me.direccion,
                        'localidad': me.localidad,
                        'cpostal': me.cpostal,
                        'formadepago': me.formadepago,
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
            selectCuit(){
                var id = this.paises.findIndex(p => p.value === this.idpais);
                if (this.paises[id].text!="ARGENTINA"){
                    this.situacioniva='08';
                    this.cuit = this.paises[id].cuit;
                }
            },            
            validar(){
                this.valida=0;
                this.validaMensaje = [];
                if (this.razonsocial.length<3 || this.razonsocial.length>50){
                    this.validaMensaje.push("La razon social debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (!this.idpais && !this.generico ){
                    this.validaMensaje.push("Seleccione un país.");
                }
                if (!this.idprovincia && !this.generico ){
                    this.validaMensaje.push("Seleccione una provincia.");
                }
                if (!this.situacioniva){
                    this.validaMensaje.push("Seleccione una situacion IVA.");
                }
                if ((!this.situacioniva=='05'&&!this.situacioniva=='07')||!this.cuit && !this.generico){
                    this.validaMensaje.push("Ingrese un CUIT.");
                }
                if (!this.cuitValido(this.cuit) && !this.generico){
                    this.validaMensaje.push("Numero de CUIT duplicado.");
                }
                if ((!this.jurisdiccion && this.situacioniibb=='3') && !this.generico) {
                    this.validaMensaje.push("Seleccione una Jurisdicción.");
                }
                if (!this.tipocomprobantegenerico && this.generico ){
                    this.validaMensaje.push("Seleccione un Tipo de Cbte Generico.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            cuitValido(ref){
                let valido = 1;
                if (ref.substr(0,2)<'50'&&!(this.cuitoriginal==this.cuit)){
                    for (let i=0; i < this.proveedores.length; i++){
                        if (this.proveedores[i]["cuit"] === ref) {
                            valido = -1;
                            break;
                        }
                    }
                };
                return valido;
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
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
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
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            validarAp(){
                this.valida=0;
                this.validaMensaje = [];
                //console.log(this.orden)

                if (!this.orden){
                    this.validaMensaje.push("Ingrese un #Orden.");
                }
                if (this.beneficiario.length<3 || this.beneficiario.length>50){
                    this.validaMensaje.push("El beneficiario debe tener más de 3 caracteres y menos de 50 caracteres.");
                }
                if (!this.cuitcuil){
                    this.validaMensaje.push("Ingrese un CUIT/CUIL para hacer eTransfers.");
                }
                if (!this.cbu && !this.alias){
                    this.validaMensaje.push("Ingrese un CBU o un Alias para hacer eTransfers.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },

            activarDesactivarMostrarAp(accion,item){
                this.adModalAp=1;
                this.adNombreAp=item.beneficiario;
                this.adIdAp=item.idalternativapago;                
                if (accion==1){
                    this.adAccionAp=1;
                }
                else if (accion==2){
                    this.adAccionAp=2;
                }
                else{
                    this.adModalAp=0;
                }
            },
            activarDesactivarCerrarAp(){
                this.adModalAp=0;
            },
            activarAp(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Alternativapagos/Activar/'+this.adIdAp,{},configuracion).then(function(response){
                    me.adModalAp=0;
                    me.adAccionAp=0;
                    me.adNombreAp="";
                    me.adIdAp="";
                    me.listarDetail();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },
            desactivarAp(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Alternativapagos/Desactivar/'+this.adIdAp,{},configuracion).then(function(response){
                    me.adModalAp=0;
                    me.adAccionAp=0;
                    me.adNombreAp="";
                    me.adIdAp="";
                    me.listarDetail();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },            
            editAlternativapago(item){
                this.idproveedor = item.idproveedor;
                this.proveedor = item.razonsocial;
                this.listarDetail();
                this.dialogAp = true;
            },
            listarDetail(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				//console.log(configuracion);
                axios.get('api/Alternativapagos/ListarProveedor/'+this.idproveedor,configuracion).then(function(response){
                    // console.log(response);
                    me.alternativapagos=response.data;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });                
            },
            editDetailItem (item) {
                this.idalternativapago = item.idalternativapago;
                this.idproveedor = item.idproveedor;
                this.orden = item.orden;
                this.beneficiario = item.beneficiario;
                this.banco=item.banco;
                this.cuitcuil=item.cuitcuil;
                this.tipocuenta = item.tipocuenta;
                this.numcuenta = item.numcuenta;
                this.cbu = item.cbu;
                this.alias = item.alias;
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;
                this.editedIndexAp=1;
                this.dialogApForm = true
            },
            createDetailAp(){
                this.limpiarDetail();
                this.editedIndexAp=-1;
                this.dialogApForm = true;
            },          
            closeDetailAp () {
                this.dialogAp = false;
                this.limpiar();
            },
            closeApForm () {
                this.dialogApForm = false;
                this.validaMensaje = [];
                this.limpiarDetail();
            },
            limpiarDetail() {
                this.idalternativapago = '';
                this.orden = '';
                this.beneficiario = '';
                this.banco = '';
                this.cuitcuil = '';
                this.tipocuenta = '';
                this.numcuenta = '';
                this.cbu = '';
                this.alias = '';
                this.editedIndexAp=-1;
            },            
            guardarAp () {
                if (this.validarAp()){
                    return;
                }
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndexAp > -1) {
                    //Código para editar
                    //Código para guardar
                    let me=this;
                    // console.log(me);
                    axios.put('api/Alternativapagos/Actualizar',{
                        'idalternativapago': me.idalternativapago,
                        'idproveedor': me.idproveedor,
                        'orden': me.orden,
                        'beneficiario': me.beneficiario,
                        'banco': me.banco,
                        'cuitcuil': me.cuitcuil,
                        'tipocuenta': me.tipocuenta,
                        'numcuenta': me.numcuenta,
                        'cbu': me.cbu,
                        'alias': me.alias,
                        'iduseralta': me.iduseralta,
                        'fecalta': me.fecalta,
                        'iduserumod': me.$store.state.usuario.idusuario,
                        'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                    },configuracion).then(function(response){
                        me.closeApForm();
                        me.listarDetail();
                        me.limpiarDetail();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    console.log(me);
                    axios.post('api/Alternativapagos/Crear',{
                        'idproveedor': me.idproveedor,
                        'orden': me.orden,
                        'beneficiario': me.beneficiario,
                        'banco': me.banco,
                        'cuitcuil': me.cuitcuil,
                        'tipocuenta': me.tipocuenta,
                        'numcuenta': me.numcuenta,
                        'cbu': me.cbu,
                        'alias': me.alias,
                        'iduseralta': me.$store.state.usuario.idusuario
                    },configuracion).then(function(response){
                        me.closeApForm();
                        me.listarDetail();
                        me.limpiarDetail();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
            },
        }        
    }
</script>
