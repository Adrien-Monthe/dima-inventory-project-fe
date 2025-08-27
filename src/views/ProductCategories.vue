<template>
  <div class="container mt-4">
    <h2>Product Categories</h2>

    <form @submit.prevent="addCategory" class="d-flex gap-2 mb-3">
      <input v-model="newCategory.code" placeholder="Code" required class="form-control" />
      <input v-model="newCategory.name" placeholder="Name" required class="form-control" />
      <select v-model="newCategory.parent" class="form-select">
        <option :value="null">No Parent</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <button class="btn btn-primary">Add</button>
    </form>

    <ul class="list-group">
      <li v-for="cat in categories" :key="cat.id" class="list-group-item d-flex justify-content-between align-items-center">
        <div v-if="editingId !== cat.id">
          {{ cat.name }} <small v-if="cat.parent_name">({{ cat.parent_name }})</small>
        </div>

        <div v-else class="d-flex gap-2 flex-grow-1">
          <input v-model="editCategory.code" class="form-control" />
          <input v-model="editCategory.name" class="form-control" />
          <select v-model="editCategory.parent" class="form-select">
            <option :value="null">No Parent</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="d-flex gap-2">
          <button v-if="editingId !== cat.id" class="btn btn-secondary btn-sm" @click="startEdit(cat)">Edit</button>
          <button v-else class="btn btn-success btn-sm" @click="updateCategory(cat.id)">Save</button>
          <button v-if="editingId === cat.id" class="btn btn-warning btn-sm" @click="cancelEdit">Cancel</button>
          <button class="btn btn-danger btn-sm" @click="deleteCategory(cat.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const categories = ref<any[]>([]);
const newCategory = ref({ code: "", name: "", parent: null });

const editingId = ref<number | null>(null);
const editCategory = ref({ code: "", name: "", parent: null });

async function fetchCategories() {
  const res = await api.get("/api/v1.0/inventory/product-categories");
  categories.value = res.data.map(c => ({ ...c, parent_name: c.parent_name || "" }));
}

async function addCategory() {
  await api.post("/api/v1.0/inventory/product-categories", newCategory.value);
  newCategory.value = { code: "", name: "", parent: null };
  fetchCategories();
}

async function deleteCategory(id: number) {
  await api.delete(`/api/v1.0/inventory/product-categories/${id}`);
  fetchCategories();
}

function startEdit(cat: any) {
  editingId.value = cat.id;
  editCategory.value = { code: cat.code, name: cat.name, parent: cat.parent };
}

function cancelEdit() {
  editingId.value = null;
  editCategory.value = { code: "", name: "", parent: null };
}

async function updateCategory(id: number) {
  await api.put(`/api/v1.0/inventory/product-categories/${id}`, editCategory.value);
  editingId.value = null;
  editCategory.value = { code: "", name: "", parent: null };
  fetchCategories();
}

onMounted(fetchCategories);
</script>
