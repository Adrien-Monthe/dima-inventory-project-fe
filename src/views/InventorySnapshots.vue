<template>
  <div class="container mt-4">
    <h2>Inventory Snapshots</h2>

    <table class="table table-bordered">
      <thead>
      <tr>
        <th>Product</th>
        <th>Location</th>
        <th>Quantity</th>
        <th>Created At</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="snap in snapshots" :key="snap.id">
        <td>{{ snap.product_name }}</td>
        <td>{{ snap.location_name }}</td>
        <td>{{ snap.quantity }}</td>
        <td>{{ new Date(snap.created_at).toLocaleString() }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const snapshots = ref<any[]>([]);

async function fetchSnapshots() {
  const res = await api.get("/api/v1.0/inventory/inventory-snapshots");
  snapshots.value = res.data;
}

onMounted(fetchSnapshots);
</script>
