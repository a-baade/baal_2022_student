import {createRouter, createWebHistory} from "@ionic/vue-router";
import {RouteRecordRaw} from "vue-router";
import HomePage from "../views/HomePage.vue";
import DetailPage from "@/views/DetailPage.vue";
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import NewCampSpotPage from "@/views/NewCampSpotPage.vue";
import {authService} from "@/services/directus.service";
import {toastController} from "@ionic/vue";

const authenticationRequiredRouteGuard = async () => {
    const userAccessToken = localStorage.getItem("auth_token");

    if (!userAccessToken) {
        return {name: "Login"}
    }
    const userAccessTokenExpiresAt = localStorage.getItem("auth_expires_at") as unknown as number;

    if (userAccessTokenExpiresAt < new Date().getTime()) {

        const errorToast = await toastController.create({
            message: "Brukersesjon er utløpt – logg inn på nytt",
            duration: 3000,
            color: "warning"
        });

        await errorToast.present();

        await authService.logout();
        return {name: "Login"}
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/home",
        name: "Home",
        component: HomePage,
        beforeEnter: [authenticationRequiredRouteGuard]
    },
    {
        path: "/authentication",
        name: "Login",
        component: AuthenticationPage,
    },
    {
        path: "/new-spot",
        name: "NewCampSpot",
        component: NewCampSpotPage,
        beforeEnter: [authenticationRequiredRouteGuard]
    },
    {
        path: "/detail/:id",
        name: "Detail",
        component: DetailPage,
        beforeEnter: [authenticationRequiredRouteGuard]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
