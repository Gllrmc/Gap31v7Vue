import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Prospecto from './components/Prospecto.vue';
import Hlimbo from './components/Hlimbo.vue';
import Alimbo from './components/Alimbo.vue';
import Actproy from './components/Actproy.vue';
import Trafico from './components/Trafico.vue';
import Rubro from './components/Rubro.vue';
import Subrubro from './components/Subrubro.vue';
import Item from './components/Item.vue';
import Subitem from './components/Subitem.vue';
import Pais from './components/Pais.vue';
import Provincia from './components/Provincia.vue';
import Territorio from './components/Territorio.vue';
import Tipoprod from './components/Tipoprod.vue';
import Tipoproy from './components/Tipoproy.vue';
import Agencia from './components/Agencia.vue';
import Banco from './components/Banco.vue';
import Empresa from './components/Empresa.vue';
import Estado from './components/Estado.vue';
import Origen from './components/Origen.vue';
import Productora from './components/Productora.vue';
import Persona from './components/Persona.vue';
import Pitch from './components/Pitch.vue';
import Posicion from './components/Posicion.vue';
import Resultado from './components/Resultado.vue';
import Rol from './components/Rol.vue';
import Usuario from './components/Usuario.vue';
import Usuarioproyecto from './components/Usuarioproyecto.vue';
import Cliente from './components/Cliente.vue';
import Proveedor from './components/Proveedor.vue';
import Crew from './components/Crew.vue';
import Proyecto from './components/Proyecto.vue';
import Presupuesto from './components/Presupuesto.vue';
import Cierreadmin from './components/Cierreadmin.vue';
import Cierreprod from './components/Cierreprod.vue';
import Proyectocerrado from './components/Proyectocerrado.vue';
import Flujocaja from './components/Flujocaja.vue';
import Pedidofondo from './components/Pedidofondo.vue';
import Distribucionfondo from './components/Distribucionfondo.vue';
import Rendicionfondo from './components/Rendicionfondo.vue';
import Devolucionfondo from './components/Devolucionfondo.vue';
import Ordenpago from './components/Ordenpago.vue';
import Registropago from './components/Registropago.vue';
import Solcheque from './components/Solcheque.vue';
import Entcheque from './components/Entcheque.vue';
import Reccheque from './components/Reccheque.vue';
import Recursosdxd from './components/Recursosdxd.vue';
import Tarifadxd from './components/Tarifadxd.vue';
import Realdxd from './components/Realdxd.vue';
import Proveedorpost from './components/Proveedorpost.vue';
import Realpost from './components/Realpost.vue';
import Proveedormotion from './components/Proveedormotion.vue';
import Realmotion from './components/Realmotion.vue';
import Sica from './components/Sica.vue';
import Login from './components/Login.vue';
import Parametro from './components/Parametro.vue';
import Controlpptodate from './components/Controlpptodate.vue';
import Controlshooting from './components/Controlshooting.vue';
import Controlpago from './components/Controlpagos.vue';
import Controlgarantia from './components/Controlgarantia.vue';
import Controlrendicion from './components/Controlrendicion.vue';
import Controlpost from './components/Controlpost.vue';
import Controlmotion from './components/Controlmotion.vue';
import Prueba from './components/Prueba.vue';
import Prueba2 from './components/Prueba2.vue'
import store from './store';

Vue.use(Router);

