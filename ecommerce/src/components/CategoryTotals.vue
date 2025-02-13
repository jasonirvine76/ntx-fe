<template>
    <ul class="space-y-2">
      <li v-for="category in categories" :key="category.id" class="relative ml-4 border-l-2 border-blue-300 pl-2">
        <div class="bg-blue-50 p-3 rounded-md shadow hover:shadow-lg transition duration-200 ease-in-out">
          <div class="flex justify-between items-center">
            <span class="font-bold text-blue-800">{{ category.name }}</span>
            <span class="text-green-600 font-semibold">
              Own: ${{ formatPrice(ownTotal(category)) }}, Total: ${{ formatPrice(cumulativeTotal(category)) }}
            </span>
          </div>
        </div>
        <!-- Recursively render subcategories if present -->
        <CategoryTotals
          v-if="category.subcategories && category.subcategories.length"
          :categories="category.subcategories"
        />
      </li>
    </ul>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from "vue";
  import { useProductStore, Category } from "../store/productStore";
  
  const props = defineProps<{ categories: Category[] }>();
  const store = useProductStore();
  
  // Calculate the total for products directly in this category.
  const ownTotal = (category: Category): number => {
    return store.products
      .filter((p) => p.category_id === category.id)
      .reduce((sum, p) => sum + p.price, 0);
  };
  
  // Recursively calculate the cumulative total (own + subcategories)
  const cumulativeTotal = (category: Category): number => {
    let total = ownTotal(category);
    if (category.subcategories && category.subcategories.length) {
      total += category.subcategories.reduce((sum, sub) => sum + cumulativeTotal(sub), 0);
    }
    return total;
  };
  
  const formatPrice = (price: number): string => {
    return price.toLocaleString();
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
  }
  </style>
  