<template>
  <div id="app" class="flex flex-col min-h-screen text-gray-800 bg-gray-100">
    <!-- Navigation -->
    <nav class="py-4 bg-white shadow-md">
      <div class="container flex items-center justify-between mx-auto">
        <router-link to="/" class="text-2xl font-bold text-blue-500">
          Infokes Drive
        </router-link>
        <div>
          <label for="user-select" class="mr-2">Select User:</label>
          <select id="user-select" v-model="selectedUserId" @change="onUserChange" class="p-2 border rounded">
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.username }}
            </option>
          </select>
        </div>
      </div>
    </nav>


    <!-- Main Content -->
    <main class="container flex-grow py-8 mx-auto">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="py-4 mt-8 bg-white shadow-md">
      <div class="container mx-auto text-center text-gray-600">
        &copy; 2025 Infokes Drive. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '/src/stores/userStore';

// Pinia store
const userStore = useUserStore();

// Local state
const users = ref([]);
const selectedUserId = ref(userStore.userId); // Sync with global userId

// Fetch users on mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/users');
    users.value = response.data.data;
    if (users.value.length > 0) {
      console.log(users.value[0].id)
      selectedUserId.value = users.value[0].id;
      userStore.setUserId(users.value[0].id); // Set the default user in the store
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
});

// Update global userId when the dropdown value changes
const onUserChange = () => {
  userStore.setUserId(selectedUserId.value);
};
</script>
