// sync-to-desktop.mjs
import fs from 'fs';
import path from 'path';

const SRC = 'C:\\Users\\rahul\\.gemini\\antigravity\\scratch\\TripShare-India';
const DEST = 'C:\\Users\\rahul\\OneDrive\\Desktop\\TripShare-India-completed\\TripShare-India';

function copyRecursive(srcDir, destDir, ignoreDirs = ['node_modules', '.git']) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (ignoreDirs.includes(entry.name)) {
        continue;
      }
      copyRecursive(srcPath, destPath, ignoreDirs);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Synchronizing completed codebase to Desktop folder...');
copyRecursive(SRC, DEST, ['node_modules', '.git', 'scratch']);
console.log('Codebase synchronization complete!');
