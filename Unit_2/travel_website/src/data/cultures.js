import { photo, unsplash } from './photos';

// Each section feeds one block on the Cultures page.
// `dreams` lists dream-destination ids that link to the related places.
const cultures = [
  {
    id: 'traditions',
    title: 'Traditions & festivals',
    kicker: 'Rituals that mark time',
    text: 'Festivals and rituals mark the seasons, bring communities together, and pass stories from one generation to the next. They show what a community holds sacred and what it chooses to celebrate.',
    note: 'From the evening riverside rituals of Varanasi to the temple ceremonies of Bali, these are traditions I would love to learn about with respect and curiosity.',
    image: photo('bali-temple'),
    alt: 'A multi-tiered Balinese temple shrine at the edge of a lake, surrounded by green trees',
    position: '50% 40%',
    dreams: ['varanasi', 'bali', 'kyoto'],
  },
  {
    id: 'food',
    title: 'Food & local cuisine',
    kicker: 'Taste the place',
    text: 'Food carries the story of a region: its climate, its farmland, its trade routes, and the people who cook and share it. A meal can say as much about a place as any monument.',
    note: 'Seasonal Japanese cooking, Turkish breakfast spreads, and the flavours of Rajasthan are all on my list to understand better.',
    tone: 'orange',
    dreams: ['kyoto', 'istanbul', 'rajasthan'],
  },
  {
    id: 'architecture',
    title: 'Architecture & historic places',
    kicker: 'Built to last',
    text: 'Temples, forts, mosques, and old townhouses show how communities have built for faith, defence, trade, and everyday life. Each style reflects its climate, materials, and beliefs.',
    note: 'Wooden lanes in Kyoto, domes in Istanbul, and sandstone forts in Rajasthan show how differently people have shaped their cities.',
    image: photo('kyoto'),
    alt: 'A historic wooden-fronted street in Kyoto with a pagoda in the distance at sunset',
    position: '55% 45%',
    secondImage: photo('fuji'),
    secondAlt: 'A red pagoda with Mount Fuji rising behind it',
    secondPosition: '30% 62%',
    dreams: ['istanbul', 'rajasthan', 'cappadocia', 'kyoto'],
  },
  {
    id: 'art',
    title: 'Art, music & crafts',
    kicker: 'Made by hand, shared by voice',
    text: 'Dance, folk music, textiles, carving, and painting are living ways of keeping memory alive. Many crafts are skills handed down within families and communities.',
    note: 'Balinese dance and carving, Rajasthani folk music, and the Buddhist art of Ladakh are traditions I hope to experience.',
    tone: 'sage',
    dreams: ['bali', 'rajasthan', 'ladakh'],
  },
  {
    id: 'everyday',
    title: 'Everyday life & local communities',
    kicker: 'The ordinary is the story',
    text: 'Markets, lanes, shared meals, and daily routines show how people really live. Learning about communities on their own terms is one of the most rewarding parts of travel.',
    note: 'The hill communities of Meghalaya, the high villages of Ladakh, and the old lanes of Varanasi are places where daily life shapes the landscape.',
    image: unsplash('1514907351870-bd69558b9f20'),
    alt: 'A boat on the Ganges at sunrise in Varanasi, where daily life unfolds along the river (photo: Frank Holleman / Unsplash)',
    position: '50% 55%',
    dreams: ['meghalaya', 'ladakh', 'varanasi'],
  },
];

// Greetings from places featured on this site.
export const greetings = [
  { word: 'Vanakkam', language: 'Tamil' },
  { word: 'Namaskaram', language: 'Malayalam' },
  { word: 'Namaste', language: 'Hindi' },
  { word: 'Konnichiwa', language: 'Japanese' },
  { word: 'Merhaba', language: 'Turkish' },
  { word: 'Halo', language: 'Indonesian' },
];

export default cultures;
