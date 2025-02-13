<template>
    <div>
      <Pie v-if="chartData" :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from "vue";
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    PieController, 
  } from "chart.js";
  import { defineChartComponent } from "vue-chart-3";
  
  ChartJS.register(ArcElement, Tooltip, Legend, Title, PieController);
  
  const Pie = defineChartComponent("pie-chart", "pie");
  
  defineProps<{ chartData: any }>();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  </script>
  