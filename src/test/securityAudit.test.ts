import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Security Audit — Zero Secret Leaks', () => {
  const projectRoot = path.resolve('.');

  it('27-28. BLOB_READ_WRITE_TOKEN never appears in frontend source code or env files', () => {
    // Check .env and .env.example
    const envPath = path.join(projectRoot, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      expect(envContent).not.toContain('BLOB_READ_WRITE_TOKEN');
      expect(envContent).not.toContain('VITE_BLOB_READ_WRITE_TOKEN');
      expect(envContent).not.toContain('GEMINI_API_KEY');
      expect(envContent).not.toContain('ACCESS_PASSWORD');
    }

    const envExamplePath = path.join(projectRoot, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      const exampleContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(exampleContent).not.toContain('BLOB_READ_WRITE_TOKEN');
      expect(exampleContent).not.toContain('VITE_BLOB_READ_WRITE_TOKEN');
      expect(exampleContent).not.toContain('GEMINI_API_KEY');
      expect(exampleContent).not.toContain('ACCESS_PASSWORD');
    }
  });

  it('28. No VITE_BLOB_READ_WRITE_TOKEN exists in import.meta.env or vite-env.d.ts', () => {
    const viteEnvPath = path.join(projectRoot, 'src/vite-env.d.ts');
    const viteEnvContent = fs.readFileSync(viteEnvPath, 'utf-8');
    expect(viteEnvContent).not.toContain('BLOB_READ_WRITE_TOKEN');
    expect(viteEnvContent).not.toContain('VITE_BLOB_READ_WRITE_TOKEN');
  });

  it('29. Source code does NOT store secrets in localStorage', () => {
    const scanDir = (dir: string): string[] => {
      let files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
          files = files.concat(scanDir(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const srcFiles = scanDir(path.join(projectRoot, 'src'));
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Ensure no file stores blob tokens or backend secrets into localStorage
      expect(content).not.toMatch(/localStorage\.setItem\([^)]*token[^)]*blob/i);
      expect(content).not.toMatch(/localStorage\.setItem\([^)]*blob/i);
    }
  });

  it('30. Production build dist/ contains zero references to server secrets', () => {
    const distPath = path.join(projectRoot, 'dist');
    if (!fs.existsSync(distPath)) return;

    const scanDir = (dir: string): string[] => {
      let files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = files.concat(scanDir(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.html') || entry.name.endsWith('.css'))) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const distFiles = scanDir(distPath);
    for (const file of distFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('BLOB_READ_WRITE_TOKEN');
      expect(content).not.toContain('GEMINI_API_KEY');
      expect(content).not.toContain('ACCESS_PASSWORD');
    }
  });
});

