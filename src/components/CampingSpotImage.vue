<script setup lang="ts">

const userAccessToken = localStorage.getItem('auth_token');

defineProps(["imageId"]);

</script>

<template>
 <img :src="`https://fge7lqjv.directus.app/assets/${imageId}?access_token=${userAccessToken}`" />
</template>

<style scoped>

</style>