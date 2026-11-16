import type { Contact } from "@/lib/types";

/**
 * Deterministic, illustrated-style avatar generator.
 * No network calls, no extra dependencies — a small set of flat, faceless
 * "person in a circle" SVG variants (in the style of stock illustrated
 * avatar sets) are combined with a seeded hash so every contact gets a
 * consistent, distinct-looking avatar derived from their id + gender.
 */

const SKIN_TONES = ["#f4c9a2", "#e8b48c", "#d99a6c", "#c17f52", "#8d5a3c", "#f7d9bd"];
const FEMALE_HAIR = ["#7b3f26", "#3d2b1f", "#a63d2f", "#d4894a", "#2b2b2b", "#c9a86a", "#6b3fa0"];
const MALE_HAIR = ["#3d2b1f", "#1f1f1f", "#7b3f26", "#5b3a29", "#c9a86a", "#4a4a4a"];
const TOP_COLORS = [
  "#5b6ee1",
  "#e17a94",
  "#3fa78c",
  "#e0a458",
  "#7a5fc9",
  "#4c9bc9",
  "#c9556e",
  "#5a9e5a",
  "#c98a3f",
  "#6a6fd4",
];
const BG_COLORS = [
  "#c9c2ea",
  "#b9d6e8",
  "#c4b8d6",
  "#a8e6c1",
  "#b8d0e6",
  "#8fd6c9",
  "#f3b8cf",
  "#a8c8e8",
  "#f6d78c",
  "#c8e0a8",
  "#e8b8a8",
  "#b8e0d8",
  "#d9c9ea",
  "#c9e8d6",
];

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFrom<T>(arr: readonly T[], seed: number, salt: number) {
  return arr[(seed + salt * 7) % arr.length]!;
}

function variantFor(contact: Pick<Contact, "id" | "fullName" | "gender">) {
  const isFemale = contact.gender === "Female";
  const seed = hashString(contact.id || contact.fullName || "contact");
  return {
    isFemale,
    skin: pickFrom(SKIN_TONES, seed, 1),
    hair: pickFrom(isFemale ? FEMALE_HAIR : MALE_HAIR, seed, 2),
    top: pickFrom(TOP_COLORS, seed, 3),
    bg: pickFrom(BG_COLORS, seed, 4),
    hairStyle: (seed + 5) % (isFemale ? 4 : 3),
  };
}

/** Hair drawn as a single shape that sits behind + around the face circle. */
function HairShape({ isFemale, style, hair }: { isFemale: boolean; style: number; hair: string }) {
  if (isFemale) {
    switch (style) {
      case 0: // long straight, past shoulders
        return (
          <path
            d="M60 20c-19 0-31 14-31 32v20c0 4 2 6 5 6l2-18 3 18h42l3-18 2 18c3 0 5-2 5-6V52c0-18-12-32-31-32z"
            fill={hair}
          />
        );
      case 1: // long side-part wavy
        return (
          <path
            d="M60 19c-20 0-32 15-32 33 0 8 2 15 6 20l3-16c1 5 3 9 3 9l2-19 3 20 3-20 2 20 3-20 3 19s2-4 3-9l3 16c4-5 6-12 6-20 0-18-12-33-32-33z"
            fill={hair}
          />
        );
      case 2: // short bob
        return (
          <path
            d="M60 22c-17 0-28 13-28 28v12c0 3 2 5 5 5l1-12 3 12h38l3-12 1 12c3 0 5-2 5-5V50c0-15-11-28-28-28z"
            fill={hair}
          />
        );
      default: // curly
        return (
          <g fill={hair}>
            <circle cx="37" cy="34" r="9" />
            <circle cx="48" cy="24" r="10" />
            <circle cx="60" cy="20" r="10" />
            <circle cx="72" cy="24" r="10" />
            <circle cx="83" cy="34" r="9" />
            <circle cx="33" cy="47" r="8" />
            <circle cx="87" cy="47" r="8" />
            <path d="M60 24c-15 0-26 12-26 27v10c0 3 2 5 4 5l2-11 2 11h36l2-11 2 11c2 0 4-2 4-5V51c0-15-11-27-26-27z" />
          </g>
        );
    }
  }
  switch (style) {
    case 0: // short crop, straight
      return <path d="M60 24c-15 0-25 11-25 26v3h50v-3c0-15-10-26-25-26z" fill={hair} />;
    case 1: // side-swept
      return (
        <path
          d="M60 23c-16 0-27 12-26 28 2-3 5-5 8-6-1-5 1-9 4-12 0 4 3 6 6 7-1-5 1-9 4-11 0 4 2 7 5 8 0-4 2-8 5-9-1 4 0 8 3 10 3-1 4 1 5 4 1-1 2-3 3-4 1-16-10-28-26-28z"
          fill={hair}
        />
      );
    default: // textured top
      return (
        <path
          d="M60 23c-15 0-25 12-25 27 1-2 2-4 4-5 0-4 2-8 5-9-1 3 0 6 2 8 0-4 2-7 5-8-1 3 0 6 2 7 1-4 3-6 6-7-1 3 0 6 2 7 1-3 3-5 6-6-1 3 1 5 3 6 2-1 3 1 4 3 2-1 3-2 5-2-1-14-11-25-25-25z"
          fill={hair}
        />
      );
  }
}

export function ContactAvatar({
  contact,
  size = 40,
  className = "",
}: {
  contact: Pick<Contact, "id" | "fullName" | "gender">;
  size?: number;
  className?: string;
}) {
  const v = variantFor(contact);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: v.bg }}
      role="img"
      aria-label={`${contact.fullName} avatar`}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* shoulders / top clothing */}
        <path d="M60 88c-18 0-32 10-32 26v6h64v-6c0-16-14-26-32-26z" fill={v.top} />
        {/* neck */}
        <rect x="50" y="72" width="20" height="22" rx="8" fill={v.skin} />
        {/* face */}
        <circle cx="60" cy="52" r="27" fill={v.skin} />
        {/* hair behind/around face */}
        <HairShape isFemale={v.isFemale} style={v.hairStyle} hair={v.hair} />
        {/* face redrawn on top of hair's lower edge to keep a clean oval */}
        <ellipse cx="60" cy="56" rx="23" ry="25" fill={v.skin} />
        {/* fringe/bangs overlay for a touch of hair on the forehead */}
        {v.isFemale && v.hairStyle !== 3 ? (
          <path d="M39 44c4-8 12-13 21-13s17 5 21 13c-6-4-13-6-21-6s-15 2-21 6z" fill={v.hair} />
        ) : null}
        {!v.isFemale ? (
          <path d="M37 40c5-9 13-14 23-14s18 5 23 14c-7-5-15-8-23-8s-16 3-23 8z" fill={v.hair} />
        ) : null}
      </svg>
    </span>
  );
}
