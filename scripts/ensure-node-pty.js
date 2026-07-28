import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ptyDir = join(here, '..', 'node_modules', 'node-pty');
const binary = join(ptyDir, 'build', 'Release', 'pty.node');

if (!existsSync(ptyDir)) {
  console.log('[cloud-terminal] node-pty not installed, skipping native check');
  process.exit(0);
}

if (existsSync(binary)) {
  process.exit(0);
}

console.log('[cloud-terminal] node-pty native binary missing, rebuilding from source...');
const result = spawnSync('npx', ['node-gyp', 'rebuild'], {
  cwd: ptyDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  console.warn('[cloud-terminal] node-gyp rebuild failed. The terminal will not work until this is fixed.');
  console.warn('[cloud-terminal] Ensure python3, make, and a C++ compiler are installed, then run: (cd node_modules/node-pty && npx node-gyp rebuild)');
  process.exit(0);
}

console.log('[cloud-terminal] node-pty rebuilt successfully.');
