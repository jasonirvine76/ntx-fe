<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProductStore } from "../store/productStore";

const store = useProductStore();
const newCategory = ref({ name: "", category: ""});
const editMode = ref(false);
const selectedCategory = ref<{ id: string; name: string } | null>(null);
const updatedCategoryName = ref("");

onMounted(() => {
  store.fetchCategories();
});

const addCategory = () => {
  if (newCategory.value.name) {
    store.addCategory(newCategory.value.name, newCategory.value.category);
    newCategory.value = { name: "", category: ""};
  }
};

const startEdit = (category: { id: string; name: string }) => {
  editMode.value = true;
  selectedCategory.value = category;
  updatedCategoryName.value = category.name;
};

const updateCategory = () => {
  if (selectedCategory.value && updatedCategoryName.value.trim()) {
    store.updateCategory(selectedCategory.value.id, updatedCategoryName.value);
    editMode.value = false;
    selectedCategory.value = null;
  }
};

const deleteCategory = (id: string) => {
  store.deleteCategory(id);
};
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Category Management</h2>

    <!-- Add Category -->
    <div class="mb-4">
        <label class="block text-gray-700 font-medium">Category</label>
        <input v-model="newCategory.name" type="text" placeholder="New category name"
        class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 mb-2">
        <label class="block text-gray-700 font-medium mt-2">Subcategory</label>
        <input v-model="newCategory.category" type="text" placeholder="New sub-category name"
        class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
      <button @click="addCategory"
        class="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Add Category
      </button>
    </div>

    <!-- Edit Category -->
    <div v-if="editMode" class="mb-4">
      <input v-model="updatedCategoryName" type="text" placeholder="Update category name"
        class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-200">
      <div class="flex space-x-2 mt-2">
        <button @click="updateCategory"
          class="w-1/2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
          Update
        </button>
        <button @click="editMode = false"
          class="w-1/2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
          Cancel
        </button>
      </div>
    </div>

    <!-- Category List -->
    <ul class="space-y-2">
      <li v-for="category in store.flatCategories" :key="category.id"
        class="p-2 border border-gray-300 rounded-md flex justify-between items-center">
        <span>{{ category.name }}</span>
        <div class="flex space-x-2">
          <button @click="startEdit(category)"
            class="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500">
            Edit
          </button>
          <button @click="deleteCategory(category.id)"
            class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>
