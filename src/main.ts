import router from './router'
import {createPinia} from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from "./App.vue";
import {createApp} from "vue";

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')

