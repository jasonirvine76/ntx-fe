import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
import App from "./App.vue";
import Dashboard from "./views/Dashboard.vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.markercluster";

declare module "leaflet" {
  export function markerClusterGroup(): any;
}

(window as any).L = L;







const routes = [{ path: "/", component: Dashboard },
];
const router = createRouter({ history: createWebHistory(), routes });

const apolloClient = new ApolloClient({
  uri: "https://sirefcode.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": import.meta.env.VITE_HASURA_SECRET,
  },
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
provideApolloClient(apolloClient);
app.mount("#app");
(window as any).L = L;
