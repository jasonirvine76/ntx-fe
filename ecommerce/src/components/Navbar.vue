<template>
<nav class="bg-blue-500 text-white p-4 shadow-md">
    <div class="max-w-5xl mx-auto flex justify-between">
    <h1 class="text-xl font-semibold">E-Commerce</h1>
    <ul class="flex space-x-4">
        <li><router-link to="/" class="hover:underline">Dashboard</router-link></li>
        <li><router-link to="/categories" class="hover:underline">Categories</router-link></li>
        <li><router-link to="/products" class="hover:underline">Products</router-link></li>
    </ul>
    </div>
</nav>
</template>
  