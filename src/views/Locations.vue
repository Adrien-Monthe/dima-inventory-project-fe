<template>
  <div class="container mt-4">
    <h2>Locations</h2>

    <form @submit.prevent="addLocation" class="d-flex gap-2 mb-3">
      <input
          v-model="newLocation.code"
          placeholder="Location code"
          required
          class="form-control"
      />
      <input
          v-model="newLocation.name"
          placeholder="Location name"
          required
          class="form-control"
      />
      <button class="btn btn-primary">Add</button>
    </form>

    <ul class="list-group">
      <li
          v-for="location in locations"
          :key="location.id"
          class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div v-if="editingId !== location.id">
          {{ location.code }} - {{ location.name }}
        </div>

        <!-- Edit form -->
        <div v-else class="d-flex gap-2 flex-grow-1">
          <input v-model="editLocation.code" class="form-control"/>
          <input v-model="editLocation.name" class="form-control"/>
        </div>

        <div class="d-flex gap-2">
          <button
              v-if="editingId !== location.id"
              class="btn btn-secondary btn-sm"
              @click="startEdit(location)"
          >
            Edit
          </button>
          <button
              v-else
              class="btn btn-success btn-sm"
              @click="updateLocation(location.id)"
          >
            Save
          </button>
          <button
              v-if="editingId === location.id"
              class="btn btn-warning btn-sm"
              @click="cancelEdit"
          >
            Cancel
          </button>
          <button
              class="btn btn-danger btn-sm"
              @click="deleteLocation(location.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import api from "../api/axios";

const locations = ref<any[]>([]);
const newLocation = ref({code: "", name: ""});

const editingId = ref<number | null>(null);
const editLocation = ref({code: "", name: ""});

async function fetchLocations() {
  const res = await api.get("/api/v1.0/inventory/locations");
  locations.value = res.data;
}

async function addLocation() {
  await api.post("/api/v1.0/inventory/locations", newLocation.value);
  newLocation.value = {code: "", name: ""};
  fetchLocations();
}

async function deleteLocation(id: number) {
  await api.delete(`/api/v1.0/inventory/locations/${id}`);
  fetchLocations();
}

function startEdit(loc: any) {
  editingId.value = loc.id;
  editLocation.value = {code: loc.code, name: loc.name};
}

function cancelEdit() {
  editingId.value = null;
  editLocation.value = {code: "", name: ""};
}

async function updateLocation(id: number) {
  await api.put(`/api/v1.0/inventory/locations/${id}`, editLocation.value);
  editingId.value = null;
  editLocation.value = {code: "", name: ""};
  fetchLocations();
}

onMounted(fetchLocations);
</script>
