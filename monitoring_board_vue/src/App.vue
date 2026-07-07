<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import MonitoringChartList from './components/MonitoringChartList.vue';
import ApplicationBar from './components/ApplicationBar.vue';
</script>

<template>
  <v-app> 
    <v-system-bar>
      <span class="ms-2">3:13PM</span>
    </v-system-bar>
    <application-bar></application-bar>
    <v-main>
      <MonitoringChartList/>
    </v-main>
    <v-footer>Powered by JAEYEON JO</v-footer> 
   </v-app>  
</template>

<style scoped>
</style>
