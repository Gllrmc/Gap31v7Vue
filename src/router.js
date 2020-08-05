import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Rubro from './components/Rubro.vue';
import Subrubro from './components/Subrubro.vue';
import Item from './components/Item.vue';
import Subitem from './components/Subitem.vue';
import Pais from './components/Pais.vue';
import Provincia from './components/Provincia.vue';
import Territorio from './components/Territorio.vue';
import Agencia from './components/Agencia.vue';
import Empresa from './components/Empresa.vue';
import Productora from './components/Productora.vue';
import Persona from './components/Persona.vue';
import Categoria from './components/Categoria.vue';
import Articulo from './components/Articulo.vue';
import Rol from './components/Rol.vue';
import Usuario from './components/Usuario.vue';
import Cliente from './components/Cliente.vue';
import Proveedor from './components/Proveedor.vue';
import Crew from './components/Crew.vue';
import Proyecto from './components/Proyecto.vue';
import Presupuesto from './components/Presupuesto.vue';
import Pedidofondo from './components/Pedidofondo.vue';
import Distribucionfondo from './components/Distribucionfondo.vue';
import Login from './components/Login.vue';
import Prueba from './components/Prueba.vue';
import Ingreso from './components/Ingreso.vue';
import Venta from './components/Venta.vue';
import ConsultaVenta from './components/ConsultaVenta.vue';
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
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/proyectos',
            name: 'proyectos',
            component: Proyecto,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/presupuestos',
            name: 'presupuestos',
            component: Presupuesto,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/pedidofondos',
            name: 'pedidofondos',
            component: Pedidofondo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/distribucionfondos',
            name: 'distribucionfondos',
            component: Distribucionfondo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        }, {
            path: '/rubros',
            name: 'rubros',
            component: Rubro,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/subrubros',
            name: 'subrubros',
            component: Subrubro,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/items',
            name: 'items',
            component: Item,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/subitems',
            name: 'subitems',
            component: Subitem,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        }, {
            path: '/agencias',
            name: 'agencias',
            component: Agencia,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/empresas',
            name: 'empresas',
            component: Empresa,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        }, {
            path: '/productoras',
            name: 'productoras',
            component: Productora,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/paises',
            name: 'paises',
            component: Pais,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/personas',
            name: 'personas',
            component: Persona,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/provincias',
            name: 'provincias',
            component: Provincia,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/territorios',
            name: 'territorios',
            component: Territorio,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/crews',
            name: 'crews',
            component: Crew,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/categorias',
            name: 'categorias',
            component: Categoria,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/articulos',
            name: 'articulos',
            component: Articulo,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/ingresos',
            name: 'ingresos',
            component: Ingreso,
            meta: {
                administrador: true,
                jefeadministracion: true,
                executiveproducer: true,
                asistadministracion: true,
                asistproduccion: true
            }
        },
        {
            path: '/roles',
            name: 'roles',
            component: Rol,
            meta: {
                administrador: true
            }
        },
        {
            path: '/usuarios',
            name: 'usuarios',
            component: Usuario,
            meta: {
                administrador: true
            }
        },
        {
            path: '/clientes',
            name: 'clientes',
            component: Cliente,
            meta: {
                administrador: true,
                executiveproducer: true
            }
        },
        {
            path: '/prueba',
            name: 'prueba',
            component: Prueba,
            meta: {
                administrador: true,
                executiveproducer: true
            }
        },
        {
            path: '/ventas',
            name: 'ventas',
            component: Venta,
            meta: {
                administrador: true,
                executiveproducer: true
            }
        },
        {
            path: '/consultaventas',
            name: 'consultaventas',
            component: ConsultaVenta,
            meta: {
                administrador: true
            }
        },
        {
            path: '/proveedores',
            name: 'proveedores',
            component: Proveedor,
            meta: {
                administrador: true,
                jefeadministracion: true
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
    } else {
        next({
            name: 'login'
        });
    }
});

export default router;