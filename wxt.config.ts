import { defineConfig } from 'wxt';
import angular from '@analogjs/vite-plugin-angular';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    vite: () => ({
        resolve: {
            mainFields: ['module'],  // ESM優先                                             
        },
        plugins: [
            angular({
                tsconfig: 'tsconfig.app.json',
                // Angular変換対象を限定（popup以外はプレーンTS）                             
                transformFilter: (_code: string, id: string) => {
                    return id.includes('/entrypoints/popup/');
                },
            }),
            tailwindcss(),
        ],
    }),
});    