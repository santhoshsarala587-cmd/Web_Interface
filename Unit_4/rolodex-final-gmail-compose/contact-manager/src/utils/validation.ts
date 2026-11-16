import type { Contact } from "@/lib/types";

export type Errors = Record<string, string>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^[+]?[\d\s()-]{7,20}$/;

export function validateContact(v: Partial<Contact>): Errors {
  const e: Errors = {};
  if (!v.firstName?.trim()) e["firstName"] = "First name is required";
  if (!v.lastName?.trim()) e["lastName"] = "Last name is required";
  if (!v.phone?.trim()) e["phone"] = "Phone is required";
  else if (!phoneRe.test(v.phone.trim())) e["phone"] = "Enter a valid phone number";
  if (v.alternatePhone?.trim() && !phoneRe.test(v.alternatePhone.trim()))
    e["alternatePhone"] = "Enter a valid phone number";
  if (!v.email?.trim()) e["email"] = "Email is required";
  else if (!emailRe.test(v.email.trim())) e["email"] = "Enter a valid email address";
  if (v.alternateEmail?.trim() && !emailRe.test(v.alternateEmail.trim()))
    e["alternateEmail"] = "Enter a valid email address";
  if (v.pincode?.trim() && v.pincode.trim().length > 12) e["pincode"] = "Pincode is too long";
  if (v.website?.trim() && !/^https?:\/\/.+\..+/.test(v.website.trim()))
    e["website"] = "Use a full URL starting with http(s)://";
  if (v.linkedin?.trim() && !/^https?:\/\/.+\..+/.test(v.linkedin.trim()))
    e["linkedin"] = "Use a full URL starting with http(s)://";
  if (v.dateOfBirth?.trim() && Number.isNaN(Date.parse(v.dateOfBirth)))
    e["dateOfBirth"] = "Enter a valid date";
  return e;
}

/** Shape-check a record coming from an import file. */
export function isImportableContact(r: unknown): r is Partial<Contact> {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  const name = [o["firstName"], o["lastName"], o["fullName"]].some(
    (x) => typeof x === "string" && x.trim().length > 0,
  );
  const reach = [o["phone"], o["email"]].some((x) => typeof x === "string" && x.trim().length > 0);
  return name && reach;
}

export function ageFromDob(dob: string): number {
  const d = Date.parse(dob);
  if (Number.isNaN(d)) return 0;
  const birth = new Date(d);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age < 0 || age > 130 ? 0 : age;
}
