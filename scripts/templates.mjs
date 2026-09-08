import { readFileSync } from 'node:fs';

export const catalog = JSON.parse(readFileSync(new URL('../data/images.json', import.meta.url), 'utf8'));
export const collections = catalog.collections;
export const presentation = JSON.parse(readFileSync(new URL('../data/presentation.json', import.meta.url), 'utf8'));
export const displayImages = key => collections[key].images.filter(image => !presentation.hiddenImageIds.includes(image.id));
export const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const instagram = 'https://www.instagram.com/lxy_visuals/';
const nav = [['index.html','Home'],['gallery.html','Photography Gallery'],['animals.html','Wildlife'],['cars.html','Cars'],['portraits.html','Portraits'],['index.html#about','About'],['contact.html','Contact']];
const links = (active, list = nav) => list.map(([href,label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('\n');
const brand = `<a class="brand" href="index.html" aria-label="LXY Visuals — Home"><span class="brand-mark">LXY.</span><span class="brand-note">VISUALS BY<br>LAKSHYAJIT</span></a>`;
const getImage = (key, id) => collections[key].images.find(image => image.id === id);

export function picture(item, {priority = false, sizes = '(max-width: 540px) 90vw, (max-width: 800px) 44vw, 55vw', decorative = false} = {}) {
  const first = item.variants[0];
  const srcset = item.variants.map(v => `${v.src} ${v.width}w`).join(', ');
  return `<picture><img src="${first.src}" srcset="${srcset}" sizes="${sizes}" width="${first.width}" height="${first.height}" alt="${decorative ? '' : escape(item.alt)}" loading="${priority ? 'eager' : 'lazy'}" decoding="async"${priority ? ' fetchpriority="high"' : ''}></picture>`;
}

function photo(item, label, index, priority = false, sizes) {
  const large = item.variants.at(-1);
  return `<figure class="photo"><a class="photo-link" href="${large.src}" data-lightbox data-id="${item.id}" aria-label="Open photograph: ${escape(item.alt)}">${picture(item, {priority, sizes})}</a><figcaption><span>${escape(label)}</span><span>Frame ${String(index + 1).padStart(3,'0')}</span></figcaption></figure>`;
}

function footer() {
  return `<footer class="site-footer container"><div class="footer-top"><div>${brand}<p>Independent photography.<br>Chennai, India.</p></div><nav class="footer-nav" aria-label="Footer">${links('')}<a href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a></nav></div><div class="footer-wordmark" aria-hidden="true">LXY VISUALS</div><div class="footer-bottom"><span>© <span data-year>2026</span> Lakshyajit Photography</span><span>Chennai, India <time id="chennai-time"></time></span><a href="#top">Back to top ↑</a></div></footer>`;
}

function lightbox() {
  return `<dialog class="lightbox" id="lightbox" aria-label="Photograph viewer"><div class="lightbox-top"><p class="meta" id="lightbox-count"></p><button class="button" id="lightbox-close" type="button" autofocus>Close <span aria-hidden="true">×</span></button></div><div class="lightbox-stage" id="lightbox-stage"><p class="lightbox-status" id="lightbox-status" role="status" aria-live="polite"></p></div><div class="lightbox-bottom"><p id="lightbox-caption" aria-live="polite"></p><div class="lightbox-controls"><button class="button" id="lightbox-prev" type="button" aria-label="Previous photograph">← Previous</button><button class="button" id="lightbox-next" type="button" aria-label="Next photograph">Next →</button></div></div></dialog>`;
}

export function shell({title,description,route,body,className = '',viewer = false}) {
  return `<!DOCTYPE html>
<html lang="en" id="top">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#000000">
  <title>${escape(title)} | LXY Visuals</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="https://lakshyajitphotography.vercel.app/${route === 'index.html' ? '' : route}">
  <link rel="stylesheet" href="styles/main.css">
  <script src="js/main.js" defer></script>
</head>
<body class="${className}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header container">${brand}<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">Menu +</button><nav class="site-nav" id="site-navigation" aria-label="Main navigation">${links(route)}</nav></header>
<main id="main" tabindex="-1">${body}</main>
${footer()}
${viewer ? lightbox() : ''}
</body>
</html>
`;
}

function contactCTA() {
  return `<section class="contact-cta container section" id="contact" aria-label="Contact Lakshyajit"><p class="eyebrow">Have a photograph in mind?</p><a href="contact.html">LET’S MAKE IT. ${arrow}</a></section>`;
}

export function home() {
  // Gallery is a way in to the other collections, so its card counts collections, not frames.
  const cards = [['portraits','portraits_036','Portraits'],['animals','animals_020','Wildlife'],['cars','cars_005','Cars'],['gallery','gallery_010','Gallery',`${galleryEntries.length} collections`]].map(([key,id,title,label],i) => `<a class="work-card" href="${collections[key].route}"><div class="card-image">${picture(getImage(key,id),{sizes:'(max-width: 540px) 90vw, 45vw'})}<span class="card-number">0${i+1} / COLLECTION</span></div><div class="card-caption"><h3>${title}</h3><span class="meta">${label ?? `${displayImages(key).length} frames`}</span><span class="card-arrow" aria-hidden="true">↗</span></div></a>`).join('\n');
  return shell({title:'Lakshyajit Photography',description:'Portraits, wildlife and automotive photography by Lakshyajit. An independent visual journal from Chennai, India.',route:'index.html',viewer:true,body:`
  <section class="hero container" aria-labelledby="hero-title">
    <div class="hero-topline"><p class="eyebrow">An independent point of view</p><p class="meta">Chennai, India</p></div>
    <h1 class="hero-name" id="hero-title">LAKSHYAJIT</h1>
    <div class="hero-stage">${picture(getImage('cars','cars_001'),{priority:true,sizes:'92vw'})}<a href="cars.html" class="hero-label"><span class="meta">From the automotive collection</span><span class="meta">After dark. In the details. ↗</span></a></div>
    <div class="hero-bottom"><h2>PHOTOGRAPHY</h2><a class="text-link" href="#selected-work">Explore selected work <span aria-hidden="true">↓</span></a></div>
  </section>
  <div class="identity-strip meta"><span>People. Places. Passing moments.</span><span>Visuals by Lakshyajit</span><span>Look a little closer.</span></div>
  <section class="container section" id="selected-work"><div class="section-heading"><div><p class="eyebrow">01 / The collections</p><h2 class="reveal">SELECTED<br>WORK.</h2></div><p>Different subjects. The same curiosity.<br>A selection from behind the lens.</p></div><div class="work-grid">${cards}</div></section>
  <section class="container section featured"><div class="section-heading"><div><p class="eyebrow">02 / A closer look</p><h2 class="reveal">IN BETWEEN.</h2></div><a class="text-link" href="gallery.html">Photography Gallery ${arrow}</a></div><div class="featured-grid" data-gallery>${photo(getImage('animals','animals_007'),'Wildlife',6,false,'(max-width: 540px) 90vw, 38vw')}${photo(getImage('portraits','portraits_001'),'Portraits',0,false,'(max-width: 540px) 42vw, 25vw')}${photo(getImage('gallery','gallery_001'),'Gallery',0,false,'(max-width: 540px) 42vw, 30vw')}</div></section>
  <section class="about container section" id="about"><figure class="about-image">${picture(catalog.about,{sizes:'(max-width: 540px) 70vw, 38vw'})}<figcaption class="meta">Lakshyajit / Behind the lens</figcaption></figure><div class="about-copy"><p class="eyebrow">03 / The photographer</p><h2>A CAMERA.<br>A REASON<br>TO LOOK.</h2><p>My dad introduced me to a camera in 2017. I started with our birds at home. In 2021, seeing Sudhir Shivaram’s wildlife photographs brought me back to it — this time with a Canon 50D and a lot of curiosity.</p><p>Since then, it’s been friends in front of the lens, cars after dark, and whatever catches my eye along the way. My approach keeps changing. The urge to make photographs stays.</p><p>This is my ongoing collection. I’m glad you’re here.</p><div class="signature">Lakshyajit / LXY Visuals</div><a class="text-link" href="${instagram}" target="_blank" rel="noopener noreferrer">Follow the work ${arrow}</a></div></section>
  ${contactCTA()}`});
}

const collectionCopy = {
  portraits: ['People, as they are.','Faces, gestures, and the quiet space between poses. A collection of portraits made with friends and people in front of my lens.'],
  animals: ['A little patience. A closer look.','Birds, animals, and the smaller lives around us. Photographs made by slowing down and paying attention.'],
  cars: ['Form. Light. Motion.','Body lines, garage lights, and the details that give a machine its character. An automotive study.'],
  gallery: ['Notes from everywhere.','Places, textures, and passing moments. An open collection of the things that made me stop and look.']
};

export function collectionPage(key) {
  const c = collections[key];
  const sequence = ['gallery','portraits','animals','cars'];
  const next = collections[sequence[(sequence.indexOf(key) + 1) % sequence.length]];
  const items = displayImages(key);
  // Curate the opening frame; preserve stable ids and explicit display exclusions.
  const opening = {portraits:'portraits_002',animals:'animals_020',cars:'cars_001',gallery:'gallery_010'}[key];
  const firstIndex = items.findIndex(item => item.id === opening);
  items.unshift(...items.splice(firstIndex,1));
  return shell({title:c.label,description:collectionCopy[key][1],route:c.route,className:`collection-${key}`,viewer:true,body:`
  <section class="page-intro container"><p class="eyebrow">${collectionCopy[key][0]}</p><h1 class="reveal">${c.label}.</h1><div class="intro-bottom"><p>${collectionCopy[key][1]}</p><nav class="collection-nav" aria-label="Collections">${links(c.route,[['gallery.html','Gallery'],['portraits.html','Portraits'],['animals.html','Wildlife'],['cars.html','Cars']])}</nav></div></section>
  <div class="container"><div class="gallery-header meta"><span>${items.length} photographs / ${c.label}</span><span>Open a frame to explore ↗</span></div><div class="gallery-grid" data-gallery>${items.map((item,i) => photo(item,c.label,Number(item.id.split('_')[1])-1,i === 0,'(max-width: 540px) 90vw, (max-width: 800px) 44vw, 30vw')).join('\n')}</div></div>
  <section class="next-collection container"><p class="eyebrow">Next collection</p><a href="${next.route}">${next.label} ${arrow}</a></section>`});
}

// The Photography Gallery route is a way in to the other collections rather than a
// frame listing. Every Gallery photograph stays on disk and in the catalog.
const galleryEntries = [['Portraits','portraits.html','portraits','portraits_002'],['Wildlife','animals.html','animals','animals_007'],['Cars','cars.html','cars','cars_005']];

export function galleryIndexPage() {
  const c = collections.gallery;
  const frames = galleryEntries.reduce((total,[,,key]) => total + displayImages(key).length, 0);
  const cards = galleryEntries.map(([label,route,key,id],i) => `<a class="entry-card" href="${route}"><div class="entry-image">${picture(getImage(key,id),{priority:i === 0,sizes:'(max-width: 540px) 90vw, 30vw'})}<span class="card-number">0${i+1} / COLLECTION</span></div><div class="entry-caption"><h2>${label}</h2><span class="meta">${displayImages(key).length} frames</span><span class="card-arrow" aria-hidden="true">↗</span></div></a>`).join('\n');
  return shell({title:c.label,description:'Three collections by Lakshyajit: portraits, wildlife and automotive photography from Chennai, India.',route:c.route,className:'collection-gallery',body:`
  <section class="page-intro container"><p class="eyebrow">Choose a way in</p><h1 class="reveal">PHOTOGRAPHY<br>GALLERY.</h1><div class="intro-bottom"><p>Three collections, one way of looking. Start wherever the picture takes you.</p><nav class="collection-nav" aria-label="Collections">${links(c.route,[['gallery.html','Gallery'],['portraits.html','Portraits'],['animals.html','Wildlife'],['cars.html','Cars']])}</nav></div></section>
  <div class="container"><div class="gallery-header meta"><span>${galleryEntries.length} collections / ${frames} photographs</span><span>Open a collection ↗</span></div><div class="entry-grid">${cards}</div></div>
  <section class="next-collection container"><p class="eyebrow">Or start at the beginning</p><a href="index.html">Home ${arrow}</a></section>`});
}

export function contactPage() {
  return shell({title:'Contact',description:'Talk to Lakshyajit about portraits, automotive photography, collaborations and selected shoots in Chennai.',route:'contact.html',body:`
  <section class="page-intro container"><p class="eyebrow">A conversation starts here</p><h1 class="reveal">LET’S MAKE<br>SOMETHING.</h1></section>
  <div class="contact-layout container"><aside class="contact-aside"><p>For a shoot, a collaboration, or a question about a photograph. Tell me what you have in mind.</p><a class="text-link" href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram / @lxy_visuals ${arrow}</a><p class="contact-note">Based in Chennai, India.<br>Portraits · Wildlife · Cars</p></aside>
  <form class="contact-form" id="contact-form" action="/api/contact" method="post" aria-describedby="form-privacy">
    <div class="form-row"><div class="field"><label for="name">Name *</label><input id="name" name="name" autocomplete="name" placeholder="Your name" required maxlength="100"></div><div class="field"><label for="email">Email *</label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="254"></div></div>
    <div class="field"><label for="subject">What do you have in mind?</label><select id="subject" name="subject"><option>Portrait session</option><option>Automotive shoot</option><option>Wildlife project</option><option>Collaboration</option><option>Something else</option></select></div>
    <div class="field"><label for="message">Your message *</label><textarea id="message" name="message" rows="5" placeholder="The idea, the place, the details…" required minlength="10" maxlength="5000"></textarea></div>
    <div class="trap" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
    <p class="form-privacy" id="form-privacy">Your details are used only to respond to your enquiry. If the form is unavailable, you can reach me on Instagram.</p>
    <button type="submit" class="button">Send enquiry ${arrow}</button><p class="form-status" id="form-status" role="status" aria-live="polite" tabindex="-1"></p>
    <noscript><p class="form-privacy">Please use the Instagram link above to contact me. This form needs JavaScript to send and show its delivery status.</p></noscript>
  </form></div>`});
}

export function allPages() {
  return {'index.html':home(), ...Object.fromEntries(Object.keys(collections).map(key => [collections[key].route,key === 'gallery' ? galleryIndexPage() : collectionPage(key)])), 'contact.html':contactPage()};
}
