<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">DIMA WMS</a>
      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li
              v-for="item in navItems"
              :key="item.name"
              class="nav-item"
          >
            <router-link
                :to="item.path"
                class="nav-link"
                :class="{ active: isActive(item.path) }"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
        <button class="btn btn-outline-light" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "../store/auth";

const navItems = [
  {name: "Locations", path: "/locations"},
  {name: "Product Types", path: "/product-types"},
  {name: "Product Categories", path: "/product-categories"},
  {name: "Products", path: "/products"},
  {name: "Stock Moves", path: "/stock-moves"},
  {name: "Vendors", path: "/vendors"},
  {name: "Inventory Snapshots", path: "/inventory-snapshots"},
];

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function isActive(path: string) {
  return route.path === path;
}

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.navbar-nav .nav-link.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
