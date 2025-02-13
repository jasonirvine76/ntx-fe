<template>
  <ul class="ml-4 border-l border-gray-300 pl-2">
    <li v-for="category in categories" :key="category.id" class="py-1">
      <div class="flex justify-between">
        <span class="font-semibold">{{ category.name }}</span>
        <span class="text-gray-600">${{ calculateTotal(category) }}</span>
      </div>
      <CategoryList v-if="category.subcategories && category.subcategories.length" :categories="category.subcategories" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useProductStore, Category } from "../store/productStore";

const props = defineProps<{ categories: Category[] }>();

const store = useProductStore();

/**
 * Recursively calculate the total price for a category:
 *   - Sum the prices of products that belong directly to this category.
 *   - Recursively add the totals from its subcategories.
 */
const calculateTotal = (category: Category): number => {
  let total = store.products
    .filter((p) => p.category_id === category.id)
    .reduce((sum, p) => sum + p.price, 0);
  if (category.subcategories && category.subcategories.length > 0) {
    total += category.subcategories.reduce((sum, sub) => sum + calculateTotal(sub), 0);
  }
  return total;
};
</script>

<style scoped>
ul {
  list-style-type: none;
}
</style>
