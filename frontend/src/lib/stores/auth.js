import { writable } from 'svelte/store';
import { api } from '../api.js';

function createAuthStore() {
    const { subscribe, set, update } = writable({
        user: null,
        loading: true,
        error: null
    });

    return {
        subscribe,
        
        async init() {
            try {
                const user = await api.getMe();
                set({ user, loading: false, error: null });
            } catch {
                set({ user: null, loading: false, error: null });
            }
        },

        async login(email, password) {
            try {
                const { user } = await api.login({ email, password });
                set({ user, loading: false, error: null });
                return { success: true };
            } catch (error) {
                update(s => ({ ...s, error: error.message }));
                return { success: false, error: error.message };
            }
        },

        async register(username, email, password) {
            try {
                const { user } = await api.register({ username, email, password });
                set({ user, loading: false, error: null });
                return { success: true };
            } catch (error) {
                update(s => ({ ...s, error: error.message }));
                return { success: false, error: error.message };
            }
        },

        async logout() {
            try {
                await api.logout();
            } catch {
                // Ignore logout errors
            }
            set({ user: null, loading: false, error: null });
        },

        clearError() {
            update(s => ({ ...s, error: null }));
        }
    };
}

export const auth = createAuthStore();
