// Photo lookup.
//  1. Your own photos in src/assets/photos/<slug>.jpg are picked up automatically.
//  2. Otherwise the photos bundled in public/images are used where they match the place.
//  3. Otherwise null, and the page shows a clearly labelled illustration instead.
const base = process.env.PUBLIC_URL || '';

export const publicImage = (file) => `${base}/images/${file}`;

const bundled = {
  kyoto: 'kyoto.jpg',
  bali: 'bali.jpg',
  'bali-temple': 'bali_temple.jpg',
  fuji: 'fuji.jpg',
  himalaya: 'everest.jpg',
  maldives: 'maldives.jpg',
  niagara: 'niagara.jpg',
};

const userPhotos = {};
try {
  // Webpack resolves this at build time. In tools without it (e.g. Jest) it throws and is skipped.
  const ctx = require.context('../assets/photos', false, /\.(jpe?g|png|webp|avif)$/i);
  ctx.keys().forEach((key) => {
    const name = key.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase();
    userPhotos[name] = ctx(key);
  });
} catch (e) {
  /* no user photos available */
}

export const photo = (slug) =>
  userPhotos[slug] || (bundled[slug] ? publicImage(bundled[slug]) : null);

// All user photos for a slug: slug.jpg, slug-1.jpg, slug-2.jpg ...
export const gallery = (slug) =>
  Object.keys(userPhotos)
    .filter((name) => name === slug || new RegExp(`^${slug}-\\d+$`).test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => userPhotos[name]);

// Unsplash photos are linked directly from images.unsplash.com (their recommended way).
// Free to use under the Unsplash License: https://unsplash.com/license
export const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
