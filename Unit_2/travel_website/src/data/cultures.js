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

// Interactive explorer: seven themes, each with a few things I am curious about.
// These are cultures I am learning about, not claims of experience.
// `dream` links an item to the dream-destination it belongs to (optional).
export const cultureThemes = [
  {
    id: 'traditions',
    label: 'Traditions',
    lead: 'Rituals and customs mark time, welcome guests and pass stories from one generation to the next.',
    items: [
      { name: 'Kolam', where: 'Tamil Nadu', note: 'Patterns of rice flour drawn at the doorstep each morning: a welcome that is also a small daily art.' },
      { name: 'Ganga Aarti', where: 'Varanasi', note: 'An evening ritual of lamps, chants and bells beside the river ghats.', dream: 'varanasi' },
      { name: 'Tea ceremony', where: 'Japan', note: 'A slow ritual of preparing and serving matcha, built around hospitality and attention.', dream: 'kyoto' },
      { name: 'Kathakali', where: 'Kerala', note: 'A classical dance-drama known for bold makeup, towering costumes and expressive eyes.' },
    ],
  },
  {
    id: 'food',
    label: 'Food',
    lead: 'A meal carries the story of a region: its climate, its farmland, its trade routes and the people who cook.',
    items: [
      { name: 'Sadya', where: 'Kerala', note: 'A vegetarian feast served on a banana leaf, with many small dishes in a set order.' },
      { name: 'Kaiseki', where: 'Kyoto', note: 'A multi-course Japanese meal where season and presentation matter as much as taste.', dream: 'kyoto' },
      { name: 'Turkish breakfast', where: 'Istanbul', note: 'A shared spread of cheeses, olives, breads, eggs, jams and endless tea.', dream: 'istanbul' },
      { name: 'Dal baati churma', where: 'Rajasthan', note: 'Baked wheat balls with lentils and a sweet crumble: hearty desert-country food.', dream: 'rajasthan' },
    ],
  },
  {
    id: 'festivals',
    label: 'Festivals',
    lead: 'Festivals show what a community chooses to celebrate, and how it does it together.',
    items: [
      { name: 'Onam', where: 'Kerala', note: 'A harvest festival of flower carpets, a grand feast and boat races.' },
      { name: 'Pongal', where: 'Tamil Nadu', note: 'A harvest festival where fresh rice is cooked until it overflows, a sign of plenty.' },
      { name: 'Nyepi', where: 'Bali', note: 'The Balinese Day of Silence, when the whole island pauses for a day.', dream: 'bali' },
      { name: 'Hanami', where: 'Japan', note: 'Picnics under cherry blossoms each spring, in honour of a short and beautiful season.', dream: 'kyoto' },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    lead: 'Buildings reflect climate, materials, belief and daily life. Each style answers a different question.',
    items: [
      { name: 'Temple gopurams', where: 'South India', note: 'Towering, richly carved gateways that rise above the temple walls.' },
      { name: 'Machiya townhouses', where: 'Kyoto', note: 'Narrow wooden houses with latticed fronts, lining the old lanes.', dream: 'kyoto' },
      { name: 'Domes and minarets', where: 'Istanbul', note: 'A skyline shaped by Ottoman mosques and their layered domes.', dream: 'istanbul' },
      { name: 'Havelis and forts', where: 'Rajasthan', note: 'Sandstone forts and painted merchant mansions with carved balconies.', dream: 'rajasthan' },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    lead: 'A greeting is often the first step into a culture, and it carries more than hello.',
    items: [
      { name: 'Vanakkam', where: 'Tamil', note: 'A warm, respectful greeting, often with palms pressed together.' },
      { name: 'Namaskaram', where: 'Malayalam', note: 'The Kerala greeting, rooted in a Sanskrit word for bowing to someone.' },
      { name: 'Konnichiwa', where: 'Japanese', note: 'The everyday daytime greeting, often paired with a small bow.', dream: 'kyoto' },
      { name: 'Merhaba', where: 'Turkish', note: 'A friendly hello you will hear in every shop and tea house.', dream: 'istanbul' },
      { name: 'Om Swastiastu', where: 'Balinese', note: 'The traditional Balinese greeting, a wish for well-being.', dream: 'bali' },
    ],
  },
  {
    id: 'clothing',
    label: 'Clothing',
    lead: 'What people wear is a record of climate, craft, occasion and identity.',
    items: [
      { name: 'Kasavu saree and mundu', where: 'Kerala', note: 'Off-white cotton with a gold border, worn for festivals such as Onam.' },
      { name: 'Kanchipuram silk', where: 'Tamil Nadu', note: 'Heavy woven silk sarees known for rich colours and temple-style borders.' },
      { name: 'Kimono', where: 'Japan', note: 'A T-shaped robe wrapped left over right and tied with an obi.', dream: 'kyoto' },
      { name: 'Bandhani and safa', where: 'Rajasthan', note: 'Tie-dyed textiles and brightly coloured turbans, each style with its own meaning.', dream: 'rajasthan' },
    ],
  },
  {
    id: 'historical',
    label: 'Historical places',
    lead: 'Old places hold the long version of a culture: what people built, defended and believed.',
    items: [
      { name: 'Mahabalipuram', where: 'Tamil Nadu', note: 'Pallava-era rock-cut temples and a shore temple beside the Bay of Bengal.' },
      { name: 'Hagia Sophia', where: 'Istanbul', note: 'A sixth-century landmark whose huge dome has shaped Istanbul’s skyline for nearly 1,500 years.', dream: 'istanbul' },
      { name: 'Fushimi Inari', where: 'Kyoto', note: 'A mountain path lined with thousands of vermilion torii gates.', dream: 'kyoto' },
      { name: 'Amer Fort', where: 'Jaipur', note: 'A hilltop fort of red sandstone and marble above a quiet lake.', dream: 'rajasthan' },
    ],
  },
];

export default cultures;
