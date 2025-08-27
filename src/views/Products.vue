<template>
  <div class="container mt-4">
    <h2>Products</h2>
    <button class="btn btn-primary mb-3" @click="openAddModal">+ Add Product</button>

    <table class="table table-bordered table-striped">
      <thead>
      <tr>
        <th>Name</th>
        <th>Reference</th>
        <th>Type</th>
        <th>Category</th>
        <th>Sales Price</th>
        <th>Cost</th>
        <th>Qty On Hand</th>
        <th>Forecasted Qty</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.name }}</td>
        <td>{{ product.internal_reference }}</td>
        <td>{{ getTypeName(product.product_type) }}</td>
        <td>{{ getCategoryName(product.product_category) }}</td>
        <td>{{ product.sales_price }}</td>
        <td>{{ product.cost }}</td>
        <td>{{ product.quantity_on_hand }}</td>
        <td>{{ product.forecasted_quantity }}</td>
        <td>
          <button class="btn btn-sm btn-secondary me-2" @click="openEditModal(product)">Edit</button>
          <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" ref="productModalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? "Edit Product" : "Add Product" }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body row g-3">
              <div class="col-md-6">
                <label class="form-label">Name</label>
                <input v-model="currentProduct.name" class="form-control" required/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Reference</label>
                <input v-model="currentProduct.internal_reference" class="form-control"/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Responsible</label>
                <input v-model="currentProduct.responsible" class="form-control"/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Barcode</label>
                <input v-model="currentProduct.barcode" class="form-control"/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Sales Price</label>
                <input v-model.number="currentProduct.sales_price" type="number" step="0.01" class="form-control"/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Cost</label>
                <input v-model.number="currentProduct.cost" type="number" step="0.01" class="form-control"/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Product Type</label>
                <select v-model="currentProduct.product_type" class="form-select" required>
                  <option v-for="t in productTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Product Category</label>
                <select v-model="currentProduct.product_category" class="form-select">
                  <option :value="null">None</option>
                  <option v-for="c in productCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Quantity On Hand</label>
                <input v-model.number="currentProduct.quantity_on_hand" type="number" class="form-control"/>
              </div>
              <div class="col-md-6">
                <label class="form-label">Forecasted Quantity</label>
                <input v-model.number="currentProduct.forecasted_quantity" type="number" class="form-control"/>
              </div>
              <div class="col-12">
                <label class="form-label">Activity Exception Decoration</label>
                <input v-model="currentProduct.activity_exception_decoration" class="form-control"/>
              </div>
              <div class="col-12 form-check">
                <input v-model="currentProduct.favorite" type="checkbox" class="form-check-input" id="favoriteCheck"/>
                <label for="favoriteCheck" class="form-check-label">Favorite</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? "Update" : "Add" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import api from "../api/axios";
import * as bootstrap from "bootstrap";

const products = ref<any[]>([]);
const productTypes = ref<any[]>([]);
const productCategories = ref<any[]>([]);

const isEditing = ref(false);
const currentProduct = ref<any>({
  favorite: false,
  name: "",
  internal_reference: "",
  responsible: "",
  barcode: "",
  sales_price: 0,
  cost: 0,
  product_category: null,
  product_type: null,
  quantity_on_hand: 0,
  forecasted_quantity: 0,
  activity_exception_decoration: ""
});

const productModalRef = ref<HTMLElement | null>(null);
let productModal: bootstrap.Modal;

function openAddModal() {
  isEditing.value = false;
  resetForm();
  productModal.show();
}

function openEditModal(product: any) {
  isEditing.value = true;
  currentProduct.value = {...product};
  productModal.show();
}

async function saveProduct() {
  if (isEditing.value) {
    await api.put(`/api/v1.0/inventory/products/${currentProduct.value.id}`, currentProduct.value);
  } else {
    await api.post("/api/v1.0/inventory/products", currentProduct.value);
  }
  fetchProducts();
  productModal.hide();
}

async function deleteProduct(id: number) {
  await api.delete(`/api/v1.0/inventory/products/${id}`);
  fetchProducts();
}

function resetForm() {
  currentProduct.value = {
    favorite: false,
    name: "",
    internal_reference: "",
    responsible: "",
    barcode: "",
    sales_price: 0,
    cost: 0,
    product_category: null,
    product_type: null,
    quantity_on_hand: 0,
    forecasted_quantity: 0,
    activity_exception_decoration: ""
  };
}

function getTypeName(typeId: number) {
  const type = productTypes.value.find(t => t.id === typeId);
  return type ? type.name : "";
}

function getCategoryName(categoryId: number) {
  const category = productCategories.value.find(c => c.id === categoryId);
  return category ? category.name : "";
}

async function fetchProducts() {
  const res = await api.get("/api/v1.0/inventory/products");
  products.value = res.data;
}

async function fetchProductTypes() {
  const res = await api.get("/api/v1.0/inventory/product-types");
  productTypes.value = res.data;
}

async function fetchProductCategories() {
  const res = await api.get("/api/v1.0/inventory/product-categories");
  productCategories.value = res.data;
}

onMounted(() => {
  fetchProducts();
  fetchProductTypes();
  fetchProductCategories();
  if (productModalRef.value) {
    productModal = new bootstrap.Modal(productModalRef.value);
  }
});
</script>
