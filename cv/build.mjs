// Renders the CV (EN/ES, with or without photo) to HTML and prints it to A4 PDF with headless Edge/Chrome.
//   node cv/build.mjs            → cv/out/*.pdf (+ the .html used for each one)
// Same visual language as luitiescobar.com: Outfit + JetBrains Mono, ink on warm white, discipline dots.
// Single column with real text, so applicant tracking systems (ATS) can read it.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { contact, cv } from './content.mjs';

// phone number from the git-ignored cv/private.mjs; without it the PDFs are built without a phone
try { contact.phone = (await import('./private.mjs')).phone ?? ''; } catch { /* no private file */ }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'cv', 'out');
mkdirSync(out, { recursive: true });

const font = (pkg, file) => pathToFileURL(join(root, 'node_modules', '@fontsource', pkg, 'files', file)).href;
const photo = `data:image/jpeg;base64,${(
  await sharp(join(root, 'src', 'assets', 'images', 'profile.jpg')).resize(360, 432, { fit: 'cover', position: 'top' }).jpeg({ quality: 86 }).toBuffer()
).toString('base64')}`;

const DOTS = ['#ff8a3c', '#3a6bff', '#ff2e7a', '#3ed23e'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const months = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
};
const month = (ym, lang) => `${months[lang][Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
const period = (j, c) => `${month(j.start, c.lang)} - ${j.end ? month(j.end, c.lang) : c.labels.present}`;
const year = (j) => `${j.start.slice(0, 4)} - ${j.end.slice(0, 4)}`;

function html(c, withPhoto) {
  const L = c.labels;
  const link = (href, text) => `<a href="${href}">${esc(text)}</a>`;
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<title>${esc(contact.name)} · CV · ${esc(c.title)}</title>
<meta name="author" content="${esc(contact.name)}">
<style>
  @font-face { font-family: Outfit; font-weight: 200; src: url(${font('outfit', 'outfit-latin-200-normal.woff2')}); }
  @font-face { font-family: Outfit; font-weight: 300; src: url(${font('outfit', 'outfit-latin-300-normal.woff2')}); }
  @font-face { font-family: Outfit; font-weight: 400; src: url(${font('outfit', 'outfit-latin-400-normal.woff2')}); }
  @font-face { font-family: Outfit; font-weight: 500; src: url(${font('outfit', 'outfit-latin-500-normal.woff2')}); }
  @font-face { font-family: Mono; font-weight: 400; src: url(${font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2')}); }

  @page { size: A4; margin: 15mm 16mm 14mm; }
  :root { --ink: #141414; --ink-2: #4a4a47; --muted: #8a8a84; --line: #e2e1da; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font: 300 9.6pt/1.45 Outfit, system-ui, sans-serif; color: var(--ink-2); }
  a { color: inherit; text-decoration: none; }
  strong { font-weight: 500; color: var(--ink); }
  .mono { font-family: Mono, ui-monospace, monospace; font-size: 7.2pt; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

  header { display: flex; gap: 7mm; align-items: center; padding-bottom: 6mm; border-bottom: 1px solid var(--line); }
  .photo { width: 30mm; aspect-ratio: 5 / 6; object-fit: cover; border-radius: 4mm; flex: none; }
  h1 { font-size: 30pt; font-weight: 200; line-height: 1; letter-spacing: -.02em; color: var(--ink); }
  h1 b { font-weight: 400; }
  .role { margin-top: 2mm; font-size: 12.5pt; font-weight: 300; color: var(--ink); }
  .chips { display: flex; flex-wrap: wrap; gap: 1.6mm 4mm; margin-top: 2.6mm; font-size: 8.6pt; }
  .chips span::before { content: ''; display: inline-block; width: 1.9mm; height: 1.9mm; border-radius: 50%; margin-right: 1.4mm; background: var(--dot); vertical-align: .2mm; }
  .contact { display: flex; flex-wrap: wrap; gap: 1mm 3.2mm; margin-top: 3.4mm; font-size: 8.3pt; color: var(--ink); }
  .contact a { border-bottom: .6pt solid var(--line); }
  .avail { margin-top: 1.4mm; font-size: 8.4pt; color: var(--muted); }

  section { display: grid; grid-template-columns: 30mm 1fr; gap: 7mm; padding: 4.6mm 0; border-bottom: 1px solid var(--line); }
  section:last-of-type { border-bottom: 0; }
  h2 { padding-top: .8mm; }
  .summary p + p { margin-top: 1.6mm; }
  .summary p:first-child { font-size: 10.6pt; font-weight: 300; color: var(--ink); line-height: 1.4; }

  .job { break-inside: avoid; }
  .job + .job { margin-top: 3.8mm; }
  .job__head { display: flex; justify-content: space-between; gap: 4mm; align-items: baseline; }
  .job__title { font-size: 10.2pt; color: var(--ink); }
  .job__title strong { font-weight: 500; }
  .job__meta { white-space: nowrap; }
  .job__company { margin-top: .2mm; color: var(--ink); }
  .job__company .mono { margin-left: .6mm; }
  ul { margin-top: 1.4mm; padding-left: 3.6mm; }
  li + li { margin-top: .8mm; }
  li::marker { color: var(--muted); }

  .earlier { list-style: none; padding: 0; margin: 0; }
  .earlier li { display: flex; justify-content: space-between; gap: 4mm; }
  .earlier .mono, .job__meta { white-space: nowrap; flex: none; }
  .earlier li + li { margin-top: 1.2mm; }

  dl { display: grid; grid-template-columns: 24mm 1fr; gap: 1.6mm 4mm; }
  dt { font-weight: 500; color: var(--ink); }
  .tools { color: var(--ink); line-height: 1.6; }
  .tools span:not(:last-child)::after { content: ' · '; color: var(--muted); }
  .self { margin-bottom: 2mm; }
  .training { list-style: none; padding: 0; margin: 0; }
  .training li { display: flex; justify-content: space-between; gap: 4mm; }
  .training li span:first-child { color: var(--ink); }
  .training .detail { color: var(--muted); text-align: right; white-space: nowrap; flex: none; }
  .langs { display: flex; gap: 8mm; color: var(--ink); }
  .langs span span { color: var(--muted); margin-left: 1.6mm; }
  .portfolio a { font-size: 12pt; color: var(--ink); border-bottom: .8pt solid var(--ink); }
  .portfolio p { margin-top: 1mm; }
</style>
</head>
<body>
<header>
  ${withPhoto ? `<img class="photo" src="${photo}" alt="${esc(contact.name)}">` : ''}
  <div>
    <h1>Luiti <b>Escobar</b></h1>
    <p class="role">${esc(c.title)}</p>
    <p class="chips">${c.disciplines.map((d, i) => `<span style="--dot:${DOTS[i]}">${esc(d)}</span>`).join('')}</p>
    <p class="contact">
      ${contact.phone && link(`tel:${contact.phone.replace(/\s/g, '')}`, contact.phone)}
      ${link(`mailto:${contact.email}`, contact.email)}
      ${link(`https://${contact.web}`, contact.web)}
      ${link(`https://www.${contact.linkedin}`, contact.linkedin)}
      ${link(`https://www.${contact.behance}`, contact.behance)}
    </p>
    <p class="avail">${esc(c.location)} · ${esc(c.availability)}</p>
  </div>
