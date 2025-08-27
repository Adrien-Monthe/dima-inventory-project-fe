<template>
  <div class="container mt-4">
    <h2>Product Types</h2>

    <form @submit.prevent="addProductType" class="d-flex gap-2 mb-3">
      <input v-model="newType.code" placeholder="Code" required class="form-control"/>
      <input v-model="newType.name" placeholder="Name" required class="form-control"/>
      <button class="btn btn-primary">Add</button>
    </form>

    <ul class="list-group">
      <li v-for="type in productTypes" :key="type.id"
          class="list-group-item d-flex justify-content-between align-items-center">
        <div v-if="editingId !== type.id">{{ type.code }} - {{ type.name }}</div>

        <div v-else class="d-flex gap-2 flex-grow-1">
          <input v-model="editType.code" class="form-control"/>
          <input v-model="editType.name" class="form-control"/>
        </div>

        <div class="d-flex gap-2">
          <button v-if="editingId !== type.id" class="btn btn-secondary btn-sm" @click="startEdit(type)">Edit</button>
          <button v-else class="btn btn-success btn-sm" @click="updateType(type.id)">Save</button>
          <button v-if="editingId === type.id" class="btn btn-warning btn-sm" @click="cancelEdit">Cancel</button>
          <button class="btn btn-danger btn-sm" @click="deleteType(type.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import api from "../api/axios";

const productTypes = ref<any[]>([]);
const newType = ref({code: "", name: ""});

const editingId = ref<number | null>(null);
const editType = ref({code: "", name: ""});

async function fetchProductTypes() {
  const res = await api.get("/api/v1.0/inventory/product-types");
  productTypes.value = res.data;
}

async function addProductType() {
  await api.post("/api/v1.0/inventory/product-types", newType.value);
  newType.value = {code: "", name: ""};
  fetchProductTypes();
}

async function deleteType(id: number) {
  await api.delete(`/api/v1.0/inventory/product-types/${id}`);
  fetchProductTypes();
}

function startEdit(type: any) {
  editingId.value = type.id;
  editType.value = {code: type.code, name: type.name};
}

function cancelEdit() {
  editingId.value = null;
  editType.value = {code: "", name: ""};
}

async function updateType(id: number) {
  await api.put(`/api/v1.0/inventory/product-types/${id}`, editType.value);
  editingId.value = null;
  editType.value = {code: "", name: ""};
  fetchProductTypes();
}

onMounted(fetchProductTypes);
</script>
