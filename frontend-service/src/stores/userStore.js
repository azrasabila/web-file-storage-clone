// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userId: null, // Currently selected user ID
  }),
  actions: {
    setUserId(id) {
      this.userId = id;
    },
  },
});