</header>

<section class="summary"><h2 class="mono">${L.profile}</h2><div>${c.summary.map((p) => `<p>${esc(p)}</p>`).join('')}</div></section>

<section><h2 class="mono">${L.experience}</h2><div>
${c.jobs.map((j) => `  <article class="job">
    <div class="job__head"><p class="job__title"><strong>${esc(j.role)}</strong></p><p class="job__meta mono">${period(j, c)}</p></div>
    <p class="job__company">${esc(j.company)} <span class="mono">· ${esc(j.place)}</span></p>
    <ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </article>`).join('\n')}
</div></section>

<section><h2 class="mono">${L.earlier}</h2><ul class="earlier">
${c.earlier.map((j) => `  <li><span><strong>${esc(j.role)}</strong> · ${esc(j.company)}</span><span class="mono">${year(j)}</span></li>`).join('\n')}
</ul></section>

<section><h2 class="mono">${L.skills}</h2><dl>${c.skills.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section>

<section><h2 class="mono">${L.tools}</h2><p class="tools">${c.tools.map((t) => `<span>${esc(t)}</span>`).join('')}</p></section>

<section><h2 class="mono">${L.training}</h2><div>
  <p class="self">${esc(c.selftaught)}</p>
  <ul class="training">${c.training.map(([t, d]) => `<li><span>${esc(t)}</span><span class="detail">${esc(d)}</span></li>`).join('')}</ul>
</div></section>

<section><h2 class="mono">${L.languages}</h2><p class="langs">${c.languages.map(([n, l]) => `<span>${esc(n)}<span>${esc(l)}</span></span>`).join('')}</p></section>

<section class="portfolio"><h2 class="mono">${L.portfolio}</h2><div>${link(`https://${contact.web}${c.lang === 'es' ? '/es/' : '/'}`, contact.web)}<p>${esc(c.portfolioNote)}</p></div></section>
</body>
</html>`;
}

const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => existsSync(p));
if (!browser) throw new Error('Edge or Chrome is needed to print the PDFs');

const variants = [
  { lang: 'en', photo: true, file: 'LuitiEscobar_CV_EN' },
  { lang: 'en', photo: false, file: 'LuitiEscobar_CV_EN_no-photo' },
  { lang: 'es', photo: true, file: 'LuitiEscobar_CV_ES' },
  { lang: 'es', photo: false, file: 'LuitiEscobar_CV_ES_sin-foto' },
];

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
/** Edge on Windows may hand the job to a background process and return early: wait for a finished file */
function waitForFile(file, timeout = 60_000) {
  let last = -1;
  for (const until = Date.now() + timeout; Date.now() < until; sleep(400)) {
    const size = existsSync(file) ? statSync(file).size : -1;
    if (size > 0 && size === last) return;
    last = size;
  }
  throw new Error(`Timed out waiting for ${file}`);
}

// a throwaway profile keeps the headless browser apart from any open Edge window
const profile = mkdtempSync(join(tmpdir(), 'cv-print-'));
for (const v of variants) {
  const page = join(out, `${v.file}.html`);
  const pdf = join(out, `${v.file}.pdf`);
  writeFileSync(page, html(cv[v.lang], v.photo));
  rmSync(pdf, { force: true });
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`, '--no-pdf-header-footer', '--allow-file-access-from-files', `--print-to-pdf=${pdf}`, pathToFileURL(page).href], { stdio: 'ignore' });
  waitForFile(pdf);
  const pages = (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`${v.file}.pdf · ${pages} page${pages === 1 ? '' : 's'}`);
}
rmSync(profile, { recursive: true, force: true });
