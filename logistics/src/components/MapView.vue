<template>
  <link rel="stylesheet" href="https://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.css" />
  <link rel="stylesheet" href="https://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
  <div class="h-screen w-full">
    <div ref="mapContainer" id="map" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useMapStore } from "../store/mapStore";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";

const store = useMapStore();
const map = ref<L.Map | null>(null);
const mapContainer = ref<HTMLDivElement | null>(null);
const markerCluster = ref<any | null>(null);
const connectingLines = ref<{ id: number; points: L.LatLngTuple[] }[]>([]);
const activePopups = ref<{ id: number; popup: L.Popup }[]>([]);

const createCustomClusterIcon = (cluster: any) => {
  return L.divIcon({
    html: `<div class="custom-cluster">${cluster.getChildCount()}</div>`, 
    className: "custom-cluster-container",
    iconSize: L.point(40, 40),
  });
};

const initializeMap = async () => {
  await nextTick();

  if (!mapContainer.value) {
    console.error("Map container not found");
    return;
  }

  console.log("[Map Debug] Initializing map...");
  map.value = L.map(mapContainer.value).setView([-6.208763, 106.845599], 5);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value as L.Map);

    
  markerCluster.value = L.markerClusterGroup({
    maxClusterRadius: 120,
    iconCreateFunction: createCustomClusterIcon, 
    
  });

  map.value.addLayer(markerCluster.value);
  console.log("[Map Debug] Map initialized successfully.");
};

const openPopup = (location: any) => {
  if (!map.value) {
    console.error("Map is not initialized.");
    return;
  }

  const popupLatLng: L.LatLngTuple = [location.latitude + 0.005, location.longitude + 0.005];

  const popup = L.popup({ autoClose: false, closeOnClick: false })
    .setLatLng(popupLatLng)
    .setContent(`<div class="p-2"><strong>Name:</strong> ${location.name}</div>`)
    .addTo(map.value as L.Map);

  activePopups.value.push({ id: location.id, popup });

  const popupPosition = popup.getLatLng();
  if (popupPosition) {
    const line = L.polyline(
      [[location.latitude, location.longitude], [popupPosition.lat, popupPosition.lng]],
      { color: "red", weight: 2, dashArray: "5,5" }
    ).addTo(map.value as L.Map);

    const latLngTuples: L.LatLngTuple[] = (line.getLatLngs() as L.LatLng[]).map(
      (latlng) => [latlng.lat, latlng.lng] as L.LatLngTuple
    );
    connectingLines.value.push({ id: location.id, points: latLngTuples });
  }
};

const addMarkers = () => {
  if (!markerCluster.value || !map.value) return;

  markerCluster.value.clearLayers();
  connectingLines.value = [];

  store.locations.forEach((location: any) => {
    const marker = L.marker([location.latitude, location.longitude]);
    marker.on("click", () => openPopup(location));
    markerCluster.value?.addLayer(marker);
  });

  console.log(`[Map Debug] Added ${store.locations.length} markers.`);
};

onMounted(async () => {
  console.log("[Map Debug] Fetching locations...");
  store.fetchLocations();
  await initializeMap();

  const interval = setInterval(() => {
    if (store.locations.length > 0) {
      addMarkers();
      clearInterval(interval);
    }
  }, 500);
});
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}

.custom-cluster-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-cluster {
  background: #3b82f6; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: 3px solid white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>
