<template>
  <div class="container mt-4">
    <h2>Vendors</h2>

    <button class="btn btn-primary mb-3" @click="openModal()">Add Vendor</button>

    <table class="table table-bordered">
      <thead>
      <tr>
        <th>Name</th>
        <th>Is Company</th>
        <th>Address</th>
        <th>City</th>
        <th>Country</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="vendor in vendors" :key="vendor.id">
        <td>{{ vendor.name }}</td>
        <td>{{ vendor.is_company ? "Yes" : "No" }}</td>
        <td>{{ vendor.street }} {{ vendor.zip_code }}</td>
        <td>{{ vendor.city }}</td>
        <td>{{ vendor.country }}</td>
        <td class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" @click="openModal(vendor)">Edit</button>
          <button class="btn btn-danger btn-sm" @click="deleteVendor(vendor.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="vendorModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveVendor">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingId ? "Edit" : "Add" }} Vendor</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Is Company</label>
                <input type="checkbox" v-model="form.is_company" />
              </div>
              <div class="mb-3">
                <label class="form-label">Street</label>
                <input v-model="form.street" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">City</label>
                <input v-model="form.city" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Country</label>
                <input v-model="form.country" class="form-control" />
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

const vendors = ref<any[]>([]);
const editingId = ref<number | null>(null);

const form = ref<any>({
  name: "",
  is_company: false,
  street: "",
  city: "",
  country: "",
});

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: bootstrap.Modal | null = null;

onMounted(async () => {
  await fetchVendors();
  if (modalRef.value) {
    modalInstance = new bootstrap.Modal(modalRef.value);
  }
});

async function fetchVendors() {
  const res = await api.get("/api/v1.0/inventory/vendors");
  vendors.value = res.data;
}

function openModal(vendor?: any) {
  if (vendor) {
    editingId.value = vendor.id;
    form.value = { ...vendor };
  } else {
    editingId.value = null;
    form.value = { name: "", is_company: false, street: "", city: "", country: "" };
  }
  modalInstance?.show();
}

function closeModal() {
  modalInstance?.hide();
}

async function saveVendor() {
  if (editingId.value) {
    await api.put(`/api/v1.0/inventory/vendors/${editingId.value}`, form.value);
  } else {
    await api.post("/api/v1.0/inventory/vendors", form.value);
  }
  closeModal();
  await fetchVendors();
}

async function deleteVendor(id: number) {
  await api.delete(`/api/v1.0/inventory/vendors/${id}`);
  await fetchVendors();
}
</script>
