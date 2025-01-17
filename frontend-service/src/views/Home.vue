<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Left Panel: Folder Tree -->
    <div class="relative w-1/3 overflow-y-auto bg-white border-r shadow-lg">
      <h2 class="flex items-center justify-between p-4 text-xl font-bold border-b">
        Folder Structure
        <button
          @click="showAddFolderPopup = true"
          class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Folder
        </button>
      </h2>
      <ul>
        <FolderTree :folders="folderTree" @select="handleFolderSelect" />
      </ul>
    </div>

    <!-- Right Panel: Subfolders -->
    <div class="w-2/3 overflow-y-auto bg-gray-50">
      <h2 class="p-4 text-xl font-bold border-b">Subfolders</h2>
      <div class="p-4 space-y-2">
        <div
          v-if="selectedFolder"
          class="p-2 text-gray-700 bg-white border rounded shadow"
        >
          Viewing subfolders of: <strong>{{ selectedFolder.name }}</strong>
        </div>
        <ul v-if="selectedSubfolders.length > 0" class="space-y-2">
          <li
            v-for="folder in selectedSubfolders"
            :key="folder.id"
            class="p-2 bg-white border rounded shadow hover:bg-gray-100"
          >
            {{ folder.name }}
          </li>
        </ul>
        <div
          v-else
          class="p-4 text-center text-gray-500 bg-white border rounded shadow"
        >
          No subfolders available.
        </div>
      </div>
    </div>

    <!-- Add Folder Popup -->
    <div
      v-if="showAddFolderPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow-lg">
        <h3 class="mb-4 text-lg font-bold">Add New Folder</h3>
        <form @submit.prevent="addFolder">
          <label class="block mb-2 text-sm font-medium">Folder Name</label>
          <input
            v-model="newFolderName"
            type="text"
            class="w-full p-2 mb-4 border rounded"
            placeholder="Enter folder name"
          />
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showAddFolderPopup = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FolderTree from '/src/components/FolderTree.vue';

// State variables
const folderTree = ref([]); // Complete folder tree
const selectedFolder = ref(null); // Currently selected folder
const selectedSubfolders = ref([]); // Subfolders of the selected folder
const showAddFolderPopup = ref(false); // Popup visibility
const newFolderName = ref(''); // Name of the new folder

// Fetch folder structure
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/folders/all');
    folderTree.value = response.data.data;
  } catch (error) {
    console.error('Failed to load folder structure:', error);
  }
});

// Handle folder selection
const handleFolderSelect = (folder) => {
  selectedFolder.value = folder;
  selectedSubfolders.value = folder.children || [];
};

// Add a new folder
const addFolder = async () => {
  if (!newFolderName.value.trim()) {
    alert('Folder name cannot be empty');
    return;
  }

  try {
    const parentId = selectedFolder.value ? selectedFolder.value.id : null; // Parent folder ID
    const response = await axios.post('http://localhost:3000/folders', {
      name: newFolderName.value,
      userId: 'ff353144-c717-4d38-9da9-7570e54dab8d',
      parentId,
    });

    // Update the folder tree after adding
    const newFolder = response.data;
    if (parentId) {
      selectedFolder.value.children = [
        ...(selectedFolder.value.children || []),
        newFolder,
      ];
      selectedSubfolders.value.push(newFolder);
    } else {
      folderTree.value.push(newFolder);
    }

    // Reset the form
    newFolderName.value = '';
    showAddFolderPopup.value = false;
  } catch (error) {
    console.error('Failed to add folder:', error);
    alert('Error adding folder. Please try again.');
  }
};
</script>
