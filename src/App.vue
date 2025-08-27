<template>
  <div>
    <Navbar v-if="showNavbar" />
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";

const route = useRoute();

const showNavbar = computed(() => route.path !== "/login");
</script>
