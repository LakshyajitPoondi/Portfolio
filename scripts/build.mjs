import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { allPages, catalog } from './templates.mjs';

// No image processing: the build only copies existing optimized bytes to dist.
const pages = allPages();
for (const [name, content] of Object.entries(pages)) await writeFile(name, content);
if (process.argv.includes('--source-only')) {
  console.log(`Generated ${Object.keys(pages).length} static pages. Assets were not written.`);
} else {
  const target = resolve('dist');
  await mkdir(target, {recursive:true});
  for (const [name, content] of Object.entries(pages)) await writeFile(resolve(target,name),content);
  const images = [...Object.values(catalog.collections).flatMap(c => c.images), catalog.about];
  const paths = new Set(images.flatMap(image => image.variants.map(v => v.src)));
  for (const file of ['styles/main.css','js/main.js',...paths]) {
    const dest = resolve(target,file);
    await mkdir(dirname(dest),{recursive:true});
    await copyFile(file,dest);
  }
  const config = JSON.parse(await readFile('vercel.json','utf8'));
  if (config.outputDirectory !== 'dist') throw new Error('Unexpected outputDirectory');
  console.log(`Built ${Object.keys(pages).length} pages and ${paths.size} existing optimized images in dist/. No originals packaged.`);
}
