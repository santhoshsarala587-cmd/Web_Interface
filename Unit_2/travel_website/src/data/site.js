import { profile } from './profile';

export const brand = profile.siteName.toUpperCase();

// Main navigation. The rest live under "More" on desktop and in the full menu on mobile.
export const navLinks = [
  { label: 'My Story', to: '/my-story' },
  { label: 'Passions', to: '/passions' },
  { label: 'Journeys', to: '/journeys' },
  { label: 'Dream Destinations', to: '/dream-destinations' },
  { label: 'Cultures', to: '/cultures' },
  { label: 'Kabaddi', to: '/kabaddi' },
];

export const moreLinks = [
  { label: 'Travel Map', to: '/travel-map' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export const allLinks = [{ label: 'Home', to: '/' }, ...navLinks, ...moreLinks];

export const contact = profile.contact;

// Set to true to show the dashed "add your own memories" boxes while you are editing.
export const showPlaceholders = false;
