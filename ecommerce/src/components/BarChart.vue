<template>
    <div>
      <Bar v-if="chartData" :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from "vue";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController, 
  } from "chart.js";
  import { defineChartComponent } from "vue-chart-3";
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);
  
  const Bar = defineChartComponent("bar-chart", "bar");
  
  defineProps<{ chartData: any }>();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  </script>
  