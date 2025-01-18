<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Left Panel: Folder Tree -->
    <div class="relative w-1/3 overflow-y-auto bg-white border-r shadow-lg">
      <h2 class="flex items-center justify-between p-4 text-xl font-bold border-b">
        Folder
        <button @click="showAddFolderPopup = true" class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
          Add Folder
        </button>
      </h2>
      <ul>
        <FolderTree :folders="folderTree" @select="handleFolderSelect" />
      </ul>
    </div>

    <!-- Right Panel: Subfolders and Files -->
    <div class="w-2/3 overflow-y-auto bg-gray-50">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold">{{ selectedFolder?.name || "No Folder Selected" }}</h2>
        <button @click="showFileUploadPopup = true" class="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
          :disabled="!selectedFolder">
          Upload File
        </button>
      </div>
      <div class="p-4 space-y-4">
        <!-- Subfolders -->
        <div>
          <h3 class="mb-2 text-lg font-semibold">Subfolders</h3>
          <ul v-if="selectedSubfolders.length > 0" class="space-y-2">
            <li v-for="folder in selectedSubfolders" :key="folder.id"
              class="flex items-center justify-between p-2 bg-white border rounded shadow"
              @click="handleFolderSelect(folder)">
              <div>
                {{ folder.name }}
              </div>
              <button @click="deleteFolder(folder.id)"
                class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                Delete
              </button>
            </li>
          </ul>
          <div v-else class="p-4 text-center text-gray-500 bg-white border rounded shadow">
            No subfolders available.
          </div>
        </div>

        <!-- Files -->
        <div>
          <h3 class="mb-2 text-lg font-semibold">Files</h3>
          <ul v-if="selectedFiles.length > 0" class="space-y-2">
            <li v-for="file in selectedFiles" :key="file.id"
              class="flex items-center justify-between p-2 bg-white border rounded shadow">
              <!-- File Name and Size -->
              <div>
                {{ file.name }} ({{ file.size }} bytes)
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <!-- Download Button -->
                <button @click="downloadFile(file)"
                  class="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  Download
                </button>

                <!-- Delete Button -->
                <button @click="deleteFile(file.id)"
                  class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </li>
          </ul>

          <div v-else class="p-4 text-center text-gray-500 bg-white border rounded shadow">
            No files available.
          </div>
        </div>
      </div>
    </div>

    <!-- Add Folder Popup -->
    <div v-if="showAddFolderPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-1/3 p-6 bg-white rounded shadow-lg">
        <h3 class="mb-4 text-lg font-bold">Add New Folder</h3>
        <form @submit.prevent="addFolder">
          <label class="block mb-2 text-sm font-medium">Folder Name</label>
          <input v-model="newFolderName" type="text" class="w-full p-2 mb-4 border rounded"
            placeholder="Enter folder name" />
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showAddFolderPopup = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Add Folder
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- File Upload Popup -->
    <div v-if="showFileUploadPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-1/3 p-6 bg-white rounded shadow-lg">
        <h3 class="mb-4 text-lg font-bold">Upload File</h3>
        <form @submit.prevent="uploadFile">
          <label class="block mb-2 text-sm font-medium">Select File</label>
          <input type="file" @change="handleFileSelect" class="w-full p-2 mb-4 border rounded" />
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showFileUploadPopup = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '/src/stores/userStore';
import FolderTree from '/src/components/FolderTree.vue';

// Pinia store
const userStore = useUserStore();

// State variables
const folderTree = ref([]); // Complete folder tree
const selectedFolder = ref(null); // Currently selected folder
const selectedSubfolders = ref([]); // Subfolders of the selected folder
const selectedFiles = ref([]); // Files of the selected folder
const showAddFolderPopup = ref(false);
const showFileUploadPopup = ref(false); // Popup visibility for uploading file
const selectedFile = ref(null); // The selected file for upload
const newFolderName = ref(''); // The name of the new folder to be created

onMounted(async () => {
  if (userStore.userId) {
    await fetchFolders(userStore.userId);
  }
});

const addFolder = async () => {
  if (!newFolderName.value.trim() || !userStore.userId) {
    alert('Please provide a valid folder name and ensure a user is selected.');
    return;
  }

  try {
    const parentId = selectedFolder.value ? selectedFolder.value.id : null; // Determine the parent folder ID

    const response = await axios.post('http://localhost:3000/folders', {
      name: newFolderName.value,
      userId: userStore.userId,
      parentId: parentId ?? '',
    });

    const newFolder = response.data.data;

    // Update the folder tree
    if (parentId) {
      selectedFolder.value.children = [...(selectedFolder.value.children || []), newFolder];
      selectedSubfolders.value.push(newFolder);
    } else {
      folderTree.value.push(newFolder);
    }

    alert('Folder added successfully');
    newFolderName.value = ''; // Reset folder name input
    showAddFolderPopup.value = false; // Close the popup
  } catch (error) {
    console.error('Failed to add folder:', error);
    alert('Error adding folder. Please try again.');
  }
};

// Watch for changes in the userId and fetch folders
watch(() => userStore.userId, async (newUserId) => {
  if (newUserId) {
    await fetchFolders(newUserId);
  }
});

// Fetch folders for the provided userId
const fetchFolders = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3000/folders/all?userId=${userId}`);
    folderTree.value = response.data.data;
    selectedFolder.value = null; // Reset selected folder
    selectedSubfolders.value = [];
    selectedFiles.value = [];
  } catch (error) {
    console.error('Failed to fetch folders:', error);
  }
};

// Handle folder selection
const handleFolderSelect = (folder) => {
  selectedFolder.value = folder;
  selectedSubfolders.value = folder.children || [];
  selectedFiles.value = folder.files || [];
};

// Handle file selection
const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

// Upload the selected file
const uploadFile = async () => {
  if (!selectedFile.value || !selectedFolder.value || !userStore.userId) {
    alert('Please select a user, folder, and file before uploading.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('folderId', selectedFolder.value.id);
    formData.append('userId', userStore.userId);

    const response = await axios.post('http://localhost:3000/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'folder-id': selectedFolder.value.id,
        'user-id': userStore.userId
      },
    });

    alert('File uploaded successfully');
    selectedFiles.value.push(response.data); // Add the uploaded file to the list
    showFileUploadPopup.value = false;
    selectedFile.value = null;
  } catch (error) {
    console.error('Failed to upload file:', error);
    alert('Error uploading file. Please try again.');
  }
};

const downloadFile = async (file) => {
  try {
    const response = await axios.get(`http://localhost:3000/files/${file.id}/download`, {
      responseType: 'blob', // Set response type to blob for file download
    });

    // Create a temporary link element for downloading the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name); // Set file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download file:', error);
    alert('Error downloading file. Please try again.');
  }
};

const deleteFile = async (fileId) => {
  if (!confirm('Are you sure you want to delete this file?')) {
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/files/${fileId}`);

    // Remove the file from the UI
    selectedFiles.value = selectedFiles.value.filter((file) => file.id !== fileId);
    alert('File deleted successfully');
  } catch (error) {
    console.error('Failed to delete file:', error);
    alert('Error deleting file. Please try again.');
  }
};

const deleteFolder = async (folderId) => {
  if (!confirm('Are you sure you want to delete this folder?')) {
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/folders/${folderId}`);

    // Remove the file from the UI
    selectedFiles.value = selectedSubfolders.value.filter((folder) => folder.id !== folderId);
    alert('Folder deleted successfully');
  } catch (error) {
    console.error('Failed to delete folder:', error);
    alert('Error deleting folder. Please try again.');
  }
};

</script>
