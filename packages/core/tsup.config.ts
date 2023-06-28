import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'Spera Core',
  entry: ['./src/index.ts'],
  outDir: 'dist',
  bundle: true,
  dts: true,
  format: ['esm', 'cjs'],
  target: 'es2020',
  clean: true,
});
