# UnitCon

A multi-category unit converter site with a navbar, category browsing, dark/light theme, and 30 individual converters across 9 categories.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

## Structure

- `src/data/converters.js` — all 9 category groups + 30 converters + their units/factors
- `src/convert.js` — conversion math (linear factors + special temperature handling)
- `src/ThemeContext.jsx` — dark/light theme provider (persists to localStorage, respects system preference on first load)
- `src/components/Navbar.jsx` — top nav with Converters dropdown, All Units, Articles, About, search icon, theme toggle
- `src/pages/Home.jsx` — landing page with popular converters + category browser
- `src/pages/AllUnits.jsx` — "All Converters" reference page with group tabs (matches the reference screenshot)
- `src/pages/CategoryGroup.jsx` — converters within one group (e.g. all "Engineering Converters")
- `src/pages/Converter.jsx` — the actual conversion tool (value input, unit selects, result, quick conversions, full table, copy/reset)
- `src/pages/Articles.jsx`, `src/pages/About.jsx` — simple stub pages

## Categories included

Common, Engineering, Heat, Fluids, Light, Electricity, Magnetism, Radiology, Other — 9 groups, 30 converters total (Length, Weight, Volume, Temperature, Speed, Area, Time, Digital Storage, Pressure, Force, Power, Torque, Density, Flow Rate, Energy, Thermal Conductivity, Specific Heat, Viscosity, Illuminance, Luminance, Luminous Intensity, Voltage, Current, Resistance, Charge, Capacitance, Magnetic Flux, Magnetic Field, Radiation Dose, Radioactivity, Angle, Fuel Consumption, Data Transfer Rate).

## Extend it

To add a new converter: add an entry to `converters` in `src/data/converters.js` (units + factors relative to a base unit), then reference its key in the relevant group's `converters` array in `categoryGroups`.

To add a new category group: add an entry to `categoryGroups` with a `key`, `label`, and list of converter keys.
