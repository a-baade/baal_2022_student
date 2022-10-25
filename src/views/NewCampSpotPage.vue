<script setup lang="ts">
import { directus } from '@/services/directus.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonTextarea, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { add, trashOutline } from 'ionicons/icons';
import { ref } from 'vue';
//import presentToast from "@/components/PresentToast.vue";

// Keeps track of the input field for new hashtags
const newHashtagText = ref("");
const isModalOpen = ref(false);
const isUploadingCampSpot = ref(false);

// Keeps track of all data input from the user towards adding a new camp spot
const newCampSpot = ref({
    title: "",
    description: "",
    hashtags: [
        ""
    ],
    image: ""
});

var isLoading = ref(false);


// Add whatever is in the hashtag input field to the camp spot's array of hashtags
const addNewHashtag = () => {
  if (newHashtagText.value) {
    //Logic to avoid duplicate hashtags
    if (newCampSpot.value.hashtags.includes(newHashtagText.value)) {
      presentToast("Tagen finnes allerede", 1500,"bottom","danger");
    } else {
      newCampSpot.value.hashtags.push(newHashtagText.value);
    }
  }
  newHashtagText.value = ""; // reset
};

const presentToast = async (message:string, duration:number, position:'top' | 'bottom' | 'middle',color:string ) => {
  const toast = await toastController.create({
    message: message,
    duration: duration,
    position: position,
    color:color
  });

  await toast.present();
}

// Handle data POSTing
const postNewCampSpot = async () => {
    if (!newCampSpot.value.image) {
      await presentToast("Må laste opp en blide!", 1500, "top", "warning")
        return;
    }

    try {
        isUploadingCampSpot.value = true;
        const response = await fetch(newCampSpot.value.image);
        const imageBlob = await response.blob();

        const formData = new FormData();
        formData.append('file', imageBlob);
        const fileUpload = await directus.files.createOne(formData);

        if (fileUpload) {
            await directus.items('camp_spots').createOne({
                title: newCampSpot.value.title,
                description: newCampSpot.value.description,
                hashtags: newCampSpot.value.hashtags,
                comments: [],
                image: fileUpload.id
            });

          await presentToast("Teltplassen ble lastet opp!", 1500, "bottom","success")
        }

        isUploadingCampSpot.value = false;

    } catch (error) {
      await presentToast("Noe gikk galt ved opplasting av teltplass!", 2500, "bottom","danger")

        console.error(error);
        isUploadingCampSpot.value = false;
    }
}

// Open the device's camera and/or file picker UI
const triggerCamera = async () => {
    const photo = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri
    });

    if (photo.webPath) {
        newCampSpot.value.image = photo.webPath;
    }
}

// Handle (preview) image removal
const removeImagePreview = () => {
    newCampSpot.value.image = '';
}

</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>Legg til ny 🏕-plass</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <ion-list>

                <!-- Logic for file picking / using camera will be added later -->
                <ion-button @click="triggerCamera" class="image-picker" color="light">
                    Velg fil eller ta bilde 📸
                </ion-button>

                <section v-if="newCampSpot.image">
                    <ion-button @click="removeImagePreview" fill="default" class="remove-image-preview">
                        <ion-icon slot="icon-only" :icon="trashOutline" color="danger"></ion-icon>
                    </ion-button>
                    <img :src="newCampSpot.image" />
                </section>


                <ion-item>
                    <ion-label class="label-mild" position="floating">Tittel</ion-label>
                    <ion-input type="text" v-model="newCampSpot.title"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label class="label-mild" position="floating">Beskrivelse</ion-label>
                    <ion-textarea type="password" v-model="newCampSpot.description"></ion-textarea>
                </ion-item>

                <ion-item>
                    <ion-label class="label-mild" position="floating">Hashtag</ion-label>
                    <ion-input type="text" v-model="newHashtagText"></ion-input>

                    <ion-button slot="end" color="dark" size="default" @click="addNewHashtag">
                        <ion-icon :icon="add"></ion-icon>
                    </ion-button>
                </ion-item>

                <ion-item lines="none">
                    <ion-chip color="primary" v-for="tag in newCampSpot.hashtags" :key="tag">{{tag}}</ion-chip>
                </ion-item>

                <ion-button @click="postNewCampSpot" :disabled="isUploadingCampSpot" class="button-add" fill="solid"
                    color="dark" size="default">
                    <ion-spinner v-if="isUploadingCampSpot" name="dots"></ion-spinner>
                    <span v-else>Send inn 🏕</span>
                </ion-button>

            </ion-list>

        </ion-content>
    </ion-page>
</template>
    
<style scoped>
ion-content {
    --ion-background-color: #f4f4f4;
    display: flex;
}

ion-list {
    display: flex;
    flex-direction: column;
}

.label-mild {
    --color: #8a8a8a !important;
}

.image-picker {
    height: 20vh;
    margin: 10px;
    border: 2px #8a8a8a dashed;
    border-radius: 8px;
    font-size: medium;
}

.remove-image-preview {
    position: absolute;
    right: 0;
}

.button-add {
    margin-top: 50px;
    margin-left: 10px;
    margin-right: 10px;
}

ion-spinner {
  margin: 0 auto;
  width: 4em;
}
</style>