/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
    base: command === 'build' ? '/design-tokens-generator/' : '/',
    plugins: [react(), tailwindcss()],
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
}));
