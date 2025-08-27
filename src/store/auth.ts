import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        access: localStorage.getItem("access") || "",
        refresh: localStorage.getItem("refresh") || "",
    }),
    actions: {
        async login(username: string, password: string) {
            const res = await api.post("/api/token", { username, password });
            this.access = res.data.access;
            this.refresh = res.data.refresh;
            localStorage.setItem("access", this.access);
            localStorage.setItem("refresh", this.refresh);
        },
        logout() {
            this.access = "";
            this.refresh = "";
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },
    },
});
