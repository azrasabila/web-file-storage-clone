<template>
  <div class="container p-4 mx-auto">
    <h1 class="text-3xl font-bold">Upload File</h1>
    <form @submit.prevent="handleSubmit" class="mt-4">
      <label class="block mb-2 text-lg font-medium">Select File:</label>
      <input
        type="file"
        @change="handleFileChange"
        class="block w-full mb-4 border border-gray-300 rounded"
      />
      <button
        type="submit"
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const handleSubmit = () => {
  if (!selectedFile.value) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  fetch('http://localhost:3000/files/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('File uploaded successfully:', data);
      alert('File uploaded successfully!');
    })
    .catch((error) => {
      console.error('File upload failed:', error);
      alert('Failed to upload file.');
    });
};
</script>
