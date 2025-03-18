import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';

// Importando o Vuetify e os componentes
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles'; // Importa os estilos do Vuetify
import '@mdi/font/css/materialdesignicons.css'; // Importando ícones


const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