var router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: true
            }
        },
        {
            path: '/limbos',
            name: 'limbos',
            component: Prospecto,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/hlimbos',
            name: 'hlimbos',
            component: Hlimbo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/alimbos',
            name: 'alimbos',
            component: Alimbo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/actproy',
            name: 'actproy',
            component: Actproy,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/traficos',
            name: 'traficos',
            component: Trafico,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/proyectos',
            name: 'proyectos',
            component: Proyecto,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/presupuestos',
            name: 'presupuestos',
            component: Presupuesto,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/flujocajas',
            name: 'flujocajas',
            component: Flujocaja,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/cierreprod',
            name: 'cierreprod',
            component: Cierreprod,
            meta: {
                administrador: true,
                jefeadministracion: false,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/cierreadmin',
            name: 'cierreadmin',
            component: Cierreadmin,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/proyectoscerrados',
            name: 'proyectoscerrados',
            component: Proyectocerrado,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/pedidofondos',
            name: 'pedidofondos',
            component: Pedidofondo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/distribucionfondos',
            name: 'distribucionfondos',
            component: Distribucionfondo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/rendicionfondos',
            name: 'rendicionfondos',
            component: Rendicionfondo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: true
            }
        },
        {
            path: '/devolucionfondos',
            name: 'devolucionfondos',
            component: Devolucionfondo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/ordenpagos',
            name: 'ordenpagos',
            component: Ordenpago,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/registropagos',
            name: 'registropagos',
            component: Registropago,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/solcheque',
            name: 'solcheque',
            component: Solcheque,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/entcheque',
            name: 'entcheque',
            component: Entcheque,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/reccheque',
            name: 'reccheque',
            component: Reccheque,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/recursosdxd',
            name: 'recursosdxd',
            component: Recursosdxd,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/realdxd',
            name: 'realdxd',
            component: Realdxd,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/tarifadxd',
            name: 'tarifadxd',
            component: Tarifadxd,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/sica',
            name: 'sica',
            component: Sica,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/proveedorpost',
            name: 'proveedorpost',
            component: Proveedorpost,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/realpost',
            name: 'realpost',
            component: Realpost,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/proveedormotion',
            name: 'proveedormotion',
            component: Proveedormotion,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/realmotion',
            name: 'realmotion',
            component: Realmotion,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/controlpptodate',
            name: 'controlpptodate',
            component: Controlpptodate,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/controlrendicion',
            name: 'controlrendicion',
            component: Controlrendicion,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/controlpagos',
            name: 'controlpagos',
            component: Controlpago,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/controlgarantias',
            name: 'controlgarantias',
            component: Controlgarantia,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/controlshooting',
            name: 'controlshooting',
            component: Controlshooting,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/controlpost',
            name: 'controlpost',
            component: Controlpost,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/controlmotion',
            name: 'controlmotion',
            component: Controlmotion,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/rubros',
            name: 'rubros',
            component: Rubro,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/subrubros',
            name: 'subrubros',
            component: Subrubro,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/items',
            name: 'items',
            component: Item,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/subitems',
            name: 'subitems',
            component: Subitem,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/agencias',
            name: 'agencias',
            component: Agencia,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/bancos',
            name: 'bancos',
            component: Banco,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/clientes',
            name: 'clientes',
            component: Cliente,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/crews',
            name: 'crews',
            component: Crew,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/empresas',
            name: 'empresas',
            component: Empresa,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/estados',
            name: 'estados',
            component: Estado,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/origenes',
            name: 'origenes',
            component: Origen,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/paises',
            name: 'paises',
            component: Pais,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/parametros',
            name: 'parametros',
            component: Parametro,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/personas',
            name: 'personas',
            component: Persona,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/pitchs',
            name: 'pitchs',
            component: Pitch,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/posiciones',
            name: 'posiciones',
            component: Posicion,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/productoras',
            name: 'productoras',
            component: Productora,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/proveedores',
            name: 'proveedores',
            component: Proveedor,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: true,
                chiefproducer: true,
                asistproduccion: true,
                asistgeneral: false
            }
        },
        {
            path: '/provincias',
            name: 'provincias',
            component: Provincia,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/resultados',
            name: 'resultados',
            component: Resultado,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/territorios',
            name: 'territorios',
            component: Territorio,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/tipoprods',
            name: 'tipoprods',
            component: Tipoprod,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/tipoproys',
            name: 'tipoproys',
            component: Tipoproy,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/roles',
            name: 'roles',
            component: Rol,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: false,
                executiveproducer: false,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/usuarios',
            name: 'usuarios',
            component: Usuario,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/usuarioproyectos',
            name: 'usuarioproyectos',
            component: Usuarioproyecto,
            meta: {
                administrador: true,
                jefeadministracion: true,
                asistadministracion: true,
                executiveproducer: true,
                lineproducer: false,
                chiefproducer: false,
                asistproduccion: false,
                asistgeneral: false
            }
        },
        {
            path: '/prueba',
            name: 'prueba',
            component: Prueba,
            meta: {
                administrador: true
            }
        },
        {
            path: '/prueba2',
            name: 'prueba2',
            component: Prueba2,
            meta: {
                administrador: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                libre: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.libre)) {
        next();
    } else if (store.state.usuario && store.state.usuario.rol == 'Administrador') {
        if (to.matched.some(record => record.meta.administrador)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'JefeAdministracion') {
        if (to.matched.some(record => record.meta.jefeadministracion)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'ExecutiveProducer') {
        if (to.matched.some(record => record.meta.executiveproducer)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'AsistAdministracion') {
        if (to.matched.some(record => record.meta.asistadministracion)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'AsistProduccion') {
        if (to.matched.some(record => record.meta.asistproduccion)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'ChiefProducer') {
        if (to.matched.some(record => record.meta.chiefproducer)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'LineProducer') {
        if (to.matched.some(record => record.meta.lineproducer)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'AsistGeneral') {
        if (to.matched.some(record => record.meta.asistgeneral)) {
            next();
        }
    } else {
        next({
            name: 'login'
        });
    }
});

export default router;