<template>
  <div id="app" class="flex flex-col min-h-screen text-gray-800 bg-gray-100">
    <!-- Navigation -->
    <nav class="py-4 bg-white shadow-md">
      <div class="container flex items-center justify-between mx-auto">
        <router-link to="/" class="text-2xl font-bold text-blue-500">
          File Explorer
        </router-link>
        <ul class="flex space-x-4">
          <li>
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-500"
              active-class="font-semibold"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/upload"
              class="text-gray-700 hover:text-blue-500"
              active-class="font-semibold"
            >
              Upload
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container flex-grow py-8 mx-auto">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="py-4 mt-8 bg-white shadow-md">
      <div class="container mx-auto text-center text-gray-600">
        &copy; 2025 File Explorer. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
// No logic needed for this basic layout
</script>

<style>
/* Optional global styles */
</style>
