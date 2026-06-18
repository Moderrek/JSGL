import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'JSGL',
            fileName: (format: string) => `jsgl.${format}.js`,
        },
        sourcemap: true,
    },
    plugins: [dts({ insertTypesEntry: true })],
});
