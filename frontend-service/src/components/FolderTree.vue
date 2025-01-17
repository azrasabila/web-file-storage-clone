<template>
    <ul>
      <li v-for="folder in folders" :key="folder.id" class="p-2">
        <button
          class="text-blue-500 hover:underline"
          @click="selectFolder(folder)"
        >
          {{ folder.name }}
        </button>
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
  
  defineProps({
    folders: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['select']);
  
  // Emit the selected folder
  const selectFolder = (folder) => {
    emit('select', folder);
  };
  </script>
  