import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
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
