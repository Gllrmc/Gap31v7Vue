<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Actividades DxD Shooting - Proyectos</v-toolbar-title>
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
            </v-toolbar>
            <v-dialog v-model="dialog" max-width="1600px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Staff del Proyecto #{{this.orden}}: {{this.proyecto}} </span>
                    </v-card-title>            
                    <v-card-text>
                        <v-dialog v-model="dialogForm" max-width="1000px">
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>            
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs10 sm10 md10>
                                            <v-select v-model="idrecursodxd"
                                            :items = "recursos" label = "Staff"
                                            @change="asignarminmax(idrecursodxd)"
                                            >
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-select v-model="horasbase"
                                            :items = "horasbases" label = "Hs.Base">
                                            </v-select>
                                        </v-flex>
                                        <template>
                                            <v-flex xs2 sm2 md2>
                                                <v-menu
                                                    v-model="menu1"
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
                                                            v-model="fdesde"
                                                            label="Fecha Desde"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                            @change="fhasta=fdesde"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fdesde" 
                                                        locale="es"
                                                        @input="menu1 = false"
                                                        :min = "fdmin"
                                                        :max = "fdmax">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>   
                                        <template>
                                            <v-flex xs2 sm2 md2>
                                                <v-menu
                                                    ref="menud"
                                                    v-model="menu1t"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="tdesde"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        v-model="tdesde"
                                                        label="Hora Desde"
                                                        prepend-icon="access_time"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        v-if="menu1t"
                                                        v-model="tdesde"
                                                        format="24hr"
                                                        full-width
                                                        :allowed-minutes="allowedStep"
                                                        @click:minute="$refs.menud.save(tdesde)"
                                                    ></v-time-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
                                        <template>
                                            <v-flex xs2 sm2 md2>
                                                <v-menu
                                                    v-model="menu2"
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
                                                            v-model="fhasta"
                                                            label="Fecha Hasta"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fhasta" 
                                                        :min = "fdesde"
                                                        :max = "tomorrow"
                                                        locale="es"
                                                        @input="menu2 = false">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>   
                                        <template>
                                            <v-flex xs2 sm2 md2>
                                                <v-menu
                                                    ref="menuh"
                                                    v-model="menu2t"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="thasta"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        v-model="thasta"
                                                        label="Hora Hasta"
                                                        prepend-icon="access_time"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                    v-if="menu2t"
                                                    v-model="thasta"
                                                    format="24hr"
                                                    full-width
                                                    :allowed-minutes="allowedStep"
                                                    @click:minute="$refs.menuh.save(thasta)"
                                                    ></v-time-picker>
                                                </v-menu>
                                            </v-flex>
                                        </template>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impadicional"
                                                prefix="$" 
                                                label="Importe Adicional"
                                                type="number"
                                                >
                                            </v-text-field>    
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <input type="checkbox" id="controlsica" 
                                            v-model="controlsica"
                                            disabled>
                                            <label for = "controlsica"> Ctrl SICA?</label>
                                        </v-flex>                                  
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="horasenganche"
                                                prefix="#"
                                                label="Hs.Enganche"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                                                                                                                                            
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="horasextra"
                                                prefix="#"
                                                label="Hs.Extra"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>               
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="horasnocturna"
                                                prefix="#"
                                                label="Hs.Nocturna"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <input type="checkbox" id="septimodia" v-model="septimodia">
                                            <label for = "septimodia"> 7mo día?</label>
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impextra"
                                                prefix="$"
                                                label="Importe Extra"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                                                                                      
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="imptotalbruto"
                                                prefix="$"
                                                label="Importe Bruto"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impsac"
                                                prefix="$"
                                                label="SAC"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                                                                                      
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impretenciones"
                                                prefix="$"
                                                label="Retenciones"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impvacaciones"
                                                prefix="$"
                                                label="Vacaciones"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                                                                                      
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impsacvacaciones"
                                                prefix="$"
                                                label="SAC/Vac"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="imptotalneto"
                                                prefix="$"
                                                label="Importe Neto"
                                                type="number"
                                                disabled
                                                >
                                            </v-text-field>    
                                        </v-flex>                                                                                      
                                        <v-flex xs2 sm2 md2>
                                            <v-text-field v-model="impcontribucionpatronal"
                                                prefix="$"
                                                label="Aportes"
                                                type="number"
                                                disabled
                                                >
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
                                    <v-btn color="blue darken-1" flat @click.native="closeForm()">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="calcularDerivados()">Calcular</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="guardar()">Guardar</v-btn>
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
                                    la asignación del Crew {{ adNombre }}
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
                        <v-data-table
                        :headers="headersDetalle"
                        :items="realdxds"
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
                                <td class="text-xs-center">{{ props.item.itemorden }}</td>
                                <td>{{ props.item.itemes }}</td>
                                <td class="text-xs-center">{{ props.item.subitemorden }}</td>
                                <td>{{ props.item.subitemes }}</td>
                                <td class="text-xs-center">{{ props.item.cuil }}</td>
                                <td>{{ props.item.nombre }}</td>
                                <td>{{ props.item.horasbase }}</td>
                                <td class="text-xs-center">{{ props.item.dtdesde}}</td>
                                <td class="text-xs-center">{{ props.item.dthasta}}</td>
                                <td>{{ props.item.controlsica }}</td>
                                <td>{{ props.item.horasnormal }}</td>
                                <td>{{ props.item.horasextra }}</td>                                                                        
                                <td>{{ props.item.horasnocturna }}</td>
                                <td>{{ props.item.horasenganche }}</td>                                    
                                <td class="justify-center layout px-0">
                                    <div v-if="props.item.septimodia">
                                        <span class="red--text">Si</span>
                                    </div>
                                    <div v-else>
                                        <span class="blue--text">No</span>
                                    </div>
                                </td>                                
                                <td>{{ props.item.bolobruto }}</td>
                                <td>{{ props.item.boloneto }}</td>                                    
                                <td>{{ props.item.valhoraextra }}</td>                                    
                                <td>{{ props.item.impextra }}</td>
                                <td>{{ props.item.impadicional }}</td>
                                <td>{{ props.item.imptotalbruto }}</td>
                                <td>{{ props.item.impsac }}</td>
                                <td>{{ props.item.impvacaciones }}</td>
                                <td>{{ props.item.impsacvacaciones }}</td>
                                <td>{{ props.item.impretenciones }}</td>                                    
                                <td>{{ props.item.imptotalneto }}</td>
                                <td>{{ props.item.impcontribucionpatronal }}</td>
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
                            <template v-slot:no-data>
                                <v-alert :value="true" color="warning" icon="warning">
                                    NADA PARA MOSTRAR :(
                                </v-alert>
                            </template>
                        </v-data-table>                
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark class="mb-2" @click.native="createDetail">Nuevo</v-btn>
                        <v-btn color="success" dark class="mb-2" @click.native="closeDetail">Salir</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-data-table
                :headers="headers"
                :items="proyectos"
                :search="search"
                class="elevation-1"
                >
                <template v-if="!props.item.cierreprod" slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editMasterItem(props.item)"
                        >
                        tab
                        </v-icon>
                    </td>
                    <td class="text-xs-center"> {{ props.item.orden }}</td>
                    <td>{{ props.item.proyecto }}</td>
                    <td>{{ props.item.tipoprod }}</td>
                    <td>{{ props.item.fecadjudicacion.substr(0, 10) }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listarMaster">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import moment from 'moment'    
    export default {
        data: () => {
            return {
                actdesde:'',
                acthasta:'',
                diaanterior:'',
                mineq:[],
                allActivity:[],
                fdmin: '',
                fdmax: '',
                configs:[],
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                fecdesde: null,
                fechasta: null,
                menu1: false,
                menu1t: false,                    
                menu2: false,
                menu2t: false,
                horasbases: [
                    {value: '8', text: '8 Hs'},
                    {value: '12', text: '12 Hs'}
                ],
                proyectos:[],
                recursos: [],
                realdxds:[],
                tarifadxds:[],

                // Master
                idproyecto: '',
                orden: '',
                proyecto: '',
                producto: '',
                fecadjudicacion: '',
                ars1usd: '',
                // Detail    
                idrealdxd:'',
                idrecursodxd: '',
                iditem: '',
                horasbase: '',
                dtdesde: '',
                fdesde: '',
                tdesde: '',
                fhasta: '',
                dthasta: '',
                thasta: '',
                dtsalidaayer: '',
                dtinicionocturna: '',
                controlsica: false,
                septimodia: false,
                horasenganche: 0,
                horasreal: 0,
                horasequivalente: 0,
                horasnormal: 0,
                horasextra: 0,
                horasnocturna: 0,
                bolobruto: 0,
                boloneto: 0,
                valhoraextra: 0,
                impextra: 0,
                impadicional: 0,
                imptotalbruto: 0,
                impsac: 0,
                impvacaciones: 0,
                impretenciones: 0,
                impsacvacaciones: 0,
                imptotalneto: 0,
                impcontribucionpatronal: 0, 
                iduseralta: '',
                fecalta: '',
                iduserumod: '',
                fecumod: '',
                activo: '',
                dialog: false,
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Proyecto', value: 'orden', sortable: true },
                    { text: 'Nombre del Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Tipo de producción', value: 'tipoprod', sortable: true },
                    { text: 'Fecha Adjudicación', value: 'fecadjudicacion', sortable: true }   
                ],
                headersDetalle: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: '#Item', value: 'ordenitem', sortable: true },
                    { text: 'Detalle Item', value: 'itemes', sortable: true },
                    { text: '#Subitem', value: 'ordensubitem', sortable: true },
                    { text: 'Subitem', value: 'subitemes', sortable: true },
                    { text: 'CUIL', value: 'cuil', sortable: true },
                    { text: 'Nombre Completo', value: 'nombre', sortable: true },
                    { text: 'Base', value: 'horasbase'},
                    { text: 'Fecha/Hora Desde', value: 'dtdesde', sortable: true },
                    { text: 'Fecha/Hora Hasta', value: 'dthasta', sortable: true },
                    { text: 'SICA', value: 'controlsica', sortable: true },
                    { text: 'Hs Normal', value: 'horasnormal', sortable: true },
                    { text: 'Hs Extra', value: 'horasextra', sortable: true },
                    { text: 'Hs Nocturna', value: 'horasnocturna', sortable: true },
                    { text: '7mo día', value: 'septimodia' },
                    { text: 'Hs Enganche', value: 'horasenganche', sortable: true },
                    { text: 'Bolo Bruto', value: 'bolobruto' },
                    { text: 'Bolo Neto', value: 'boloneto' },
                    { text: 'Valor Extra', value: 'valhoraextra' },
                    { text: 'Imp.Extra', value: 'impextra' },
                    { text: 'Imp.Adicional', value: 'impadicional' },
                    { text: 'Total Bruto', value: 'imptotalbruto' },
                    { text: 'SAC', value: 'impsac' },
                    { text: 'Vacaciones', value: 'impvacaciones' },
                    { text: 'SAC/vacaciones', value: 'impsacvacaciones' },
                    { text: 'Retenciones', value: 'impretenciones' },
                    { text: 'Total Neto', value: 'imptotalneto', sortable: true },
                    { text: 'Contribuciones', value: 'impcontribucionpatronal' },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true },
                    { text: 'Estado', value: 'activo', sortable: true  }                                      
                ],
                search: '',
                editedIndex: -1,
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
                return this.editedIndex === -1 ? 'Nueva actividad' : 'Actualizar actividad'
            },
            tomorrow(){
                const date = this.fdesde ? new Date(this.fdesde): '';
                return(date ? new Date(date.getTime() + (date.getTimezoneOffset() * 480000)).toISOString() : '');
            }                           
        },
        watch: {
            dialogForm (val) {
            val || this.closeForm()
            },
        },
        created () {
            this.listarMaster();
            this.select();
            this.buscarActividades();
        },
        methods:{
            asignarminmax(idrecurso){
                let me = this;
                me.fdmin = me.recursos.find(x => x.value===idrecurso)["fecd"].substr(0,10);
                me.fdmax = me.recursos.find(x => x.value===idrecurso)["fech"].substr(0,10);
            },
            armarMineq(fecha){
                let eqstart = (this.configs[5]["valor"] - 8) * 60
                this.mineq=[];
                for (let i=0; i<1440; i++ ){
                    this.mineq.push({ id: i+1, datetime: this.addMinutes(fecha,i), mire: 1, mieq: (i<eqstart)?1:1.2})
                }
            },
            addMinutes(fecha, ammount){
                let datetime = new Date(fecha.substr(0,4),fecha.substr(5,2)-1,fecha.substr(8,2), 8, 0);
                return  new Date(datetime.getTime() + ammount * 60 * 1000);
            },
            sumarSiEq(desde, hasta){
                let valor = 0
                for (let i=0; i<1440; i++){
                    if (this.mineq[i]["datetime"]>=desde){
                        if (this.mineq[i]["datetime"]<hasta){
                            valor += this.mineq[i]["mieq"]
                        }
                    }
                };
                return valor;
            },
            sumarSiRe(desde, hasta){
                let valor = 0
                for (let i=0; i<1440; i++){
                    if (this.mineq[i]["datetime"]>=desde){
                        if (this.mineq[i]["datetime"]<hasta){
                            valor += this.mineq[i]["mire"]
                        }
                    }
                };
                return valor;
            },
            allowedHours: v => v % 1,
            allowedMinutes: v => v >= 0 && v <= 60,
            allowedStep: m => m % 15 === 0,
            formatPrice(value) {
                    let val = (value/1).toFixed(2).replace('.', ',')
                    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                },
            listarMaster(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(configuracion);
                if (this.$store.state.usuario.rol =='Administrador' || this.$store.state.usuario.rol =='JefeAdministracion' ){
                    axios.get('api/Proyectos/ListarActivos',configuracion).then(function(response){
                        //console.log(response);
                        me.proyectos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }else if (this.$store.state.usuario.rol =='ExecutiveProducer'){
                    axios.get('api/Proyectos/Listaractivosusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.proyectos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });                    
                } else {
                    axios.get('api/Proyectos/Listaractivosusuariovivo/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                        //console.log(response);
                        me.proyectos=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });                    
                }
            },
            buscarActividades(){
                let me=this;
                let actividadesArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Realdxds/ListarActividades', configuracion).then(function(respuesta){
                    actividadesArray=respuesta.data;
                    actividadesArray.map(function(x){
                         me.allActivity.push({idrealdxd: x.idrealdxd, idrecursodxd: x.idrecursodxd, idproyecto: x.idproyecto, 
                                        iditem: x.iditem, idsubitem:x.idsubitem, idcrew: x.idcrew , dtdesde: x.dtdesde, dthasta: x.dthasta, 
                                        septimodia:x.septimodia});
                    });             
                    console.log(me.allActivity);
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.respuesta.status;
                    me.snackbar = true;                    
                    console.log(error);
                });
            },  
            listarDetail(){
                let me=this;
                var tarifaArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};      
                //console.log(configuracion);
                axios.get('api/Realdxds/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    me.realdxds=response.data;
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
                var configsArray=[];
                axios.get('api/Gapconfigs/Listar',configuracion).then(function(response){
                    configsArray=response.data;
                    configsArray.map(function(x){
                        me.configs.push({ parametro: x.parametro, valor: x.valor, texto: x.texto });
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });             
            },                
            selectTarifas(){
                let me=this;
                var tarifaArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Tarifadxds/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    tarifaArray=response.data;
                    tarifaArray.map(function(x){
                        me.tarifadxds.push({iditem: x.iditem, bruto8hs: x.bruto8hs, extra4hs: x.extra4hs, bruto12hs: x.bruto12hs, value: x.idtarifadxd});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });          
            },
            selectRecursos(){
                let me=this;
                var recursoArray=[];
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
				axios.get('api/Recursodxds/ListarProyecto/'+this.idproyecto,configuracion).then(function(response){
                    //console.log(response);
                    recursoArray=response.data;
                    recursoArray.map(function(x){
                        me.recursos.push({text: x.itemorden + ': ' + x.itemes + ' - ' + x.nombre + ' (#' + x.idcont + ') ' + x.fecdesde.substr(0,10) + ' / ' + x.fechasta.substr(0,10), iditem: x.iditem, value:x.idrecursodxd, sindicato:x.sindicato , fecd: x.fecdesde, fech: x.fechasta});
                    });
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            },                      
            editMasterItem (item) {
                //console.log(item);                
                this.idproyecto = item.idproyecto;
                this.orden = item.orden;
                this.proyecto = item.proyecto;
                this.selectRecursos();
                this.selectTarifas();
                this.listarDetail();
                this.dialog = true
            },
            editDetailItem (item) {
                //console.log(item);
                this.idrealdxd = item.idrealdxd;
                this.idrecursodxd = item.idrecursodxd
                this.asignarminmax(item.idrecursodxd);
                this.horasbase = item.horasbase.toString();
                this.dtdesde = item.dtdesde;
                this.fdesde = item.dtdesde.substr(0,10);
                this.tdesde = item.dtdesde.substr(11,5);
                this.dthasta = item.dthasta;
                this.fhasta = item.dthasta?item.dthasta.substr(0,10):item.dthasta;
                this.thasta = item.dthasta?item.dthasta.substr(11,5):item.dthasta;
                this.controlsica = item.controlsica;
                this.horasnormal = item.horasnormal.toFixed(2);
                this.horasextra = item.horasextra.toFixed(2);
                this.horasnocturna = item.horasnocturna.toFixed(2);
                this.horasenganche = item.horasenganche.toFixed(2);
                this.bolobruto = item.bolobruto;
                this.boloneto = item.boloneto;
                this.valhoraextra = item.valhoraextra.toFixed(2);
                this.impextra = item.impextra.toFixed(2);
                this.impadicional = item.impadicional.toFixed(2);
                this.septimodia = item.septimodia;
                this.imptotalbruto = item.imptotalbruto.toFixed(2);
                this.impsac = item.impsac.toFixed(2);
                this.impvacaciones = item.impvacaciones.toFixed(2);
                this.impretenciones = item.impretenciones.toFixed(2);
                this.impsacvacaciones = item.impsacvacaciones.toFixed(2);
                this.imptotalneto = item.imptotalneto.toFixed(2);
                this.impcontribucionpatronal = item.impcontribucionpatronal.toFixed(2);
                this.iduseralta = item.iduseralta;
                this.fecalta = item.fecalta;
                this.iduserumod = item.iduserumod;
                this.fecumod = item.fecumod;               
                this.editedIndex=1;
                this.dialogForm = true
            },
            createDetail(){
                this.limpiarDetail();
                this.editIndex=-1;
                this.dialogForm = true;
            },          
            closeDetail () {
                this.dialog = false;
                this.limpiarMaster();
            },
            closeForm () {
                this.dialogForm = false;
                this.validaMensaje = [];
                this.limpiarDetail();
            },
            limpiarMaster(){
                this.idproyecto = '';
                this.orden = '';
                this.proyecto = '';
                this.recursos = [];
                this.tarifas = [];
            },
            limpiarDetail() {
                var date = new Date();
                this.idrealdxd = '';
                this.idrecursodxd = '';
                this.horasbase = '';
                this.dtdesde =new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                this.fdesde = this.dtdesde.substr(0,10);
                this.tdesde = '00:00';
                this.dthasta = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                this.fhasta = this.dtdesde.substr(0,10);
                this.thasta = '00:00';
                this.controlsica = false;
                this.horasnormal = 0;
                this.horasextra = 0;
                this.horasnocturna = 0;
                this.horasenganche = 0;
                this.bolobruto = 0;
                this.boloneto = 0;
                this.valhoraextra = 0;
                this.impextra = 0;
                this.impadicional = 0;
                this.septimodia = false;
                this.imptotalbruto = 0;
                this.impsac = 0;
                this.impvacaciones = 0;
                this.impretenciones = 0;
                this.impsacvacaciones = 0;
                this.imptotalneto = 0;
                this.impcontribucionpatronal = 0;
                this.iduseralta = '';
                this.fecalta = '';
                this.iduserumod = '';
                this.fecumod = '';
                this.editedIndex=-1;
            },            
            guardar () {
                let me=this;
                this.calcularDerivados();
                if (this.validar()){
                    return;
                }
                var date = new Date();
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    //Código para guardar
                    //console.log(me);
                    axios.put('api/Realdxds/Actualizar',{
                        'idrealdxd':me.idrealdxd,
                        'idrecursodxd':me.idrecursodxd,
                        'horasbase':me.horasbase,
                        'fecha':me.fecha,
                        'dtdesde':me.dtdesde,
                        'dthasta':me.dthasta,
                        'controlsica':me.controlsica,
                        'horasnormal':me.horasnormal,
                        'horasextra':me.horasextra,
                        'horasnocturna':me.horasnocturna,
                        'horasenganche':me.horasenganche,
                        'bolobruto':me.bolobruto,
                        'boloneto':me.boloneto,
                        'valhoraextra':me.valhoraextra,
                        'impextra':me.impextra,
                        'impadicional':me.impadicional,
                        'septimodia':me.septimodia,
                        'imptotalbruto':me.imptotalbruto,
                        'impsac':me.impsac,
                        'impvacaciones':me.impvacaciones,
                        'impretenciones':me.impretenciones,
                        'impsacvacaciones':me.impsacvacaciones,
                        'imptotalneto':me.imptotalneto,
                        'impcontribucionpatronal':me.impcontribucionpatronal,
                        'iduseralta': me.iduseralta,
                        'fecalta': me.fecalta,
                        'iduserumod': me.$store.state.usuario.idusuario,
                        'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                    },configuracion).then(function(response){
                        me.closeForm();
                        me.listarDetail();
                        me.limpiarDetail();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    //console.log(me);
                    axios.post('api/Realdxds/Crear',{
                        'idrecursodxd':me.idrecursodxd,
                        'horasbase':me.horasbase,
                        'fecha':me.fecha,
                        'dtdesde':me.dtdesde,
                        'dthasta':me.dthasta,
                        'controlsica':me.controlsica,
                        'horasnormal':me.horasnormal,
                        'horasextra':me.horasextra,
                        'horasnocturna':me.horasnocturna,
                        'horasenganche':me.horasenganche,                        
                        'bolobruto':me.bolobruto,
                        'boloneto':me.boloneto,
                        'valhoraextra':me.valhoraextra,
                        'impextra':me.impextra,
                        'impadicional':me.impadicional,
                        'septimodia':me.septimodia,
                        'imptotalbruto':me.imptotalbruto,
                        'impsac':me.impsac,
                        'impvacaciones':me.impvacaciones,
                        'impretenciones':me.impretenciones,
                        'impsacvacaciones':me.impsacvacaciones,
                        'imptotalneto':me.imptotalneto,
                        'impcontribucionpatronal':me.impcontribucionpatronal,
                        'iduseralta': me.$store.state.usuario.idusuario,
                    },configuracion).then(function(response){
                        me.closeForm();
                        me.listarDetail();
                        me.limpiarDetail();                        
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                }
            },
            calcularDerivados(){
                let me = this;
                let actividadreal=[];
                me.fecha = me.fdesde;
                me.acthasta = new Date(me.fecha.concat("T00:00"));
                me.acthasta = new Date(me.acthasta.getTime() - (me.acthasta.getTimezoneOffset() * 60000)).toISOString();
                me.actdesde = new Date(me.acthasta);
                me.diaanterior = new Date(me.acthasta);
                me.diaanterior.setDate(me.diaanterior.getDate() - 1 );
                me.diaanterior = new Date(me.diaanterior).toISOString().substr(0,10); 
                me.actdesde.setDate(me.actdesde.getDate() - 6 );
                me.actdesde = new Date(me.actdesde).toISOString();
                me.actividadreal = me.allActivity.filter(x => x.idproyecto === me.idproyecto &&
                                                              x.idrecursodxd === me.idrecursodxd &&
                                                              x.dtdesde >= me.actdesde &&
                                                              x.dtdesde < me.acthasta);
                me.armarMineq(me.fecha);
                me.iditem = me.recursos.filter(x => x.value === me.idrecursodxd).map(x =>x.iditem)[0];
                me.sindicato = me.recursos.filter(x => x.value === me.idrecursodxd).map(x =>x.sindicato)[0]?true:false;
                me.controlsica = me.sindicato;
                const ddate = new Date(me.fdesde.concat("T").concat(me.tdesde));
                const hdate = new Date(me.fhasta.concat("T").concat(me.thasta));
                me.dtdesde = new Date(ddate.getTime() - (ddate.getTimezoneOffset() * 60000)).toISOString();
                me.dthasta = new Date(hdate.getTime() - (hdate.getTimezoneOffset() * 60000)).toISOString();
                const dtinicionocturna = new Date(me.fdesde.concat("T").concat(me.configs[5]["valor"]).concat(":00"));
                me.septimodia = false;
                var dummy1 = '';
                var dummy2 = '';
                for (var i=0 ; i<me.actividadreal.length ; i++){
                    dummy1 = new Date (me.actdesde); 
                    dummy1.setDate(dummy1.getDate() + i );
                    dummy1 = new Date(dummy1).toISOString().substr(0,10);
                    dummy2 = me.actividadreal[i]["dtdesde"].substr(0,10)
                    if (dummy1 === dummy2 ){
                        if (me.actividadreal[i]["septimodia"]){
                            break
                        }else{
                            if (i===5){
                                me.septimodia = true;
                            }

                        }
                    }else{
                        break
                    }
                }

                // Tratamiento de horas
                // horas enganche
                me.horasenganche = 0;
                me.dtsalidaayer= me.actividadreal.filter(x => x.dtdesde.substr(0,10)===me.diaanterior).map(x => x.dthasta)[0];
                var inicio = new Date(me.dtsalidaayer);
                var lapso = ddate.getTime() - inicio.getTime() 
                var horas = lapso / 1000 / 60 / 60; 
                if(me.dtsalidaayer && 12 - horas >= 0){
                    me.horasenganche = 12 - horas;
                }
                // resto de calculo de horas
                me.horasreal = this.sumarSiRe( ddate, hdate ) / 60;
                me.horasequivalente = this.sumarSiEq( ddate, hdate ) / 60;
                if (hdate > dtinicionocturna){
                    me.horasnormal = this.sumarSiEq( ddate, dtinicionocturna ) / 60;
                } else {
                    me.horasnormal = this.sumarSiEq( ddate, hdate ) / 60;
                }
                me.horasextra = (me.horasnormal - me.horasbase)<0 ? 0 : me.horasnormal - me.horasbase;
                me.horasnocturna = this.sumarSiEq( dtinicionocturna, hdate )/ 60;

                // Tratamiento de Importes
                if(me.horasbase==="8"){
                        me.bolobruto=me.tarifadxds.filter(x => x.iditem===me.iditem).map(x => x.bruto8hs)[0];
                    }   else if(me.horasbase=="12"){
                            me.bolobruto=me.tarifadxds.filter(x => x.iditem===me.iditem).map(x =>x.bruto12hs)[0];
                        }
                else{
                    me.bolobruto='';
                };
                me.impadicional = typeof(me.impadicional)==='string'?Number(me.impadicional):me.impadicional;
                me.boloneto = me.bolobruto * 0.81;
                me.valhoraextra = me.tarifadxds.filter(x => x.iditem===me.iditem).map(x => x.bruto8hs)[0]/8*2;
                me.impextra = ((me.horasextra+me.horasnocturna>0)?(me.horasenganche+me.horasextra+me.horasnocturna):me.horasenganche) * me.valhoraextra;
                me.imptotalbruto = me.bolobruto + me.impextra ;
                if (me.septimodia){
                    me.imptotalbruto += me.bolobruto
                }
                me.impsac = +(+ me.imptotalbruto + me.impadicional) * this.configs[0]["valor"];
                // La Retencion debe incluir vac y sacvac?
                if (me.sindicato){
                    me.impretenciones = (me.imptotalbruto + me.impadicional + me.impsac ) * this.configs[4]["valor"];
                }
                else {
                    me.impretenciones = (me.imptotalbruto + me.impadicional + me.impsac ) * this.configs[1]["valor"];
                }
                me.impvacaciones = + ( + me.imptotalbruto + me.impadicional ) * this.configs[2]["valor"];
                me.impsacvacaciones = + me.impvacaciones * this.configs[0]["valor"];
                me.imptotalneto = + me.imptotalbruto + me.impadicional + me.impsac - me.impretenciones + me.impvacaciones + me.impsacvacaciones;
                me.impcontribucionpatronal = (+ me.imptotalbruto + me.impadicional + me.impsac ) * this.configs[3]["valor"];

                //Formateo de datos
                me.horasenganche = me.horasenganche.toFixed(2);
                me.horasextra = me.horasextra.toFixed(2);
                me.horasnocturna = me.horasnocturna.toFixed(2);
                me.impextra = me.impextra.toFixed(2);
                me.impadicional = me.impadicional.toFixed(2);
                me.imptotalbruto = me.imptotalbruto.toFixed(2);
                me.impsac = me.impsac.toFixed(2);
                me.impretenciones = me.impretenciones.toFixed(2);
                me.impvacaciones = me.impvacaciones.toFixed(2);
                me.impsacvacaciones = me.impsacvacaciones.toFixed(2);
                me.imptotalneto = me.imptotalneto.toFixed(2);
                me.impcontribucionpatronal = me.impcontribucionpatronal.toFixed(2);
            },          
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if (!this.idrecursodxd){
                    this.validaMensaje.push("Ingrese un Staff.");
                }
                if (!this.bolobruto || !this.bolobruto>0){
                    this.validaMensaje.push("Item sin Tarifa para este Proyecto.");
                }
                if (!this.horasbase){
                    this.validaMensaje.push("Ingrese un tipo de jornada 8 o 12 hs.");
                }
                if (!this.fdesde || !this.fhasta){
                    this.validaMensaje.push("Complete las fechas de la actividad.");
                }
                if (!this.tdesde || !this.thasta){
                    this.validaMensaje.push("Complete las horas de la actividad.");
                }
                if (this.fdesde == this.fhasta){
                    if (this.thasta<this.tdesde){
                        this.validaMensaje.push("Verifique el rango de horas.");
                    };
                }
                else{
                    if (this.fdesde != this.fhasta){
                        if (this.thasta>=this.tdesde){
                            this.validaMensaje.push("El rango total entre fechas y horas excede un día completo.");
                        };
                    }
                };
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.itemorden+': '+item.itemes+'/'+ item.nombre;
                this.adId=item.idrealdxd;                
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
                axios.put('api/Realdxds/Activar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listarDetail();                       
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
                axios.put('api/Realdxds/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listarDetail();                       
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    console.log(error);
                });
            }
        }        
    }
</script>
