import { photo } from './photos';

// The three passions that run through the whole site. Each gets equal weight.
export const passions = [
  {
    id: 'travel',
    short: 'Travel',
    title: 'Travel & exploration',
    text: 'Mountains, waterfalls and beaches pull me out the door. Munnar and Tada Falls are the first chapters, and the map still has plenty of room.',
    image: photo('munnar'),
    alt: 'Terraced tea plantations rolling down a misty hill in Munnar',
    position: '50% 50%',
    to: '/journeys',
    cta: 'Explore my journeys',
    anchor: '/#visited',
    loves: [
      'Mountains, waterfalls and beaches',
      'Discovering beautiful, unfamiliar places',
      'New environments and new routes',
      'Memories that outlast the trip',
    ],
  },
  {
    id: 'culture',
    short: 'Culture',
    title: 'Cultural exploration',
    text: 'Every place has its own way of living: its food, festivals, languages and old buildings. I want to understand them, not only look at them.',
    image: photo('kyoto'),
    alt: 'Two people walking down a historic lane in Kyoto at dusk',
    position: '60% 50%',
    to: '/cultures',
    cta: 'Explore cultures',
    anchor: '/#culture',
    loves: [
      'Traditions and festivals',
      'Local cuisines',
      'Historical places and architecture',
      'Languages and greetings',
      'Different lifestyles around the world',
    ],
  },
  {
    id: 'kabaddi',
    short: 'Kabaddi',
    title: 'Playing Kabaddi',
    text: 'On the court I learn teamwork, strategy and discipline. Every raid asks for courage, and every game asks for trust.',
    visual: true,
    alt: 'Illustration of a Kabaddi court with a raider crossing toward a chain of defenders',
    to: '/kabaddi',
    cta: 'Explore Kabaddi',
    anchor: '/#kabaddi-preview',
    loves: ['Teamwork', 'Strategy', 'Discipline', 'Determination'],
  },
];

export default passions;
