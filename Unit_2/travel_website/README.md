# My Passion Journal (v9)

A personal passion portfolio: **Travel · Culture · Kabaddi**. React + React Router + Lucide, frontend only.

## Make it yours: one file
Edit `src/data/profile.js`: your name, portrait (`src/assets/photos/me.jpg`), Kabaddi role/team/journey/achievements,
extra timeline chapters, and contact email/socials. Empty fields are simply hidden, so nothing looks unfinished.
Add Kabaddi photos as `src/assets/photos/kabaddi.jpg`, `kabaddi-1.jpg`, … and they appear on Kabaddi, Home and the Gallery.
Trip dates/notes: `date`, `travelledWith`, `reflection` in `src/data/visitedPlaces.js`.

## What's new in v9
Theme switcher (light/dark), new hero + About + three-passion panels, culture explorer (7 themes), interactive Kabaddi court,
animated stats, journey timeline, My Passions page, Contact page, "More" menu, URL-driven wishlist search/filters.

Run: `npm install` then `npm start` (build: `npm run build`).

---

# My Travel Journal: personal travel portfolio (React, frontend only)

Pages: Home · My Story · My Journeys (+ a detail page per journey) · Dream Destinations (+ detail pages) · Travel Map · Gallery,
plus Cultures and Kabaddi (linked from the footer and Home). No backend, database, login or booking.

## Features
- **Wishlist:** tap the heart on any dream destination. Saved places persist in your browser (localStorage), show a count in the nav, and have a "Saved" filter with an empty state.
- **Search + filters:** search by place/country/type; filter by Mountains, Waterfalls, Beaches, Nature, Adventure, Culture.
- **Travel map:** Leaflet + OpenStreetMap (no API key). Visited = orange tick pins, dream = green star diamonds, popups link to each page, and a text list of every pin sits below the map.
- **Gallery:** shows only Munnar, Ooty and Tada Falls (filter by place). Filterable masonry grid with an accessible lightbox (Esc, arrow keys, swipe, focus trap). Every photo is labelled "Stock photo" until you mark photos as your own.
- **Journeys:** Munnar and Tada Falls each have a cover, intro, story, highlights, gallery, reflections and map link, built from one data object.

## Make it yours
- Add a journey: copy an entry in `src/data/visitedPlaces.js`. Set `ownPhotos: true` when the photos are yours.
- Add/remove dream destinations: edit `src/data/dreamDestinations.js` (include `coords` so it appears on the map).
- "Sample text · edit me" boxes mark spots for your own memories. Set `showPlaceholders = false` in `src/data/site.js` to hide them.

## Run it
```bash
npm install
npm start          # http://localhost:3000
npm run build      # production build in /build
npm test
```

Dependencies added: `react-router-dom` (pages), `leaflet` (map), `lucide-react` (icons), `@fontsource/*` (self-hosted fonts).

## Hosting note (routing)
The site uses real URLs (`/kabaddi`, `/dream-destinations/kyoto`), so the host must serve `index.html`
for unknown paths. Included: `public/_redirects` (Netlify/Cloudflare Pages) and `vercel.json` (Vercel).
Locally, `npm start` already does this; for a build use `npx serve -s build`.

## Add YOUR photos (no code changes)
Drop files into `src/assets/photos/` and restart `npm start`:

| File | Used for |
| --- | --- |
| `munnar.jpg`, `munnar-1.jpg`, `munnar-2.jpg` ... | Munnar feature + gallery |
| `tada.jpg`, `tada-1.jpg` ... | Tada feature + gallery |
| `kabaddi.jpg`, `kabaddi-1.jpg` ... | Kabaddi photo (Home + Kabaddi page) + gallery |
| `<id>.jpg` (e.g. `ladakh.jpg`, `istanbul.jpg`) | Replaces the illustration for that dream destination |

Until a photo exists, those places show a clearly labelled **Illustration** instead of an unrelated picture.

**Photos included:** Munnar uses six real photos from the open-source *Hello Munnar* app (Kites Foundation, MIT licence; see `src/assets/photos/CREDITS.txt`). The original photographers aren't named there, so for a public site replace them with your own (same file names). **Tada Falls** uses two stock photos of Andhra Pradesh waterfalls linked from Unsplash (Unsplash License; credited on the page and in `CREDITS.txt`). They need an internet connection to load, and fall back to an illustration if they can't. They aren't photos of the Tada trail itself, so add `tada.jpg` when you have one and it replaces them.
Keep photos under ~400 KB each.

## Where to edit content
| What | File |
| --- | --- |
| Places I've visited (add more here) | `src/data/visitedPlaces.js` |
| Dream destinations + categories | `src/data/dreamDestinations.js` |
| Culture sections, greetings | `src/data/cultures.js` |
| Nav links, **email / socials**, hide placeholders | `src/data/site.js` |
| Colours, spacing, fonts, radii | `src/styles/variables.css` |

- **Contact:** `contact.email` and `contact.socials` are empty on purpose. Add real details and buttons appear.
- **Placeholders:** the dashed "to be added" boxes (dates, memories, gallery) are marked as placeholders.
  Set `showPlaceholders = false` in `src/data/site.js` to hide them once you've written your own content.

## Structure
```
src/
  components/  Navbar, Footer, Button, PageHero, PlaceArt, PlacePhoto, DestinationCard, VisitedCard, ...
  pages/       Home, MyStory, VisitedPlaces, DreamDestinations, DestinationDetail, Cultures, Kabaddi, NotFound
  sections/    Home page sections
  data/        visitedPlaces.js, dreamDestinations.js, cultures.js, site.js, photos.js
  styles/      variables.css, global.css
  assets/photos/  drop your own photos here
```
Fonts are self-hosted via `@fontsource`; icons from `lucide-react`.

## Motion & effects
Scroll progress bar, parallax hero backgrounds, word-by-word heading reveals, image wipe reveals and fade-ins,
marquee word bands, page fade transitions, button shine, card hover lifts, and a pulsing raider on the Kabaddi court.
All of it switches off automatically for visitors who prefer reduced motion.

## Photo sources
- **Bundled in `public/images`:** Kyoto, Bali, Mount Fuji, Everest region, Maldives, Niagara (your original zip).
- **Local in `src/assets/photos`:** six Munnar photos (Hello Munnar, MIT).
- **Linked from Unsplash (needs internet; free under the Unsplash License):** Tada Falls (2), Swiss Alps, Istanbul, Patagonia, Cappadocia, Meghalaya, Ladakh, Rajasthan, Varanasi (also on the Cultures page). Photographers are credited on each destination's detail page and in `src/assets/photos/CREDITS.txt`. If a link fails to load, the site shows an illustration instead.
- **Not photographed yet:** Kabaddi (illustrated court) and the Food / Art panels on the Cultures page. Add `kabaddi.jpg` to `src/assets/photos` for the Kabaddi photo.
- Any place can be switched to your own photo by dropping `<id>.jpg` (e.g. `ladakh.jpg`) in `src/assets/photos`.
