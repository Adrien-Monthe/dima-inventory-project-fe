<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 400px;">
      <h3 class="card-title text-center mb-3">Login</h3>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
              type="text"
              id="username"
              class="form-control"
              v-model="username"
              placeholder="Enter username"
              required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
              type="password"
              id="password"
              class="form-control"
              v-model="password"
              placeholder="Enter password"
              required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthStore } from "@/store/auth";
import router from "@/router";

export default defineComponent({
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");
    const error = ref("");
    const auth = useAuthStore();

    const handleLogin = async () => {
      error.value = "";
      try {
        await auth.login(username.value, password.value);
        router.push("/products");
      } catch (err: any) {
        error.value = "Invalid credentials. Please try again.";
      }
    };

    return { username, password, error, handleLogin };
  },
});
</script>
