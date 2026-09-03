import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import { installPermissionDirective } from './directives/permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
installPermissionDirective(app)

app.mount('#app')
