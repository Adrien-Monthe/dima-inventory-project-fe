import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '../views/Login.vue'
import ProductPage from '../views/Products.vue'
import StockMovePage from '../views/StockMoves.vue'
import LocationPage from '../views/Locations.vue'
import {useAuthStore} from '../store/auth'
import ProductTypes from "@/views/ProductTypes.vue";
import ProductCategories from "@/views/ProductCategories.vue";
import InventorySnapshots from "@/views/InventorySnapshots.vue";
import Vendors from "@/views/Vendors.vue";

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: LoginPage},
    {path: '/product-types', component: ProductTypes},
    {path: '/product-categories', component: ProductCategories},
    {path: '/products', component: ProductPage},
    {path: '/stock-moves', component: StockMovePage},
    {path: '/locations', component: LocationPage},
    {path: '/inventory-snapshots', component: InventorySnapshots},
    {path: '/vendors', component: Vendors},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    const token = auth.access

    if (authRequired && !token) {
        return next('/login')
    }
    next()
})

export default router
