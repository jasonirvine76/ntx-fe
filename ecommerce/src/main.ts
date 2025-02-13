import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { ApolloClient, InMemoryCache } from "@apollo/client/core"; 
import { provideApolloClient } from "@vue/apollo-composable"; 
import App from "./App.vue";
import Dashboard from "./views/Dashboard.vue";
import CategoryManagement from "./views/CategoryManagement.vue";
import "./assets/tailwind.css"
import ProductManagement from "./views/ProductManagement.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Dashboard },
    { path: "/categories", component: CategoryManagement },
    { path: "/products", component: ProductManagement },
  ],
});


const apolloClient = new ApolloClient({
  uri: "https://sirefcode.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": "jw8y3lwW7Vk4HKuROjlbs3flnrYaDsE1vkqNqhtTgv3rIo8bC655Fx6WmSZk4KvO",
  },
});


const app = createApp(App);
app.use(createPinia());
app.use(router);
provideApolloClient(apolloClient); 
app.mount("#app");
