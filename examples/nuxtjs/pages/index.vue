<script setup lang="ts">
const { data } = await useFetch('/api/spera');

async function createFakeUser() {
  await $fetch('/api/users', {
    method: 'post',
    body: { id: 'foo' },
  });
}
</script>

<template>
  <div>
    <h1>Home page</h1>

    <button @click="createFakeUser">Create user</button>
    <!-- {{ data }} -->
  </div>
</template>
