// End-to-end test of every user-facing function on the Leave Your Legacy store.
import { chromium } from 'playwright-core';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
import fs from 'fs'; fs.mkdirSync('tests/failures', { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const results = []; const pageErrors = [];
let ctx, p;
async function fresh(w = 1440, h = 900, opts = {}) {
  if (ctx) await ctx.close();
  ctx = await b.newContext({ viewport: { width: w, height: h }, ...opts });
  p = await ctx.newPage();
  p.on('pageerror', e => pageErrors.push(p.url() + ' :: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|404 \(Not Found\)|status of 400/.test(m.text())) pageErrors.push(p.url() + ' :: console ' + m.text().slice(0, 160)); });
}
async function test(name, fn) {
  try { await fn(); results.push(['PASS', name]); }
  catch (e) { results.push(['FAIL', name, e.message.split('\n')[0]]); await p.screenshot({ path: 'tests/failures/' + name.replace(/\W+/g, '_') + '.png' }).catch(() => {}); }
}
const ok = (c, m) => { if (!c) throw new Error(m); };
const go = async path => { await p.goto(BASE + path, { waitUntil: 'load' }); await p.waitForTimeout(700); };
const cartLS = () => p.evaluate(() => JSON.parse(localStorage.getItem('leaveyourlegacy.cart.v1') || '[]'));
const bagCount = async () => +(await p.textContent('header button[aria-label="Bag"] span')).trim();
const drawerOpen = () => p.$eval('aside[aria-hidden]', el => el.getAttribute('aria-hidden') === 'false').catch(() => false);
const cartDrawer = () => p.locator('aside').filter({ hasText: 'Your bag' });

await fresh();

// ---------- 1. Every page and every internal link ----------
await test('All pages load (200) and every internal link resolves', async () => {
  const seen = new Set(['/']), queue = ['/'], bad = [];
  while (queue.length) {
    const path = queue.shift();
    const r = await p.goto(BASE + path, { waitUntil: 'load' });
    if (!r || r.status() !== 200) { bad.push(path + ' → ' + (r && r.status())); continue; }
    const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
    for (let h of hrefs) {
      if (!h || h.startsWith('http') || h.startsWith('mailto') || h.startsWith('#')) continue;
      h = h.split('#')[0]; if (!h || seen.has(h)) continue;
      seen.add(h); queue.push(h);
    }
  }
  ok(!bad.length, 'bad: ' + bad.join(', '));
  ok(seen.size >= 30, 'only crawled ' + seen.size);
  console.log('   crawled', seen.size, 'URLs');
});
await test('No link points at a placeholder ("/" for non-home labels)', async () => {
  for (const path of ['/', '/shop', '/contact']) {
    await go(path);
    const bad = await p.$$eval('a[href="/"]', as => as.map(a => (a.textContent || '').trim()).filter(t => t && !/^(0\d)?home$|back to leave your legacy|^leaveyourlegacy$/i.test(t)));
    ok(!bad.length, path + ': ' + bad.join(', '));
  }
});
await test('Instagram opens externally in a new tab', async () => {
  await go('/');
  const a = await p.$('footer a:has-text("Instagram")');
  ok(a && (await a.getAttribute('target')) === '_blank' && /instagram\.com/.test(await a.getAttribute('href')), 'instagram link wrong');
});

// ---------- 2. Navigation ----------
await test('Header nav: Home first, each link navigates and underlines', async () => {
  await go('/');
  const labels = await p.$$eval('header nav a', as => as.map(a => a.textContent.trim()));
  ok(labels.join(',') === 'Home,Shop,Gym,Collections', 'order ' + labels);
  for (const [label, url, h1] of [['Shop', '/shop', 'Shop'], ['Gym', '/shop?line=gym', 'Gym'], ['Collections', '/collections', 'Collections'], ['Home', '/', null]]) {
    await p.click(`header nav a:has-text("${label}")`); await p.waitForTimeout(1200);
    ok(p.url() === BASE + url, label + ' went to ' + p.url());
    if (h1) ok((await p.textContent('h1')).trim().toLowerCase() === h1.toLowerCase(), label + ' h1');
  }
});
await test('Logo returns home; account icon opens account', async () => {
  await go('/shop');
  await p.click('header a[aria-label="Account"]'); await p.waitForTimeout(900);
  ok(p.url() === BASE + '/account', 'account → ' + p.url());
  await p.click('header a[aria-label^="Leave Your Legacy"]'); await p.waitForTimeout(900);
  ok(p.url() === BASE + '/', 'logo → ' + p.url());
});
await test('Navbar stays pinned and fills its background on scroll', async () => {
  await go('/shop');
  const a = await p.$eval('header', h => getComputedStyle(h).backgroundColor);
  await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(800);
  const r = await p.$eval('header', h => ({ top: h.getBoundingClientRect().top, bg: getComputedStyle(h).backgroundColor }));
  ok(a === 'rgba(0, 0, 0, 0)' && r.top === 0 && r.bg !== a, JSON.stringify({ a, r }));
});
await test('Collections page anchors and "Shop {collection}" links', async () => {
  await go('/collections');
  await p.click('nav a:has-text("Cardio")'); await p.waitForTimeout(800);
  ok(p.url().endsWith('#cardio'), 'anchor ' + p.url());
  await p.click('a:has-text("Shop Cardio")'); await p.waitForTimeout(1200);
  ok(p.url().includes('/shop?c=Cardio') && (await p.textContent('h1')).trim() === 'Cardio', 'shop cardio');
  ok((await p.$$('[data-item]')).length === 2, 'cardio count');
});

// ---------- 3. Search ----------
await test('Search: opens, shows bestsellers, live results, closes with Escape', async () => {
  await go('/');
  await p.click('header button[aria-label="Search"]'); await p.waitForTimeout(800);
  const input = p.locator('input[aria-label="Search products"]');
  ok(await input.evaluate(el => document.activeElement === el), 'search input not focused');
  ok((await p.$$('div[aria-hidden="false"] a[href^="/products/"]')).length === 7, 'default bestsellers');
  await input.fill('walnut'); await p.waitForTimeout(300);
  const names = await p.$$eval('div[aria-hidden="false"] a[href^="/products/"] span span:first-child', s => s.map(x => x.textContent));
  ok(names.includes('Still Rower') && names.includes('Tray Organiser'), 'walnut results ' + names);
  await input.fill('zzzz'); await p.waitForTimeout(300);
  ok(await p.isVisible('text=Nothing matches that yet'), 'no-results message');
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  ok((await p.$eval('input[aria-label="Search products"]', el => el.closest('[aria-hidden]').getAttribute('aria-hidden'))) === 'true', 'not closed');
});
await test('Search: Enter opens full results in the shop; chip clears the search', async () => {
  await go('/');
  await p.click('header button[aria-label="Search"]'); await p.waitForTimeout(700);
  await p.fill('input[aria-label="Search products"]', 'leather'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/shop?q=leather', 'url ' + p.url());
  ok((await p.textContent('h1')).trim() === 'Search', 'title');
  const n = (await p.$$('[data-item]')).length;
  ok(n === 2, 'leather results ' + n); // Form Bench (leather upholstery) + Ground Mat (leather edge)
  await p.click('button:has-text("“leather”")'); await p.waitForTimeout(900);
  ok((await p.$$('[data-item]')).length === 15 && !p.url().includes('q='), 'chip did not clear');
});
await test('Search: a single match goes straight to the product; result click opens product', async () => {
  await go('/');
  await p.click('header button[aria-label="Search"]'); await p.waitForTimeout(700);
  await p.fill('input[aria-label="Search products"]', 'towel'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/products/studio-towels', 'url ' + p.url());
  await p.click('header button[aria-label="Search"]'); await p.waitForTimeout(700);
  await p.fill('input[aria-label="Search products"]', 'mirror'); await p.waitForTimeout(300);
  await p.click('div[aria-hidden="false"] a[href="/products/arc-mirror"]'); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/products/arc-mirror', 'click url ' + p.url());
});

// ---------- 4. Shop ----------
await test('Shop: category tabs, counts and URL sync', async () => {
  await go('/shop');
  await p.click('nav button:has-text("Home")'); await p.waitForTimeout(900);
  ok((await p.$$('[data-item]')).length === 5 && p.url().includes('c=Home'), 'home tab');
  await p.click('nav button:has-text("All")'); await p.waitForTimeout(900);
  ok((await p.$$('[data-item]')).length === 15, 'all tab');
});
await test('Shop: filters (price, type, colour, availability), chips and Clear all', async () => {
  await go('/shop');
  await p.click('aside button:has-text("$1,000 – $5,000")'); await p.waitForTimeout(500);
  const n1 = (await p.$$('[data-item]')).length;
  await p.click('aside button:has-text("Made to order")'); await p.waitForTimeout(500);
  const n2 = (await p.$$('[data-item]')).length;
  ok(n1 === 6 && n2 === 0, `price ${n1} made-to-order ${n2}`);
  ok(await p.isVisible('text=Nothing fits all of that.'), 'empty state');
  await p.click('button:has-text("Clear filters")'); await p.waitForTimeout(500);
  await p.click('aside button:has-text("Walnut")'); await p.waitForTimeout(500);
  ok((await p.$$('[data-item]')).length === 3 && p.url().includes('color=Walnut'), 'walnut colour filter');
  await p.click('button:has-text("Clear all")'); await p.waitForTimeout(500);
  ok((await p.$$('[data-item]')).length === 15, 'clear all');
});
await test('Shop: sort by price both ways and by name', async () => {
  await go('/shop');
  const prices = async () => (await p.$$eval('[data-item] article > div:last-child > div:first-child span', s => s.map(x => +x.textContent.replace(/[$,]/g, ''))));
  await p.selectOption('select', 'price-asc'); await p.waitForTimeout(600);
  let a = await prices(); ok(a.every((v, i) => !i || a[i - 1] <= v), 'asc ' + a);
  await p.selectOption('select', 'price-desc'); await p.waitForTimeout(600);
  a = await prices(); ok(a.every((v, i) => !i || a[i - 1] >= v), 'desc ' + a);
  await p.selectOption('select', 'name'); await p.waitForTimeout(600);
  const names = await p.$$eval('[data-item] article > div:last-child a', s => s.map(x => x.textContent));
  ok(names.join() === [...names].sort((x, y) => x.localeCompare(y)).join(), 'name sort');
});
await test('Shop: filters survive a reload (URL state)', async () => {
  await go('/shop?c=Strength&price=' + encodeURIComponent('$250 – $1,000') + '&price=' + encodeURIComponent('$1,000 – $5,000') + '&sort=price-desc');
  ok((await p.$$('[data-item]')).length === 4 && (await p.inputValue('select')) === 'price-desc', 'url restore ' + (await p.$$('[data-item]')).length);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(700);
  ok((await p.$$('[data-item]')).length === 4, 'after reload');
});
await test('Shop: hide/show filters (desktop)', async () => {
  await go('/shop');
  await p.click('button:has-text("Hide filters")'); await p.waitForTimeout(800);
  ok(await p.isVisible('button:has-text("Show filters")'), 'toggle');
});

// ---------- 5. Add to bag everywhere ----------
await test('Product card Quick add opens the drawer and adds the item', async () => {
  await p.evaluate(() => localStorage.clear());
  await go('/shop');
  const card = p.locator('[data-item]').first();
  await card.hover(); await p.waitForTimeout(600);
  await card.locator('button:has-text("Quick add")').click(); await p.waitForTimeout(900);
  ok(await drawerOpen(), 'drawer not open');
  ok((await cartLS()).length === 1 && (await bagCount()) === 1, 'not added');
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  ok(!(await drawerOpen()), 'Escape did not close drawer');
});
await test('Bestsellers "Add to bag" adds without opening the drawer', async () => {
  await p.evaluate(() => localStorage.clear());
  await go('/');
  const btn = p.locator('section[data-screen-label="07 Bestsellers"] button:has-text("Add to bag")').first();
  await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(600);
  ok((await bagCount()) === 1 && !(await drawerOpen()), 'bestseller add');
  ok(await p.isVisible('section[data-screen-label="07 Bestsellers"] button:has-text("Added to bag ✓")'), 'confirmation label');
});
await test('Home Edit rail: Add to bag, prev/next buttons scroll the rail', async () => {
  await go('/');
  const sec = p.locator('section[data-screen-label="05 Home collection"]');
  await sec.locator('button[aria-label="Next"]').scrollIntoViewIfNeeded();
  const rail = sec.locator('[data-cursor="Drag"]');
  const x0 = await rail.evaluate(el => el.scrollLeft);
  await sec.locator('button[aria-label="Next"]').click(); await p.waitForTimeout(900);
  ok((await rail.evaluate(el => el.scrollLeft)) > x0, 'rail did not scroll');
  const before = await bagCount();
  await sec.locator('button:has-text("Add to bag")').first().click(); await p.waitForTimeout(400);
  ok((await bagCount()) === before + 1, 'home edit add');
});
await test('Product page: finish, quantity, Add to bag (line total), drawer contents', async () => {
  await p.evaluate(() => localStorage.clear());
  await go('/products/adjust-kettlebell');
  await p.click('button[aria-label="Increase"]'); await p.click('button[aria-label="Increase"]');
  ok((await p.textContent('button:has-text("Add to bag")')).includes('$662.97'), 'line total 3×220.99');
  await p.click('button:has-text("Add to bag")'); await p.waitForTimeout(900);
  ok(await drawerOpen(), 'drawer');
  const c = await cartLS(); ok(c.length === 1 && c[0].qty === 3 && c[0].color === 'Black Steel', JSON.stringify(c));
  ok((await cartDrawer().textContent()).includes('$662.97'), 'drawer subtotal');
  await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  await go('/products/form-bench');
  await p.click('button[aria-label="Tan Leather"]');
  ok((await p.textContent('text=Finish >> xpath=..')).includes('Tan Leather'), 'finish label');
  await p.click('button:has-text("Add to bag")'); await p.waitForTimeout(700);
  ok((await cartLS()).some(l => l.key === 'form-bench|Tan Leather'), 'colour carried');
});
await test('Product page: gallery views, zoom, 360° drag, accordion', async () => {
  await go('/products/form-bench');
  await p.click('button[aria-label="Detail"]'); await p.waitForTimeout(900);
  ok(await p.isVisible('span:text-is("Detail")'), 'detail label');
  const stage = p.locator('[data-cursor="Zoom"]');
  const bb = await stage.boundingBox();
  await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(500);
  ok(await p.isVisible('text=Detail · 2×'), 'zoom');
  await p.click('button[aria-label="360°"]'); await p.waitForTimeout(600);
  const s = p.locator('[data-cursor="Drag"]').first(); const sb = await s.boundingBox();
  await p.mouse.move(sb.x + 100, sb.y + 200); await p.mouse.down(); await p.mouse.move(sb.x + 250, sb.y + 200, { steps: 5 }); await p.mouse.up();
  ok(await p.isVisible('text=90°'), '360 angle');
  await p.click('button:has-text("Dimensions")'); await p.waitForTimeout(300);
  ok(await p.isVisible('text=L 132 × W 62 × H 46 cm'), 'accordion');
});
await test('Buy now adds and goes straight to checkout', async () => {
  await p.evaluate(() => localStorage.clear());
  await go('/products/vessel-bottle');
  await p.click('button:has-text("Buy now")'); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/checkout', 'url ' + p.url());
  ok((await p.textContent('aside')).includes('Vessel'), 'checkout summary');
});

// ---------- 6. Cart drawer ----------
await test('Cart drawer: + / − / Remove, subtotal, persists across reload, Checkout link', async () => {
  await p.evaluate(() => { localStorage.setItem('leaveyourlegacy.cart.v1', JSON.stringify([{ key: 'vessel-bottle|Brushed Steel', id: 'vessel-bottle', color: 'Brushed Steel', qty: 1 }, { key: 'recovery-set|Charcoal', id: 'recovery-set', color: 'Charcoal', qty: 1 }])); });
  await go('/');
  await p.click('header button[aria-label="Bag"]'); await p.waitForTimeout(900);
  const d = cartDrawer();
  ok((await d.textContent()).includes('$124.92'), 'subtotal 29.95+94.97');
  await d.locator('button[aria-label="Increase"]').first().click(); await p.waitForTimeout(300);
  ok((await d.textContent()).includes('$154.87'), 'after increase');
  await d.locator('button[aria-label="Decrease"]').first().click(); await d.locator('button[aria-label="Decrease"]').first().click(); await p.waitForTimeout(300);
  ok((await cartLS()).length === 1, 'decrease to zero removes');
  await d.locator('button:has-text("Remove")').click(); await p.waitForTimeout(300);
  ok(await d.locator('text=Your bag is empty.').isVisible(), 'empty state');
  await p.evaluate(() => localStorage.setItem('leaveyourlegacy.cart.v1', JSON.stringify([{ key: 'ground-mat|Oat', id: 'ground-mat', color: 'Oat', qty: 2 }])));
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(700);
  ok((await bagCount()) === 2, 'persist');
  await p.click('header button[aria-label="Bag"]'); await p.waitForTimeout(800);
  await cartDrawer().locator('a:has-text("Checkout")').click(); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/checkout', 'checkout link');
});
await test('Old pre-rebrand bag (halden.cart.v1) carries over', async () => {
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('halden.cart.v1', JSON.stringify([{ key: 'arc-mirror|Black Steel', id: 'arc-mirror', color: 'Black Steel', qty: 1 }])); });
  await go('/');
  ok((await bagCount()) === 1, 'legacy cart not migrated');
});

// ---------- 7. Checkout ----------
await test('Checkout: empty bag disables Place order', async () => {
  await p.evaluate(() => localStorage.clear());
  await go('/checkout');
  ok(await p.isDisabled('button:has-text("Place order")'), 'not disabled');
  ok(await p.isVisible('text=Your bag is empty.'), 'empty message');
});
await test('Checkout: discount code (invalid, then WELCOME10), shipping, totals', async () => {
  await p.evaluate(() => localStorage.setItem('leaveyourlegacy.cart.v1', JSON.stringify([{ key: 'form-bench|Black Steel', id: 'form-bench', color: 'Black Steel', qty: 1 }])));
  await go('/checkout');
  await p.fill('input[aria-label="Gift card or code"]', 'NOPE'); await p.click('button:has-text("Apply")');
  ok(await p.isVisible('text=That code isn’t recognised.'), 'invalid message');
  await p.fill('input[aria-label="Gift card or code"]', 'welcome10'); await p.click('button:has-text("Apply")'); await p.waitForTimeout(200);
  const aside = () => p.textContent('aside');
  ok((await aside()).includes('−$330') && (await aside()).includes('$2,970'), 'discount totals');
  await p.click('button:has-text("Scheduled evening slot")'); await p.waitForTimeout(200);
  ok((await aside()).includes('$3,065'), 'evening slot total');
  ok((await p.textContent('button:has-text("Place order")')).includes('$3,065'), 'button total');
});
await test('Checkout: invalid card is rejected with messages', async () => {
  const fill = async (n, v) => p.fill(`[name="${n}"]`, v);
  for (const [n, v] of [['email', 'ada@example.com'], ['firstName', 'Ada'], ['lastName', 'Lovelace'], ['address', 'Kalkbreite 4'], ['city', 'Zürich'], ['postcode', '8003'], ['cardNumber', '4242 4242 4242 4241'], ['cardExpiry', '01 / 20'], ['cardCvc', '1'], ['cardName', 'Ada Lovelace']]) await fill(n, v);
  await p.click('button:has-text("Place order")'); await p.waitForTimeout(500);
  ok(await p.isVisible('text=Enter a valid card number.') && await p.isVisible('text=Enter a valid expiry date') && await p.isVisible('text=Enter the 3 or 4 digit code.'), 'card errors');
  ok(!(await p.isVisible('text=Thank you.')), 'placed with bad card');
});
await test('Checkout: valid order is placed, bag cleared, order appears in account', async () => {
  await p.fill('[name="cardNumber"]', '4242 4242 4242 4242'); await p.fill('[name="cardExpiry"]', '12 / 30'); await p.fill('[name="cardCvc"]', '123');
  await p.click('button:has-text("Place order")'); await p.waitForTimeout(800);
  ok(await p.isVisible('h1:has-text("Thank you.")'), 'not placed');
  const no = (await p.textContent('text=/Order LYL-\\d{6}/')).trim().replace('Order ', '');
  ok((await cartLS()).length === 0, 'cart not cleared');
  await p.click('a:has-text("View your orders")'); await p.waitForTimeout(1200);
  const art = await p.textContent(`[data-order="${no}"]`);
  ok(art.includes('Form Bench') && art.includes('WELCOME10') && art.includes('$3,065') && art.includes('Ada Lovelace'), 'account order ' + art);
});
await test('Checkout: bank transfer and Pay in 3 need no card', async () => {
  await p.evaluate(() => localStorage.setItem('leaveyourlegacy.cart.v1', JSON.stringify([{ key: 'tray-organiser|Walnut', id: 'tray-organiser', color: 'Walnut', qty: 1 }])));
  await go('/checkout');
  await p.click('button:has-text("Bank transfer")');
  ok(await p.isVisible('text=We will email bank details'), 'bank note');
  for (const [n, v] of [['email', 'b@example.com'], ['firstName', 'B'], ['lastName', 'C'], ['address', 'X 1'], ['city', 'Y'], ['postcode', '1000']]) await p.fill(`[name="${n}"]`, v);
  await p.click('button:has-text("Place order")'); await p.waitForTimeout(800);
  ok(await p.isVisible('h1:has-text("Thank you.")'), 'bank order');
});

// ---------- 8. Forms ----------
await test('Newsletter: rejects a bad address, accepts a good one', async () => {
  await go('/shop');
  const f = p.locator('footer form');
  await f.locator('input').fill('not-an-email'); await f.locator('button').click(); await p.waitForTimeout(800);
  ok(await p.isVisible('footer [role="alert"]'), 'no error shown');
  await f.locator('input').fill('reader@example.com'); await f.locator('button').click(); await p.waitForTimeout(1000);
  ok(await p.isVisible('text=Thank you. The next letter is on its way to reader@example.com.'), 'no thanks');
});
await test('Contact: validation errors, then successful send with reference', async () => {
  await go('/contact?topic=Returns');
  ok((await p.inputValue('select[name="topic"]')) === 'Returns', 'topic from URL');
  await p.click('button:has-text("Send message")'); await p.waitForTimeout(800);
  ok(await p.isVisible('text=Please tell us your name.') && await p.isVisible('text=Please enter a valid email address.'), 'errors');
  await p.fill('[name="name"]', 'Ada Lovelace'); await p.fill('[name="email"]', 'ada@example.com'); await p.fill('[name="message"]', 'I would like to return my towels, please.');
  await p.click('button:has-text("Send message")'); await p.waitForTimeout(1000);
  ok(await p.isVisible('text=Thank you, Ada.') && await p.isVisible('text=/reference MSG-/'), 'not sent');
});
await test('Returns page links to the contact form with topic preset', async () => {
  await go('/returns');
  await p.click('a:has-text("contact form")'); await p.waitForTimeout(1200);
  ok(p.url().includes('/contact?topic=Returns'), p.url());
});

// ---------- 9. Mobile ----------
await fresh(390, 844, { hasTouch: true, isMobile: true });
await test('Mobile: menu opens, navigates, closes; scroll locked while open', async () => {
  await go('/');
  await p.click('button:has-text("Menu")'); await p.waitForTimeout(900);
  ok((await p.evaluate(() => document.documentElement.style.overflow)) === 'hidden', 'scroll not locked');
  await p.click('nav a:has-text("Collections")'); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/collections', 'menu nav ' + p.url());
  ok((await p.evaluate(() => document.documentElement.style.overflow)) === '', 'scroll still locked');
});
await test('Mobile: product cards show a persistent Add to bag (touch)', async () => {
  await p.evaluate(() => localStorage.clear());
  await go('/shop');
  await p.locator('[data-item] button:has-text("Add to bag")').first().click(); await p.waitForTimeout(600);
  ok((await cartLS()).length === 1, 'touch add');
});
await test('Mobile: filter sheet opens and "Show N products" closes it', async () => {
  await go('/shop');
  await p.click('button:has-text("Filter")'); await p.waitForTimeout(900);
  await p.click('aside button:has-text("Under $250")'); await p.waitForTimeout(400);
  const btn = p.locator('button:has-text("Show")'); const txt = await btn.textContent();
  ok(/Show 6 products/.test(txt), txt);
  await btn.click(); await p.waitForTimeout(900);
  ok((await p.$$('[data-item]')).length === 6, 'filter applied');
});
await test('Mobile: search from header', async () => {
  await go('/');
  await p.click('header button[aria-label="Search"]'); await p.waitForTimeout(700);
  await p.fill('input[aria-label="Search products"]', 'rower'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  ok(p.url() === BASE + '/products/still-rower', p.url());
});

await b.close();
const fails = results.filter(r => r[0] === 'FAIL');
for (const r of results) console.log(r[0] === 'PASS' ? '  ✓' : '  ✗', r[1], r[2] ? '— ' + r[2] : '');
console.log(`\n${results.length - fails.length}/${results.length} passed`);
console.log('page errors:', pageErrors.length ? '\n  ' + [...new Set(pageErrors)].join('\n  ') : 'none');
