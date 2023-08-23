<template>
  <form class="mt-4 flex flex-col space-y-4" @submit.prevent="uploadImage">
    <div class="flex items-center space-x-4">
      <div class="flex items-center justify-center h-40 w-40">
        <label for="dropzone-file" class="flex flex-col items-center justify-center border-2 h-40 w-40 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50  hover:bg-gray-100">
          <div v-if="!image" class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>

            <p class="mb-2 text-sm text-gray-500">Click to upload</p>
          </div>
          
          <img v-else :src="image" class="h-40 w-40 rounded-full object-fill">

          <input ref="files" id="dropzone-file" type="file" class="hidden" @change="onFileChange" />
        </label>
      </div>
      
      <span v-if="success" class="text-green-600 font-medium">{{ success }}</span>
      <span v-if="error" class="text-red-600 font-medium">{{ error }}</span>
    </div>

    <button class="ml-auto mr-4 max-w-fit bg-blue-600 text-white rounded px-4 py-2 font-medium">Upload Image</button>
  </form>
</template>

<script setup>
const files = ref();
const image = ref();
const success = ref();
const error = ref();

function onFileChange(e) {
  const file = e.target.files[0];
  image.value = URL.createObjectURL(file);
}

async function uploadImage() {
  try {
    error.value = null;
    success.value = null;
    const formData = new FormData();
    Array.from(files.value.files).map((file, index) => formData.append(index, file));

    const { message } = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    success.value = message
  } catch (e) {
    error.value = e.statusMessage;
  }
}
</script>
