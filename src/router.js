import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/HelloWorld.vue';
import Login from './views/Login.vue';
import Product from './views/Product.vue';
import Stock from './views/Stock.vue';
import Transaction from './views/Transaction.vue';
import sell from './views/sell.vue';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/transaction/:id',
            name: 'transaction',
            component: Transaction
        },
        {
            path: '/stock/:id',
            name: 'stock',
            component: Stock
        },
        {
            path: '/sell/:id',
            name: 'sell',
            component: sell
        },
        {
            path: '/product',
            name: 'product',
            component: Product
        },
        {
            path: '/machine',
            name: 'machine',
            // lazy-loaded
            component: () => import('./views/Machine.vue')
        },
        /*
        {
            path: '/user',
            name: 'user',
            // lazy-loaded
            component: () => import('./views/BoardUser.vue')
        }
        */
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('username');

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        next('/');
    } else {
        next();
    }
});