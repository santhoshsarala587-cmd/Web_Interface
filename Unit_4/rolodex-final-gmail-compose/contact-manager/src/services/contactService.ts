import { seedContacts } from "@/data/contacts";
import type { Contact, ContactFilters, SortKey } from "@/lib/types";
import { storage } from "@/utils/storage";
import { ageFromDob } from "@/utils/validation";

/**
 * Data/service layer. Every UI component talks to these functions only, so the
 * localStorage implementation can later be swapped for HTTP calls
 * (GET/POST/PUT/DELETE /api/contacts) without touching the UI.
 */

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CT-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

function normalize(c: Partial<Contact>): Contact {
  const firstName = (c.firstName ?? "").trim();
  const lastName = (c.lastName ?? "").trim();
  const fullName = (c.fullName ?? `${firstName} ${lastName}`).trim();
  const dateOfBirth = (c.dateOfBirth ?? "").trim();
  return {
    id: c.id ?? newId(),
    firstName: firstName || fullName.split(" ")[0] || "",
    lastName: lastName || fullName.split(" ").slice(1).join(" "),
    fullName,
    phone: (c.phone ?? "").trim(),
    alternatePhone: (c.alternatePhone ?? "").trim(),
    email: (c.email ?? "").trim(),
    alternateEmail: (c.alternateEmail ?? "").trim(),
    gender: c.gender ?? "",
    age: typeof c.age === "number" && c.age > 0 ? c.age : ageFromDob(dateOfBirth),
    dateOfBirth,
    company: (c.company ?? "").trim(),
    jobTitle: (c.jobTitle ?? "").trim(),
    department: (c.department ?? "").trim(),
    address: (c.address ?? "").trim(),
    city: (c.city ?? "").trim(),
    district: (c.district ?? "").trim(),
    state: (c.state ?? "").trim(),
    country: (c.country ?? "").trim(),
    pincode: (c.pincode ?? "").trim(),
    website: (c.website ?? "").trim(),
    linkedin: (c.linkedin ?? "").trim(),
    category: c.category ?? "Other",
    status: c.status ?? "Active",
    priority: c.priority ?? "Normal",
    tags: Array.isArray(c.tags)
      ? c.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : String(c.tags ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    owner: (c.owner ?? "Unassigned").trim() || "Unassigned",
    source: c.source ?? "Manual",
    lastContactedAt: c.lastContactedAt ?? "",
    nextFollowUpAt: c.nextFollowUpAt ?? "",
    preferredChannel: c.preferredChannel ?? "Email",
    notes: c.notes ?? "",
    createdAt: c.createdAt ?? nowIso(),
    updatedAt: c.updatedAt ?? nowIso(),
  };
}

/** Seeds the built-in dataset once; afterwards local edits always win. */
export function bootstrap(): Contact[] {
  if (!storage.hasData()) {
    const seeded = seedContacts.map(normalize);
    storage.write(seeded);
    return seeded;
  }
  return storage.read<Contact[]>([]);
}

export async function getContacts(): Promise<Contact[]> {
  return bootstrap();
}

export async function getContactById(id: string): Promise<Contact | undefined> {
  return bootstrap().find((c) => c.id === id);
}

export async function addContact(data: Partial<Contact>): Promise<Contact> {
  const list = bootstrap();
  const created = normalize({ ...data, id: newId(), createdAt: nowIso(), updatedAt: nowIso() });
  storage.write([created, ...list]);
  return created;
}

export async function addManyContacts(
  records: Array<Partial<Contact>>,
  opts: { replace?: boolean } = {},
): Promise<Contact[]> {
  const list = opts.replace ? [] : bootstrap();
  const existingIds = new Set(list.map((c) => c.id));
  const incoming = records.map((r) => {
    const id = r.id && !existingIds.has(r.id) ? r.id : newId();
    existingIds.add(id);
    return normalize({ ...r, id });
  });
  const next = [...incoming, ...list];
  storage.write(next);
  return incoming;
}

export async function updateContact(
  id: string,
  data: Partial<Contact>,
): Promise<Contact | undefined> {
  const list = bootstrap();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const prev = list[idx]!;
  const merged = normalize({
    ...prev,
    ...data,
    id: prev.id,
    fullName:
      `${(data.firstName ?? prev.firstName).trim()} ${(data.lastName ?? prev.lastName).trim()}`.trim(),
    age: 0,
    createdAt: prev.createdAt,
    updatedAt: nowIso(),
  });
  const next = [...list];
  next[idx] = merged;
  storage.write(next);
  return merged;
}

export async function deleteContact(id: string): Promise<boolean> {
  const list = bootstrap();
  const next = list.filter((c) => c.id !== id);
  storage.write(next);
  return next.length !== list.length;
}

export async function resetContacts(): Promise<Contact[]> {
  const seeded = seedContacts.map(normalize);
  storage.write(seeded);
  return seeded;
}

export async function clearContacts(): Promise<void> {
  storage.write([]);
}

/* ---------- pure query helpers (usable client-side or server-side) ---------- */

const searchableFields: Array<keyof Contact> = [
  "fullName",
  "firstName",
  "lastName",
  "phone",
  "alternatePhone",
  "email",
  "alternateEmail",
  "company",
  "jobTitle",
  "department",
  "city",
  "district",
  "state",
  "country",
  "category",
  "status",
  "priority",
  "owner",
  "source",
  "id",
];

function digits(s: string) {
  return s.replace(/\D/g, "");
}

export function matchesQuery(c: Contact, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const terms = q.split(/\s+/);
  const haystack = searchableFields
    .map((f) => String(c[f] ?? ""))
    .join(" ")
    .toLowerCase();
  const numeric = digits(q);
  if (numeric.length >= 4) {
    const phones = digits(`${c.phone}${c.alternatePhone}`);
    if (phones.includes(numeric)) return true;
  }
  return terms.every((t) => haystack.includes(t));
}

export function filterContacts(list: Contact[], f: ContactFilters): Contact[] {
  return list.filter((c) => {
    if (f.query && !matchesQuery(c, f.query)) return false;
    if (f.category && c.category !== f.category) return false;
    if (f.company && c.company !== f.company) return false;
    if (f.jobTitle && c.jobTitle !== f.jobTitle) return false;
    if (f.department && c.department !== f.department) return false;
    if (f.city && c.city !== f.city) return false;
    if (f.district && c.district !== f.district) return false;
    if (f.state && c.state !== f.state) return false;
    if (f.country && c.country !== f.country) return false;
    if (f.gender && c.gender !== f.gender) return false;
    if (f.status && c.status !== f.status) return false;
    if (f.priority && c.priority !== f.priority) return false;
    if (f.owner && c.owner !== f.owner) return false;
    if (typeof f.minAge === "number" && c.age < f.minAge) return false;
    if (typeof f.maxAge === "number" && c.age > f.maxAge) return false;
    return true;
  });
}

export function sortContacts(list: Contact[], key: SortKey): Contact[] {
  const copy = [...list]; // never mutate the stored order
  const by = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });
  switch (key) {
    case "name-asc":
      return copy.sort((a, b) => by(a.fullName, b.fullName));
    case "name-desc":
      return copy.sort((a, b) => by(b.fullName, a.fullName));
    case "newest":
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "oldest":
      return copy.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    case "company-asc":
      return copy.sort((a, b) => by(a.company, b.company) || by(a.fullName, b.fullName));
    case "city-asc":
      return copy.sort((a, b) => by(a.city, b.city) || by(a.fullName, b.fullName));
    case "follow-up":
      return copy.sort((a, b) => {
        const aDate = a.nextFollowUpAt ? Date.parse(a.nextFollowUpAt) : Number.MAX_SAFE_INTEGER;
        const bDate = b.nextFollowUpAt ? Date.parse(b.nextFollowUpAt) : Number.MAX_SAFE_INTEGER;
        return aDate - bDate || by(a.fullName, b.fullName);
      });
    default:
      return copy;
  }
}

export async function searchContacts(query: string): Promise<Contact[]> {
  return bootstrap().filter((c) => matchesQuery(c, query));
}

export function toCsv(list: Contact[]): string {
  const cols = Object.keys(normalize({})) as Array<keyof Contact>;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...list.map((c) => cols.map((k) => esc(c[k])).join(","))].join("\n");
}

export function parseCsv(text: string): Array<Record<string, string>> {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      cur.push(field);
      field = "";
    } else if (ch === "\n") {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = "";
    } else if (ch !== "\r") field += ch;
  }
  if (field.length || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (!header) return [];
  return body.map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => {
      obj[h.trim()] = (r[i] ?? "").trim();
    });
    return obj;
  });
}
