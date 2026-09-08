import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// Optional QA runner: use the host's Playwright installation, not a production dependency.
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
const origin = 'http://127.0.0.1:4173';
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
const originalLoads=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('request',request=>{if(/\/assets\/.*\.(?:jpg|jpeg|png|mp4)(?:\?|$)/i.test(request.url())) originalLoads.push(request.url());});
const report={routes:[],interactions:[],consoleErrors:errors,originalPhotoRequests:originalLoads};
await mkdir('artifacts',{recursive:true});
try {
  for(const width of [320,390,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    for(const route of ['index.html','gallery.html','animals.html','cars.html','portraits.html','contact.html']) {
      const response=await page.goto(`${origin}/${route}`);
      assert.equal(response.status(),200);
      await page.waitForFunction(()=>[...document.images].filter(i=>i.loading==='eager').every(i=>i.complete&&i.naturalWidth>0));
      await page.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}).every(i=>i.complete&&i.naturalWidth>0));
      const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&!i.hidden&&i.loading!=='lazy').length}));
      assert.ok(layout.scrollWidth<=width+1,`${route} overflows at ${width}px: ${JSON.stringify(layout)}`);
      assert.equal(layout.main,1);assert.equal(layout.h1,1);assert.equal(layout.broken,0);
      report.routes.push({route,width,status:'pass'});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin);
  const toggle=page.locator('.menu-toggle');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  assert.equal(await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link').count(),7);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Home');
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  assert.equal(await toggle.evaluate(el=>el===document.activeElement),true);
  report.interactions.push('Mobile menu opens, exposes all categories, tabs into links and closes with Escape/focus return.');

  await page.goto(`${origin}/portraits.html`);
  const first=page.locator('[data-lightbox]').first();
  await first.focus();await page.keyboard.press('Enter');
  const modal=page.getByRole('dialog');
  await page.waitForFunction(()=>document.querySelector('#lightbox-stage img')?.naturalWidth>0);
  assert.equal(await modal.isVisible(),true);
  assert.equal(await page.locator('#lightbox-prev').isDisabled(),true);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('#lightbox-count').textContent(),/02 \/ 59/);
  for(let i=0;i<6;i++) {await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.querySelector('#lightbox').contains(document.activeElement)),true);}
  await page.keyboard.press('Escape');
  assert.equal(await first.evaluate(el=>el===document.activeElement),true);
  report.interactions.push('Lightbox keyboard open, next image, disabled first boundary, focus containment, Escape and trigger focus return.');

  // Force a missing optimized image in the viewer, then retry successfully.
  const large=await first.getAttribute('href');
  await page.route(`**/${large}`,route=>route.abort());
  await first.click();
  await page.getByRole('button',{name:'Retry',exact:true}).waitFor();
  await page.unroute(`**/${large}`);
  await page.getByRole('button',{name:'Retry',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#lightbox-status').hidden);
  await page.keyboard.press('Escape');
  report.interactions.push('Viewer image failure gives a working retry without loading an original.');

  await page.goto(`${origin}/contact.html`);
  const fillForm=async()=>{await page.getByLabel('Name *',{exact:true}).fill('QA Visitor');await page.getByLabel('Email *',{exact:true}).fill('qa@example.com');await page.getByLabel('Your message *',{exact:true}).fill('A local verification message. No real email should be sent.');};
  await fillForm();
  // Missing configuration path is exercised against the actual local handler.
  const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/contact'));
  await page.getByRole('button',{name:'Send enquiry'}).click();
  assert.equal((await responsePromise).status(),503);
  await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('Instagram'));
  assert.equal(await page.getByLabel('Name *',{exact:true}).inputValue(),'QA Visitor');
  assert.equal(await page.getByRole('button',{name:'Send enquiry'}).isEnabled(),true);
  await page.route('**/api/contact',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Test provider accepted this enquiry.'})}));
  await page.getByRole('button',{name:'Send enquiry'}).click();
  await page.waitForFunction(()=>document.querySelector('#form-status').textContent==='Test provider accepted this enquiry.');
  assert.equal(await page.getByLabel('Name *',{exact:true}).inputValue(),'');
  await page.unroute('**/api/contact');
  await fillForm();
  await page.route('**/api/contact',route=>route.abort());
  await page.getByRole('button',{name:'Send enquiry'}).click();
  await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('Could not connect'));
  assert.equal(await page.getByLabel('Name *',{exact:true}).inputValue(),'QA Visitor');
  await page.unroute('**/api/contact');
  report.interactions.push('Real unconfigured 503, mocked accepted response, and network failure: truthful status, retry enabled, inputs retained on failure. No email sent.');

  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  report.interactions.push('Reduced motion disables smooth scrolling.');
  const noJS=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await noJS.goto(origin);
  assert.equal(await noJS.getByRole('navigation',{name:'Main navigation'}).isVisible(),true);
  assert.equal(await noJS.getByRole('navigation',{name:'Main navigation'}).getByRole('link').count(),7);
  await noJS.goto(`${origin}/gallery.html`);
  assert.equal(await noJS.locator('[data-lightbox]').count(),83);
  await noJS.close();
  report.interactions.push('Without JavaScript all navigation and 83 Gallery photo links remain available; the requested tile is absent.');

  for(const [name,width,height,route] of [['home-desktop',1440,1000,'index.html'],['home-mobile',390,844,'index.html'],['gallery-desktop',1440,1000,'animals.html'],['contact-mobile',390,844,'contact.html']]) {
    await page.setViewportSize({width,height});await page.goto(`${origin}/${route}`);
    await page.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}).every(i=>i.complete&&i.naturalWidth>0));
    if(route==='index.html') {
      const total=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<total;y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(40);}
      await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
      await page.evaluate(()=>scrollTo(0,0));
    }
    await page.screenshot({path:`artifacts/${name}.png`,fullPage:route==='index.html'});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(originalLoads,[]);
  await writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2)+'\n');
  console.log(`PASS: ${report.routes.length} route/viewport checks; ${report.interactions.length} interaction groups; no JS errors or original-photo requests.`);
} finally {await browser.close();}
