<script setup lang="ts">
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
