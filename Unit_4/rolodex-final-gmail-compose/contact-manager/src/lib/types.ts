export const CATEGORIES = [
  "Personal",
  "Business",
  "Customer",
  "Client",
  "Employee",
  "Student",
  "Vendor",
  "Supplier",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;
export type Gender = (typeof GENDERS)[number];

export const CONTACT_STATUSES = [
  "Active",
  "Prospect",
  "Customer",
  "Partner",
  "Inactive",
  "Archived",
] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_PRIORITIES = ["Low", "Normal", "High", "Critical"] as const;
export type ContactPriority = (typeof CONTACT_PRIORITIES)[number];

export const CONTACT_SOURCES = [
  "Manual",
  "Import",
  "Referral",
  "Website",
  "Event",
  "Other",
] as const;
export type ContactSource = (typeof CONTACT_SOURCES)[number];

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  alternateEmail: string;
  gender: Gender | string;
  age: number;
  dateOfBirth: string;
  company: string;
  jobTitle: string;
  department: string;
  address: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  website: string;
  linkedin: string;
  category: Category | string;
  status: ContactStatus | string;
  priority: ContactPriority | string;
  tags: string[];
  owner: string;
  source: ContactSource | string;
  lastContactedAt: string;
  nextFollowUpAt: string;
  preferredChannel: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export type ContactInput = Omit<Contact, "id" | "fullName" | "age" | "createdAt" | "updatedAt"> &
  Partial<Pick<Contact, "id" | "fullName" | "age" | "createdAt" | "updatedAt">>;

export interface ContactFilters {
  query?: string | undefined;
  category?: string | undefined;
  company?: string | undefined;
  jobTitle?: string | undefined;
  department?: string | undefined;
  city?: string | undefined;
  district?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  gender?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  owner?: string | undefined;
  minAge?: number | undefined;
  maxAge?: number | undefined;
}

export type SortKey =
  "name-asc" | "name-desc" | "newest" | "oldest" | "company-asc" | "city-asc" | "follow-up";

export interface SavedView {
  id: string;
  name: string;
  filters: ContactFilters;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: "created" | "updated" | "imported" | "archived" | "exported";
  message: string;
  contactId?: string;
  createdAt: string;
}
