import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_LOCATIONS } from "../graphql/queries";

export const useMapStore = defineStore("mapStore", () => {
  const locations = ref<{ id: string; latitude: number; longitude: number; name?: string }[]>([]);
  const loading = ref<boolean>(false);

  function fetchLocations() {
    loading.value = true;
    const { result, error } = useQuery(GET_LOCATIONS);

    watch(result, (newResult) => {
      if (newResult && newResult.locations) {
        locations.value = [...newResult.locations];
      }
    });

    watch(error, (newError) => {
      if (newError) console.error("GraphQL Error:", newError);
    });

    loading.value = false;
  }

  return { locations, loading, fetchLocations };
});
