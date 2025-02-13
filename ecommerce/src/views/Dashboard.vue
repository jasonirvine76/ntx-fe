<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl text-white shadow-lg">
        <h3 class="text-2xl font-semibold">Total Products</h3>
        <p class="text-3xl font-bold mt-2">{{ store.products.length }}</p>
      </div>
      <div class="p-6 bg-gradient-to-r from-green-500 to-green-400 rounded-xl text-white shadow-lg">
        <h3 class="text-2xl font-semibold">Total Categories</h3>
        <p class="text-3xl font-bold mt-2">{{ store.flatCategories.length }}</p>
      </div>
    </div>

    <!-- Nested Category Totals -->
    <div class="mt-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Category Totals</h2>
      <CategoryTotals v-if="store.nestedCategories.length" :categories="store.nestedCategories" />
    </div>

    <!-- Charts Section -->
    <div class="mt-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Data Visualization</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Bar Chart -->
        <div class="p-6 bg-gray-100 rounded-xl shadow">
          <h3 class="text-lg font-semibold mb-2">Products by Category</h3>
          <BarChart v-if="barChartData" :chart-data="barChartData" />
        </div>
        <!-- Pie Chart -->
        <div class="p-6 bg-gray-100 rounded-xl shadow">
          <h3 class="text-lg font-semibold mb-2">Price Distribution</h3>
          <PieChart v-if="pieChartData" :chart-data="pieChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useProductStore } from "../store/productStore";
import CategoryTotals from "../components/CategoryTotals.vue";
import BarChart from "../components/BarChart.vue";
import PieChart from "../components/PieChart.vue";

const store = useProductStore();

onMounted(() => {
  store.fetchCategories();
  store.fetchProducts();
});

// For charts, we'll use the flat list (top-level categories) as an example.
// You may adjust these calculations if you want to include nested totals.
const barChartData = computed(() => {
  if (!store.flatCategories.length || !store.products.length) return null;
  return {
    labels: store.flatCategories.map((c) => c.name),
    datasets: [
      {
        label: "Products per Category",
        data: store.flatCategories.map(
          (c) => store.products.filter((p) => p.category_id === c.id).length
        ),
        backgroundColor: "#4F46E5",
      },
    ],
  };
});

const pieChartData = computed(() => {
  if (!store.flatCategories.length || !store.products.length) return null;
  return {
    labels: store.flatCategories.map((c) => c.name),
    datasets: [
      {
        label: "Price Distribution",
        data: store.flatCategories.map((c) =>
          store.products.filter((p) => p.category_id === c.id).reduce((sum, p) => sum + p.price, 0)
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };
});
</script>

<style scoped>
.h-screen {
  height: 100vh;
}
</style>
