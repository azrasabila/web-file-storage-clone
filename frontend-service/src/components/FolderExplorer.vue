<template>
    <div class="flex min-h-screen">
      <!-- Left Panel: Folder Tree -->
      <div class="w-1/3 overflow-y-auto bg-gray-100 border-r">
        <h2 class="p-4 text-lg font-bold">Folder Structure</h2>
        <ul>
          <FolderTree :folders="folderTree" @select="handleFolderSelect" />
        </ul>
      </div>
  
      <!-- Right Panel: Subfolders -->
      <div class="w-2/3 overflow-y-auto bg-white">
        <h2 class="p-4 text-lg font-bold">Subfolders</h2>
        <ul class="p-4 space-y-2">
          <li
            v-for="folder in selectedSubfolders"
            :key="folder.id"
            class="p-2 border rounded bg-gray-50"
          >
            {{ folder.name }}
          </li>
          <li v-if="selectedSubfolders.length === 0" class="text-gray-500">
            No subfolders available.
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import FolderTree from './FolderTree.vue';
  
  const folderTree = ref([]);
  const selectedSubfolders = ref([]);
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:3000/folders/all');
      folderTree.value = response.data.data;
    } catch (error) {
      console.error('Failed to load folder structure:', error);
    }
  });
  
  const handleFolderSelect = (folder) => {
    selectedSubfolders.value = folder.children || [];
  };
  </script>
  
  <style>
  /* Optional additional styling */
  </style>
  