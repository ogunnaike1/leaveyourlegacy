// Compress every photo in public/images in place and write tiny blur placeholders to lib/image-blur.json.
// Run after adding or replacing images:  npm run images
// Product shots (p-*-1..4) are capped at 1600px, full-bleed/editorial images at 2400px; JPEGs are re-encoded
// with mozjpeg (quality 76, progressive, metadata stripped). Files already at or under the target are left alone.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIR = 'public/images';
const BLUR_OUT = 'lib/image-blur.json';
const isProductShot = f => /^p-.+-[1-4]\.jpg$/.test(f);

const blur = {};
let before = 0, after = 0;
for (const f of fs.readdirSync(DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
  const file = path.join(DIR, f);
  const input = fs.readFileSync(file);
  before += input.length;
  const max = isProductShot(f) ? 1600 : 2400;
  const out = await sharp(input).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true, progressive: true }).toBuffer();
  const keep = out.length < input.length ? out : input;
  if (keep !== input) fs.writeFileSync(file, keep);
  after += keep.length;
  const tiny = await sharp(keep).resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer();
  blur[f.replace(/\.[^.]+$/, '')] = 'data:image/webp;base64,' + tiny.toString('base64');
}
fs.writeFileSync(BLUR_OUT, JSON.stringify(blur, null, 0) + '\n');
console.log(`${Object.keys(blur).length} images: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB; blur placeholders → ${BLUR_OUT}`);
