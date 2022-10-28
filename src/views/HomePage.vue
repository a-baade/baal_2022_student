<script setup lang="ts">
import {directus} from '@/services/directus.service';
import {ICampSpot, ICampSpotResponse} from '@/models/CampSpotModels';
import CampingSpotCard from '@/components/CampingSpotCard.vue';
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  RefresherCustomEvent
} from '@ionic/vue';
import {ref} from 'vue';

const campingSpots = ref<ICampSpot[]>([]);

onIonViewDidEnter(() => {
  fetchCampingSpots();
})

const refreshCampingSpotsView = async (event: RefresherCustomEvent) => {
  await fetchCampingSpots();
  event.target.complete();
}

const fetchCampingSpots = async () => {
  const response = await directus.graphql.items<ICampSpotResponse>(`
    query {
      camp_spots {
        id,
        title,
        description,
        hashtags,
        image {
          id
        },
        user_created {
          first_name
        }
      }
    }
  `);

  if (response.status === 200 && response.data) {
    campingSpots.value = [...response.data.camp_spots];
    console.log(campingSpots.value);
  }
}

</script>


<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Baal 🏕</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/new-spot">+</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="refreshCampingSpotsView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <camping-spot-card v-for="spot in campingSpots" :key="spot.id" :spot="spot"/>

    </ion-content>
  </ion-page>
</template>