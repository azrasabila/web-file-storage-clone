<template>
    <ul class="ml-4">
      <li v-for="folder in folders" :key="folder.id" class="mb-2">
        <!-- Display the folder name -->
        <div class="flex items-center space-x-2">
          <button
            class="text-blue-500 hover:underline"
            @click="selectFolder(folder)"
          >
            {{ folder.name }}
          </button>
        </div>
  
        <!-- Recursively render child folders if they exist -->
        <FolderTree
          v-if="folder.children && folder.children.length > 0"
          :folders="folder.children"
          @select="selectFolder"
        />
      </li>
    </ul>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  // Props to receive the folder list
  defineProps({
    folders: {
      type: Array,
      required: true,
    },
  });
  
  // Emit event for folder selection
  const emit = defineEmits(['select']);
  
  // Emit the selected folder to the parent
  const selectFolder = (folder) => {
    emit('select', folder);
  };
  </script>
  