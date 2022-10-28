import {toastController} from "@ionic/vue";

export const presentToast = async (message: string, duration: number, position: 'top' | 'bottom' | 'middle', color: string) => {
  const toast = await toastController.create({
    message: message,
    duration: duration,
    position: position,
    color: color
  });
  await toast.present();
}

