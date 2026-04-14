import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

function normalizeVersion(value?: string | null): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const unquoted = raw.replace(/^['"]+|['"]+$/g, '').trim();
  if (!unquoted || unquoted === '...') return null;
  return unquoted;
}

function runGitCommand(command: string): string | null {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return normalizeVersion(output);
  } catch {
    return null;
  }
}

// Get version from environment, git tag, or package.json
function getVersion(): string {
  // 1. Environment variable (set by GitHub Actions)
  const envVersion = normalizeVersion(process.env.VERSION);
  if (envVersion) {
    return envVersion;
  }

  // 2. Try exact tag first, then nearest tag
  const exactTag = runGitCommand('git describe --tags --exact-match');
  if (exactTag) {
    return exactTag;
  }

  const nearestTag = runGitCommand('git describe --tags --abbrev=0');
  if (nearestTag) {
    return nearestTag;
  }

  // 3. Fall back to package.json version
  try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
    const packageVersion = normalizeVersion(pkg.version);
    if (packageVersion && packageVersion !== '0.0.0') {
      return packageVersion;
    }
  } catch {
    // package.json not readable
  }

  return 'dev';
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile({
      removeViteModuleLoader: true
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getVersion())
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    }
  }
});
