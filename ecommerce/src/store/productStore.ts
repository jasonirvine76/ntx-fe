// src/store/productStore.ts
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  GET_CATEGORIES,
  GET_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../graphql/queries";

// Define interfaces for type safety.
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category_id: string | null;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  // This field will be added during transformation
  subcategories?: Category[];
}

export const useProductStore = defineStore("productStore", () => {
  // Flat list of categories as returned from the API.
  const flatCategories = ref<Category[]>([]);
  // Products array.
  const products = ref<Product[]>([]);
  // Loading state.
  const loading = ref<boolean>(false);

  function fetchCategories() {
    loading.value = true;
    const { result, error } = useQuery(GET_CATEGORIES);
    watch(result, (newResult) => {
      if (newResult && newResult.categories) {
        flatCategories.value = newResult.categories;
      }
    });
    watch(error, (err) => {
      if (err) console.error("GraphQL Error (categories):", err);
    });
    loading.value = false;
  }

  function fetchProducts() {
    loading.value = true;
    const { result, error } = useQuery(GET_PRODUCTS);
    watch(result, (newResult) => {
      if (newResult && newResult.products) {
        products.value = newResult.products;
      }
    });
    watch(error, (err) => {
      if (err) console.error("GraphQL Error (products):", err);
    });
    loading.value = false;
  }

  const nestedCategories = computed(() => {
    const categories = flatCategories.value.map((cat) => ({
      ...cat,
      subcategories: [] as Category[],
    }));
    // Create a map for easy lookup.
    const categoryMap: Record<string, Category> = {};
    categories.forEach((cat) => (categoryMap[cat.id] = cat));

    const tree: Category[] = [];
    categories.forEach((cat) => {
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].subcategories!.push(cat);
      } else {
        tree.push(cat);
      }
    });
    return tree;
  });

 

  async function addProduct(
    name: string,
    price: number,
    quantity: number,
    categoryId: string
  ) {
    const { mutate } = useMutation(ADD_PRODUCT);
    const response = await mutate({ name, price, quantity, categoryId });
    fetchProducts();
    return response;
  }

  async function updateProduct(id: string, name: string, price: number, quantity: number, categoryId: string) {
    const { mutate } = useMutation(UPDATE_PRODUCT);
    await mutate({ id, name, price, quantity, categoryId });
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    const { mutate } = useMutation(DELETE_PRODUCT);
    const response = await mutate({ id });
    fetchProducts();
    return response;
  }

  

  async function addCategory(name: string, parentId: string | null) {
    const categoryInput = parentId ? { data: { id: parentId } } : null;
    const { mutate } = useMutation(ADD_CATEGORY);
    const response = await mutate({ name, category: categoryInput });
    fetchCategories();
    return response;
  }

  async function updateCategory(id: string, name: string) {
    const { mutate } = useMutation(UPDATE_CATEGORY);
    const response = await mutate({ id, name });
    fetchCategories();
    return response;
  }

  async function deleteCategory(id: string) {
    const { mutate } = useMutation(DELETE_CATEGORY);
    const response = await mutate({ id });
    fetchCategories();
    return response;
  }

  return {
    flatCategories,
    products,
    loading,
    fetchCategories,
    fetchProducts,
    nestedCategories,
    // Product CRUD
    addProduct,
    updateProduct,
    deleteProduct,
    // Category CRUD
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
