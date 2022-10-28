import {Directus} from "@directus/sdk";

export const directus = new Directus("https://fge7lqjv.directus.app", {
    auth: {
        mode: "json",
    },
});

export const authService = {
    async login(email: string, password: string) {
        return await directus.auth.login({email, password});
    },
    async register(firstName: string, email: string, password: string): Promise<boolean> {
        const createUserResult = await directus.users.createOne({
            first_name: firstName,
            email,
            password,
            role: "eacb968a-1151-467c-8359-a4963c698c4e"
        });
        return !!createUserResult?.email;
    },
    async logout() {
        return await directus.auth.logout();
    },
    async currentUser() {
        return await directus.users.me.read({
            fields: ["email", "first_name"],
        });
    },
};
