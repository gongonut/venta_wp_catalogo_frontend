
export const AppConstants = {
    DEV_STATUS: true,
    get apiUrl(): string {
        return this.DEV_STATUS ? 'http://localhost:3000' : `https://${window.location.hostname}`;
    },
    VERSION: '1.0.0',
    // ... otras constantes
};