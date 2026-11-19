import visitedPlaces from './visitedPlaces';
import { gallery, unsplash } from './photos';

// The Gallery shows Munnar, Ooty and Tada Falls, plus Kabaddi once you add your own photos.
// `mine` is false for stock photos and true only for photos you took yourself.
// Ooty photos are stock photos from Unsplash (free under the Unsplash License). Ooty is a place of
// interest here, not one of the "visited" journeys, so it has no journey page.


const fromJourney = (place) => {
  const shots = [
    { src: place.image, alt: place.alt, caption: place.name },
    ...place.gallery.filter((g) => g.src !== place.image),
  ];
  return shots.filter((s) => s.src).map((s, i) => {
    const credit = s.credit || place.photoCredit;
    return {
      id: `${place.id}-${i}`,
      src: s.src,
      alt: s.alt,
      caption: s.caption,
      place: place.id === 'tada' ? 'Tada' : place.name,
      mine: place.ownPhotos,
      label: `${place.ownPhotos ? 'My photo' : 'Stock photo'}${credit && !place.ownPhotos ? ` · ${credit}` : ''}`,
    };
  });
};

const ooty = [
  { id: '1650896403601-1a06c84d1943', by: 'Debdip Mukherjee', caption: 'Pine forest and clouds in the Nilgiris', alt: 'Tall pine trees rising into low clouds on a hillside in Ooty, Tamil Nadu' },
  { id: '1671982104834-e4ff82b45c96', by: 'Sam M', caption: 'Misty Nilgiri hills with a palm in the foreground', alt: 'Layers of misty forested hills with a palm tree in the foreground, Ooty' },
  { id: '1708505116595-488b5cbf58d7', by: 'Calvin Joshy', caption: 'A railway line through green hills near Ooty', alt: 'A railway track passing under a bridge among green grass on a cloudy day, Ooty' },
].map((o) => ({
  id: `ooty-${o.id}`,
  src: unsplash(o.id, 1400),
  alt: o.alt,
  caption: o.caption,
  place: 'Ooty',
  mine: false,
  label: `Stock photo · ${o.by} / Unsplash`,
}));

// Your own Kabaddi photos (src/assets/photos/kabaddi.jpg, kabaddi-1.jpg ...) join the gallery automatically.
const kabaddi = gallery('kabaddi').map((src, i) => ({
  id: `kabaddi-${i}`,
  src,
  alt: `Kabaddi, photo ${i + 1}`,
  caption: `Kabaddi, photo ${i + 1}`,
  place: 'Kabaddi',
  mine: true,
  label: 'My photo',
}));

const galleryItems = [...visitedPlaces.flatMap(fromJourney), ...ooty, ...kabaddi];

export const galleryFilters = ['All', 'Munnar', 'Ooty', 'Tada', ...(kabaddi.length ? ['Kabaddi'] : [])];
export default galleryItems;
