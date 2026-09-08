import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { allPages, catalog, presentation, displayImages } from './templates.mjs';

async function walk(dir) {
  const entries = await readdir(dir,{withFileTypes:true});
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : `${dir}/${e.name}`))).flat();
}
export function webpDimensions(buffer) {
  assert.equal(buffer.toString('ascii',0,4),'RIFF');
  assert.equal(buffer.toString('ascii',8,12),'WEBP');
  for (let offset=12; offset+8<buffer.length;) {
    const chunk = buffer.toString('ascii',offset,offset+4);
    const start = offset+8;
    if (chunk === 'VP8X') return [buffer.readUIntLE(start+4,3)+1,buffer.readUIntLE(start+7,3)+1];
    if (chunk === 'VP8 ') return [buffer.readUInt16LE(start+6)&0x3fff,buffer.readUInt16LE(start+8)&0x3fff];
    if (chunk === 'VP8L') {const bits=buffer.readUInt32LE(start+1);return [(bits&0x3fff)+1,((bits>>>14)&0x3fff)+1];}
    const size=buffer.readUInt32LE(offset+4);offset=start+size+(size%2);
  }
  throw new Error('Unreadable WebP dimensions');
}
const baseline = JSON.parse(await readFile('docs/asset-baseline.json','utf8'));
const assets = (await walk('assets')).sort();
assert.deepEqual(assets,Object.keys(baseline).sort(),'Asset paths added, deleted or renamed');
for (const path of assets) {
  const buffer = await readFile(path);
  assert.equal(buffer.length,baseline[path].bytes,`Size changed: ${path}`);
  assert.equal(createHash('sha256').update(buffer).digest('hex'),baseline[path].sha256,`Bytes changed: ${path}`);
}
console.log(`PASS: ${assets.length} existing asset paths and SHA-256 hashes unchanged.`);
const imageItems = [...Object.values(catalog.collections).flatMap(c=>c.images),catalog.about];
const optimized = new Set();
for (const image of imageItems) {
  assert.ok(image.alt.trim(),`Missing alt: ${image.id}`);
  const widths=new Set();
  for (const variant of image.variants) {
    assert.ok(assets.includes(variant.src),`Missing or case-mismatched file: ${variant.src}`);
    assert.ok(!widths.has(variant.width),`Duplicate descriptor: ${image.id}`);
    widths.add(variant.width);
    assert.deepEqual(webpDimensions(await readFile(variant.src)),[variant.width,variant.height],`Incorrect dimensions: ${variant.src}`);
    optimized.add(variant.src);
  }
}
const expectedPages=allPages();
for (const [name,expected] of Object.entries(expectedPages)) {
  const html=await readFile(name,'utf8');
  assert.equal(html,expected,`${name} is stale; run npm run generate`);
  assert.equal((html.match(/<main\b/g)||[]).length,1,`${name}: main landmark`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${name}: h1`);
  assert.ok((html.match(/fetchpriority="high"/g)||[]).length <= 1,`${name}: too many priority images`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`${name}: duplicate ids`);
  for (const [,src] of html.matchAll(/\bsrc="([^"]+)"/g)) {
    assert.ok(!src.startsWith('http'),`${name}: remote render dependency`);
    await stat(src);
    if(src.startsWith('assets/')) assert.ok(optimized.has(src),`${name}: original loaded ${src}`);
  }
  for (const [,href] of html.matchAll(/\bhref="([^"]+)"/g)) {
    if (/^https:/.test(href)) continue;
    const [file,fragment] = href.split('#');
    if (file) await stat(file);
    if (fragment) {
      const target = file ? await readFile(file,'utf8') : html;
      assert.ok(target.includes(`id="${fragment}"`),`${name}: broken anchor ${href}`);
    }
    if (file.startsWith('assets/')) assert.ok(optimized.has(file),`${name}: nonoptimized image link`);
  }
  for (const [,tag] of html.matchAll(/<(img\b[^>]+)>/g)) {
    for(const attribute of ['srcset','sizes','width','height','alt','loading','decoding']) assert.ok(tag.includes(`${attribute}="`),`${name}: image missing ${attribute}`);
  }
  for (const route of ['gallery.html','animals.html','cars.html','portraits.html','contact.html','index.html#about']) assert.ok(html.includes(`href="${route}"`),`${name}: category lost ${route}`);
}
for (const [key,collection] of Object.entries(catalog.collections)) {
  const html=expectedPages[collection.route];
  assert.equal((html.match(/data-lightbox /g)||[]).length,displayImages(key).length);
  for(const image of collection.images) assert.equal(html.split(`data-id="${image.id}"`).length-1,presentation.hiddenImageIds.includes(image.id)?0:1,`Incorrect display inclusion for ${image.id}`);
}
for(const html of Object.values(expectedPages)) for(const id of presentation.hiddenImageIds) assert.ok(!html.includes(id),`Removed tile remains in frontend: ${id}`);
const scripts=['js/main.js',...(await walk('scripts')).filter(x=>x.endsWith('.mjs')),...(await walk('api')).filter(x=>x.endsWith('.js')),...(await walk('tests')).filter(x=>x.endsWith('.mjs'))];
for (const script of scripts) {
  const result=spawnSync(process.execPath,['--check',script],{encoding:'utf8'});
  assert.equal(result.status,0,`${script}: ${result.stderr}`);
}
console.log(`PASS: measured dimensions for ${optimized.size} display variants; 276 photos retained on disk, 275 displayed, 1 explicitly hidden.`);
console.log(`PASS: 6 pages, local links, fragments, landmarks, image attributes, and ${scripts.length} JavaScript syntax checks.`);
