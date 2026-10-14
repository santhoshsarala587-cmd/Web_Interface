import { photo, gallery, unsplash } from './photos';

// Tada Falls: no photo of the actual trail is available yet, so verified stock photos of
// waterfalls in Andhra Pradesh are used until you add your own (src/assets/photos/tada.jpg).
const ownTada = photo('tada');

// PLACES I'VE VISITED
// Only facts you supplied (the place, and that you visited it) are stated as personal.
// Descriptions are general facts about the destination, not claims about your trip.
//
// TO ADD A PLACE: copy one object below, give it a new `id`, and (optionally) drop
// photos named <id>.jpg, <id>-1.jpg ... into src/assets/photos. Nothing else to change.
const visitedPlaces = [
  {
    id: 'munnar',
    name: 'Munnar',
    region: 'Kerala, India',
    status: 'Visited',
    art: 'tea',
    image: photo('munnar'),
    gallery: gallery('munnar'),
    remoteGallery: [],
    alt: 'Terraced green tea plantations rolling down misty hills in Munnar, Kerala',
    credit: 'Photos: “Hello Munnar” by Kites Foundation (MIT License). Swap in your own any time.',
    summary:
      'A hill station in the Western Ghats, known for rolling tea plantations, cool mist, and green mountain views.',
    about: [
      'Munnar is a hill station in the Idukki district of Kerala, set high in the Western Ghats. Its slopes are covered with tea plantations that roll away into the mist, and the cool climate sets it apart from the coast below.',
      'The surrounding hills, valleys, and forests make it one of the best-known highland landscapes in South India.',
    ],
    knownFor: ['Tea plantations', 'Misty hills', 'Western Ghats scenery', 'Cool climate'],
    // Placeholders: replace with your own details whenever you like.
    placeholders: ['Travel date', 'Who I travelled with', 'A memory I want to remember'],
  },
  {
    id: 'tada',
    name: 'Tada Falls',
    region: 'Andhra Pradesh, India',
    status: 'Visited',
    art: 'falls',
    image: ownTada || unsplash('1623039003809-784a7ff2d33f'),
    stock: !ownTada,
    gallery: gallery('tada'),
    remoteGallery: ownTada
      ? []
      : [
          {
            src: unsplash('1755450061383-328d23e015c1', 1200),
            alt: 'A tiered waterfall flowing over rocky terrain at Katiki Falls, Andhra Pradesh (stock photo)',
          },
        ],
    alt: 'A waterfall tumbling through lush green forest in the Tirupati area of Andhra Pradesh (stock photo)',
    summary:
      'A waterfall of roughly 100 metres hidden in the forested hills of Andhra Pradesh, close to the Tamil Nadu border.',
    about: [
      'Tada Falls, also known as Ubbalamadugu Falls, is a waterfall in the forested hills near Tada in Andhra Pradesh’s Tirupati district, about 80 km from Chennai. Clear water drops from a height of roughly 100 metres, deep in a forest known as Siddulaiah Kona.',
      'Reaching it means following a forest trail beside a stream, with rocky stretches and several pools along the way, which has made it a popular trekking spot. The place is also linked to Shiva worship, and many visitors come around Maha Shivaratri.',
    ],
    knownFor: ['Ubbalamadugu Falls', 'Siddulaiah Kona forest', 'Forest trekking trail', 'Roughly 100 m drop'],
    credit: ownTada
      ? null
      : 'Stock photos from Unsplash: Sreehari Devadas (a waterfall near Tirupati) and Satish Dharmavarapu (Katiki Falls). They show waterfalls in Andhra Pradesh, not the Tada trail itself. Swap in your own any time.',
    placeholders: ['Travel date', 'Who I travelled with', 'A memory I want to remember'],
  },
];

export default visitedPlaces;
