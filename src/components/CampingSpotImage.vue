<script setup lang="ts">

const userAccessToken = localStorage.getItem('auth_token');

interface Props {
  imageId: string;
}

defineProps<Props>();

</script>

<template>
  <img :src="`https://fge7lqjv.directus.app/assets/${imageId}?access_token=${userAccessToken}`"/>
</template>

<style scoped>

</style>