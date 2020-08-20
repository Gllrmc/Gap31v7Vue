<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Recupero de Cheques en Garantía</v-toolbar-title>
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
            <v-dialog v-model="adModalR" max-width="400">
                <v-card>
                    <v-card-title class="headline" v-if="adAccionR==1">¿Recupera Cheque en Garantía?</v-card-title>
                    <v-card-text>
                        Estás a punto de 
                        <span v-if="adAccionR==1">Recuperar </span>
                        un Cheque entregado en Garantía {{ adNombre }}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrarR">
                            Cancelar
                        </v-btn>
                        <v-btn v-if="adAccionR==1" color="orange darken-4" flat="flat" @click="activarR">
                            Recuperar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>                                              
            <v-data-table
                :headers="headers"
                :items="garantias"
                :search="search"
                class="elevation-1"
                >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-20">
                        <v-icon
                        small
                        @click="activarDesactivarRendir(props.item)"
                        >
                        lock_open
                        </v-icon>
                    </td>
                    <td>{{ props.item.banco }}</td>
                    <td>{{ props.item.numcheque }}</td>
                    <td class="text-xs-right">{{ formatPrice(props.item.importe) }}</td>
                    <td>{{ props.item.feccheque.substr(0, 10) }}</td>
                    <td>{{ props.item.fecvencimiento.substr(0, 10) }}</td>
                    <td>{{ props.item.proveedor }}</td>
                    <td>{{ props.item.proyectoorden }}</td>
                    <td>{{ props.item.proyecto }}</td>
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
            <v-flex class="text-xs-right">
                <strong>Total: </strong>$ {{totalPendiente=formatPrice(calcularTotal)}}
            </v-flex>                 
        </v-flex>
    </v-layout>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.487/pdf.min.js"></script>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import pdfjsLib from 'pdfjs-dist';      
    export default {
        data: () => {
            return {
                snackbar:false,
                snacktext: 'Hola',
                timeout: 4000,
                page: 1,
                garantias:[],
                adModalR:0,
                adAccionR:0,
                // Master
                dialogForm: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombre del Banco', value: 'banco', sortable: true },
                    { text: '#Cheque', value: 'numcheque', sortable: true },
                    { text: 'Importe', value: 'importe', sortable: true },
                    { text: 'Fecha Cheque', value: 'feccheque', sortable: true },
                    { text: 'Vencimiento', value: 'fecvencimiento', sortable: true },
                    { text: 'Nombre del Proveedor', value: 'proveedor', sortable: true },
                    { text: '#Proyecto', value: 'proyectoorden', sortable: true },
                    { text: 'Proyecto', value: 'proyecto', sortable: true },
                    { text: 'Creado', value: 'iduseralta', sortable: true },
                    { text: 'Fec.Creación', value: 'fecalta', sortable: true },
                    { text: 'UltMod', value: 'iduserumod', sortable: true },
                    { text: 'Fec.UltMod', value: 'fecumod', sortable: true }
                ],             
                totalPendiente: 0,                 
                search: '',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                registrar: false
            }
        },
        computed: {
            calcularTotal:function(){
                var resultado=0.0;
                for(var i=0;i<this.garantias.length;i++){
                    resultado=resultado+(this.garantias[i].activo?this.garantias[i].importe:0);
                }
                return resultado;
            }                           
        },
        watch: {
            dialogForm (val) {
                val || this.closeForm()
            }
        },
            created () {
                this.listar();
                this.select();
            },
        methods:{                                                       
                formatPrice(value) {
                    let val = (value/1).toFixed(2).replace('.', ',')
                    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                },
                listar(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    //console.log(configuracion);
                    axios.get('api/Garantias/ListarPendientes',configuracion).then(function(response){
                        // console.log(response);
                        me.garantias=response.data;
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                },
                select(){
                },
                activarDesactivarRendir(item){
                    this.adModalR=1;
                    this.adNombre=item.banco+'/'+ item.numcheque;
                    this.adId=item.idgarantia;                
                    if (item.rendido){
                        this.adAccionR=2;
                    }
                    else {
                        this.adAccionR=1;
                    }
                },
                activarDesactivarCerrarR(){
                    this.adModalR=0;
                },
                activarR(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    axios.put('api/Garantias/ActivarRendir/'+this.adId,{},configuracion).then(function(response){
                        me.adModalR=0;
                        me.adAccionR=0;
                        me.adNombre="";
                        me.adId="";
                        me.search="" 
                        me.listar();                       
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                },
                desactivarR(){
                    let me=this;
                    let header={"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion= {headers : header};
                    axios.put('api/Garantias/DesactivarRendir/'+this.adId,{},configuracion).then(function(response){
                        me.adModalR=0;
                        me.adAccionR=0;
                        me.adNombre="";
                        me.search="" 
                        me.adId="";
                        me.listar();                       
                    }).catch(function(error){
                        me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                        me.snackbar = true;
                        console.log(error);
                    });
                },

        }
    }
</script>