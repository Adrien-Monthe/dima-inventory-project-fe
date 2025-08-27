<template>
  <div class="container mt-4">
    <h2>Stock Moves</h2>

    <button class="btn btn-primary mb-3" @click="openModal()">Add Stock Move</button>

    <table class="table table-bordered">
      <thead>
      <tr>
        <th>Type</th>
        <th>Product</th>
        <th>Quantity</th>
        <th>From Location</th>
        <th>To Location</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="move in stockMoves" :key="move.id">
        <td>{{ move.move_type }}</td>
        <td>{{ move.product_name }}</td>
        <td>{{ move.quantity }}</td>
        <td>{{ move.from_location_name || '-' }}</td>
        <td>{{ move.to_location_name || '-' }}</td>
        <td class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" @click="openModal(move)">Edit</button>
          <button class="btn btn-danger btn-sm" @click="deleteMove(move.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="modal fade" id="stockMoveModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveMove">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingId ? "Edit" : "Add" }} Stock Move</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Move Type</label>
                <select v-model="form.move_type" class="form-control" required>
                  <option value="INBOUND">Inbound</option>
                  <option value="OUTBOUND">Outbound</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Product</label>
                <select v-model="form.product" class="form-control" required>
                  <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" v-model="form.quantity" class="form-control" min="1" required />
              </div>
              <div class="mb-3">
                <label class="form-label">From Location</label>
                <select v-model="form.from_location" class="form-control">
                  <option :value="null">--None--</option>
                  <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">To Location</label>
                <select v-model="form.to_location" class="form-control">
                  <option :value="null">--None--</option>
                  <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ editingId ? "Save" : "Add" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

const stockMoves = ref<any[]>([]);
const products = ref<any[]>([]);
const locations = ref<any[]>([]);

const editingId = ref<number | null>(null);
const form = ref<any>({
  move_type: "INBOUND",
  product: null,
  quantity: 1,
  from_location: null,
  to_location: null,
});

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: bootstrap.Modal | null = null;

onMounted(async () => {
  await fetchStockMoves();
  const productsRes = await api.get("/api/v1.0/inventory/products");
  products.value = productsRes.data;
  const locationsRes = await api.get("/api/v1.0/inventory/locations");
  locations.value = locationsRes.data;

  if (modalRef.value) {
    modalInstance = new bootstrap.Modal(modalRef.value);
  }
});

async function fetchStockMoves() {
  const res = await api.get("/api/v1.0/inventory/stock-moves");
  stockMoves.value = res.data;
}

function openModal(move?: any) {
  if (move) {
    editingId.value = move.id;
    form.value = {
      move_type: move.move_type,
      product: move.product.id,
      quantity: move.quantity,
      from_location: move.from_location?.id || null,
      to_location: move.to_location?.id || null,
    };
  } else {
    editingId.value = null;
    form.value = {
      move_type: "INBOUND",
      product: null,
      quantity: 1,
      from_location: null,
      to_location: null,
    };
  }
  modalInstance?.show();
}

function closeModal() {
  modalInstance?.hide();
}

async function saveMove() {
  if (editingId.value) {
    await api.put(`/api/v1.0/inventory/stock-moves/${editingId.value}`, form.value);
  } else {
    await api.post("/api/v1.0/inventory/stock-moves", form.value);
  }
  closeModal();
  await fetchStockMoves();
}

async function deleteMove(id: number) {
  await api.delete(`/api/v1.0/inventory/stock-moves/${id}`);
  await fetchStockMoves();
}
</script>
