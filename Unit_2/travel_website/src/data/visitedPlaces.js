import { photo, galleryEntries, unsplash } from './photos';

// MY JOURNEYS: places I have actually visited.
// Facts about the destinations are general. Anything personal is optional and is only shown once
// you fill it in:
//   date:        'March 2024'              shown in the location facts
//   travelledWith: 'Family'                shown in the location facts
//   reflection:  { text: 'What it meant…' }  shown as a personal quote near the end of the page
//
// TO ADD A JOURNEY: copy one object, change the `id`, and fill in the fields. Photos named
// <id>.jpg, <id>-1.jpg ... dropped into src/assets/photos are picked up automatically.
// Set `ownPhotos: true` once the photos are YOURS so the site stops labelling them as stock.

const ownTada = photo('tada');

const munnarCaptions = {
  munnar: 'Terraced tea plantations rolling into the mist',
  'munnar-1': 'Sunrise over layered green ridges',
  'munnar-2': 'Golden light across the tea terraces',
  'munnar-3': 'Clouds drifting below a rocky peak',
  'munnar-4': 'Sunrise above a sea of cloud',
  'munnar-5': 'A tea plantation under a grey sky',
};

const munnarGallery = galleryEntries('munnar').map((e, i) => ({
  src: e.src,
  alt: munnarCaptions[e.name] || `Munnar, photo ${i + 1}`,
  caption: munnarCaptions[e.name] || 'Munnar',
  categories: ['Journeys', e.name === 'munnar-4' || e.name === 'munnar-1' || e.name === 'munnar-3' ? 'Mountains' : 'Nature'],
}));

const visitedPlaces = [
  {
    id: 'munnar',
    name: 'Munnar',
    region: 'Kerala, India',
    status: 'Visited',
    coords: [10.0889, 77.0595],
    art: 'tea',
    image: photo('munnar'),
    position: '50% 50%',
    ownPhotos: false,
    gallery: munnarGallery,
    alt: 'Terraced green tea plantations rolling down misty hills in Munnar, Kerala',
    photoCredit: 'Hello Munnar / Kites Foundation (MIT)',
    credit: 'Photos: “Hello Munnar” by Kites Foundation (MIT License). Swap in your own any time.',
    summary:
      'A hill station in the Western Ghats, known for rolling tea plantations, cool mist, and green mountain views.',
    intro:
      'Munnar is the kind of place that slows you down. High in the Western Ghats of Kerala, its hills are stitched with tea plantations that disappear into the mist, and the air is cooler than anywhere on the plains below.',
    story: [
      'Munnar sits in the Idukki district of Kerala, at around 1,500 metres above sea level. Its slopes are covered with neatly terraced tea estates, broken by patches of shola forest, valleys, and winding roads that climb into the clouds.',
      'It is a landscape that rewards patience: early mornings when the mist hasn’t lifted, afternoons of green stretching in every direction, and a sense that the mountains have been here far longer than any of us.',
    ],
    highlights: [
      { title: 'Tea plantations', text: 'Endless terraced estates that give the hills their ribbed, velvety look.' },
      { title: 'Western Ghats scenery', text: 'Misty ridges and valleys in one of India’s great mountain ranges.' },
      { title: 'Eravikulam National Park', text: 'Home to the Nilgiri tahr and grassy high-altitude slopes.' },
      { title: 'Anamudi', text: 'At 2,695 m, the highest peak in South India rises close to Munnar.' },
    ],
    date: '',
    travelledWith: '',
    reflection: null,
    mapQuery: 'Munnar, Kerala',
  },
  {
    id: 'tada',
    name: 'Tada Falls',
    region: 'Andhra Pradesh, India',
    status: 'Visited',
    coords: [13.5667, 80.0333],
    art: 'falls',
    image: ownTada || unsplash('1623039003809-784a7ff2d33f'),
    position: '50% 50%',
    stock: !ownTada,
    photoCredit: 'Sreehari Devadas / Unsplash',
    ownPhotos: Boolean(ownTada),
    gallery: galleryEntries('tada').map((e, i) => ({
      src: e.src, alt: `Tada Falls, photo ${i + 1}`, caption: 'Tada Falls', categories: ['Journeys', 'Waterfalls'],
    })).concat(ownTada ? [] : [
      {
        src: unsplash('1755450061383-328d23e015c1', 1200),
        alt: 'A tiered waterfall flowing over rocky terrain at Katiki Falls, Andhra Pradesh (stock photo)',
        caption: 'A tiered waterfall in Andhra Pradesh (stock photo, Katiki Falls)',
        credit: 'Satish Dharmavarapu / Unsplash',
        categories: ['Journeys', 'Waterfalls'],
      },
    ]),
    alt: 'A waterfall tumbling through lush green forest in the Tirupati area of Andhra Pradesh (stock photo)',
    credit: ownTada
      ? null
      : 'Stock photos from Unsplash: Sreehari Devadas (a waterfall near Tirupati) and Satish Dharmavarapu (Katiki Falls). They show waterfalls in Andhra Pradesh, not the Tada trail itself. Swap in your own any time.',
    summary:
      'A waterfall of roughly 100 metres hidden in the forested hills of Andhra Pradesh, close to the Tamil Nadu border.',
    intro:
      'Tada Falls is a reminder that adventure doesn’t always mean going far. Tucked into forested hills close to the Tamil Nadu border, it rewards anyone willing to leave the road behind and follow a stream into the trees.',
    story: [
      'Tada Falls, also known as Ubbalamadugu Falls, is a waterfall in the forested hills near Tada in Andhra Pradesh’s Tirupati district, about 80 km from Chennai. Clear water drops from a height of roughly 100 metres, deep in a forest known as Siddulaiah Kona.',
      'Reaching it means following a forest trail beside a stream, with rocky stretches and several pools along the way, which has made it a popular trekking spot. The place is also linked to Shiva worship, and many visitors come around Maha Shivaratri.',
    ],
    highlights: [
      { title: 'Ubbalamadugu Falls', text: 'A waterfall of roughly 100 metres tumbling through the forest.' },
      { title: 'Siddulaiah Kona forest', text: 'Dense forest hills around the falls, cool and quiet under the canopy.' },
      { title: 'The trekking trail', text: 'A stream-side trail with rocky stretches and natural pools.' },
      { title: 'A spiritual setting', text: 'Linked to Shiva worship, especially around Maha Shivaratri.' },
    ],
    date: '',
    travelledWith: '',
    reflection: null,
    mapQuery: 'Tada Falls, Andhra Pradesh',
  },
];

export const osmLink = ([lat, lng], zoom = 11) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

export default visitedPlaces;
