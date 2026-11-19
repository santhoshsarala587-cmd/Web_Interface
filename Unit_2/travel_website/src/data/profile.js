import { photo } from './photos';

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT ME: the one file to edit to make the site yours.
// Anything left empty ('' or []) is simply not shown, so the site never displays
// unfinished placeholder text. Fill a field in and it appears everywhere it is used.
// ─────────────────────────────────────────────────────────────────────────────
export const profile = {
  siteName: 'My Passion Journal', // shown in the navigation, footer and browser tab

  name: '', // EDIT: your name. Shown in the About section and footer when filled in.

  // EDIT: drop a portrait named  me.jpg  into src/assets/photos  and it appears in About.
  // Until then a small emblem of the three passions is shown instead.
  portrait: photo('me'),
  portraitAlt: 'A portrait of me',

  headline: 'A curious mind. An adventurous heart.',
  bio: [
    'I love the feeling of arriving somewhere I have never been: the unfamiliar air, the different light, the way a landscape quietly rearranges what you thought you knew. Mountains, waterfalls, beaches and tea-covered hills pull me back to nature again and again.',
    'Places lead me to people. I want to understand how others live, what they cook and celebrate, how they greet each other, and what their old buildings remember. And when I am not travelling, I am on the Kabaddi court, learning teamwork, strategy and discipline one raid at a time.',
  ],

  personality: [
    { trait: 'Curious', text: 'I ask how and why long before I ask what is next.' },
    { trait: 'Adventurous', text: 'A new trail, a new city, a new language: I say yes.' },
    { trait: 'Team-minded', text: 'I play best when the whole team plays together.' },
    { trait: 'Disciplined', text: 'Showing up and training matters more than talent.' },
    { trait: 'Determined', text: 'I give the next moment everything I have.' },
  ],

  interests: [
    'Mountains', 'Waterfalls', 'Beaches', 'Historical places',
    'Local cuisines', 'Languages and greetings', 'Traditions', 'Kabaddi',
  ],

  // KABADDI: add your real details and they appear on the Kabaddi page and Home.
  kabaddi: {
    role: '',          // e.g. 'Raider' or 'Defender'
    team: '',          // e.g. your team or club name
    since: '',         // e.g. 'Playing since 2021'
    journey: [],       // e.g. [{ when: '2022', title: 'Joined my first team', text: '…' }]
    achievements: [],  // e.g. [{ title: 'District tournament', text: 'Runner-up' }]
  },

  // TIMELINE: extra chapters for My Story, e.g. { when: '2024', title: '…', text: '…' }
  // The chapters built from your places, cultures and Kabaddi are always shown first.
  timeline: [],

  // CONTACT: nothing is shown until you add real details.
  contact: {
    email: '',   // 'you@example.com'
    socials: [], // [{ label: 'Instagram', url: 'https://instagram.com/your-handle' }]
  },
};

export default profile;
