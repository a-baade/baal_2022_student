<script setup lang="ts">
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent} from "@ionic/vue";
import CampingSpotImage from "@/components/CampingSpotImage.vue";

interface Props {
  spot: {
    id: number;
    title: string;
    description: string;
    hashtags: string[];
    image: {
      id: string;
    }
  }
}

defineProps<Props>();

</script>

<template>
  <ion-card :router-link="'/detail/' + spot.id">

    <camping-spot-image :image-id="spot.image.id"/>

    <ion-card-header>
      <ion-card-subtitle>{{ spot.hashtags }}</ion-card-subtitle>
      <ion-card-title>{{ spot.title }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      {{ spot.description }}
    </ion-card-content>

  </ion-card>
</template>

<style scoped>

</style>