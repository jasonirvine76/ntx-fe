<template>
  <div class="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Product Management</h2>

    <!-- Add / Update Product -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium">Product Name</label>
      <input v-model="newProduct.name" type="text" placeholder="Product name" class="w-full p-2 border border-gray-300 rounded-md" />
      <label class="block text-gray-700 font-medium mt-2">Price</label>
      <input v-model="newProduct.price" type="number" placeholder="Price" class="w-full p-2 border border-gray-300 rounded-md" />
      <label class="block text-gray-700 font-medium mt-2">Quantity</label>
      <input v-model="newProduct.quantity" type="number" placeholder="Quantity" class="w-full p-2 border border-gray-300 rounded-md" />
      <label class="block text-gray-700 font-medium mt-2">Category</label>
      <select v-model="newProduct.categoryId" class="w-full p-2 border border-gray-300 rounded-md">
        <option disabled value="">Select category</option>
        <option v-for="category in store.nestedCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      
      <button 
        @click="isEditing ? updateProduct() : addProduct()" 
        class="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {{ isEditing ? "Update Product" : "Add Product" }}
      </button>

      <button 
        v-if="isEditing" 
        @click="cancelEdit"
        class="mt-2 w-full bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
      >
        Cancel
      </button>
    </div>

    <!-- Product List -->
    <ul>
      <li 
        v-for="product in store.products" 
        :key="product.id" 
        class="p-2 border border-gray-300 rounded-md flex justify-between"
      >
        <span>{{ product.name }} - ${{ product.price }}</span>
        <div class="flex space-x-2">
          <button 
            @click="editProduct(product)" 
            class="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500"
          >
            Edit
          </button>
          <button 
            @click="store.deleteProduct(product.id)" 
            class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProductStore } from "../store/productStore";

const store = useProductStore();
const newProduct = ref({ id: "", name: "", price: 0, quantity: 0, categoryId: "" });
const isEditing = ref(false);

onMounted(() => {
  store.fetchCategories();
  store.fetchProducts();
});

const addProduct = () => {
  if (newProduct.value.name && newProduct.value.price > 0 && newProduct.value.categoryId) {
    store.addProduct(newProduct.value.name, newProduct.value.price, newProduct.value.quantity, newProduct.value.categoryId);
    resetForm();
  }
};

const editProduct = (product: any) => {
  newProduct.value = { ...product };
  isEditing.value = true;
};

const updateProduct = () => {
  if (newProduct.value.id && newProduct.value.name.trim() && newProduct.value.price > 0) {
    store.updateProduct(newProduct.value.id, newProduct.value.name, newProduct.value.price, newProduct.value.quantity, newProduct.value.categoryId);
    resetForm();
  }
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  newProduct.value = { id: "", name: "", price: 0, quantity: 0, categoryId: "" };
  isEditing.value = false;
};
</script>

<style scoped>
.h-screen {
  height: 100vh;
}
</style>
