import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'Spera QStash Plugin',
  entry: ['./src/index.ts', './src/nextjs.ts'],
  outDir: 'dist',
  bundle: true,
  dts: true,
  format: ['esm', 'cjs'],
  target: 'es2020',
  clean: true,
});
