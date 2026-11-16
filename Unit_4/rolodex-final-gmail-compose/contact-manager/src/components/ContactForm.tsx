import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES,
  CONTACT_PRIORITIES,
  CONTACT_SOURCES,
  CONTACT_STATUSES,
  GENDERS,
  type Contact,
} from "@/lib/types";
import { validateContact, type Errors } from "@/utils/validation";

type FormState = Record<string, string>;

const fields = [
  "firstName",
  "lastName",
  "phone",
  "alternatePhone",
  "email",
  "alternateEmail",
  "gender",
  "dateOfBirth",
  "company",
  "jobTitle",
  "department",
  "address",
  "city",
  "district",
  "state",
  "country",
  "pincode",
  "website",
  "linkedin",
  "category",
  "status",
  "priority",
  "tags",
  "owner",
  "source",
  "lastContactedAt",
  "nextFollowUpAt",
  "preferredChannel",
  "notes",
] as const;

function initialState(contact?: Contact): FormState {
  const s: FormState = {};
  fields.forEach((f) => {
    s[f] = contact ? String(contact[f as keyof Contact] ?? "") : "";
  });
  if (!contact) {
    s["country"] = "India";
    s["category"] = "Business";
    s["status"] = "Active";
    s["priority"] = "Normal";
    s["source"] = "Manual";
    s["preferredChannel"] = "Email";
    s["owner"] = "Unassigned";
  }
  return s;
}

export function ContactForm({
  contact,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  contact?: Contact;
  submitLabel: string;
  onSubmit: (values: Partial<Contact>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormState>(() => initialState(contact));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const text = (key: string, label: string, extra?: { type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <Label htmlFor={key} className="label-mono">
        {label}
      </Label>
      <Input
        id={key}
        type={extra?.type ?? "text"}
        placeholder={extra?.placeholder}
        value={values[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
        className="bg-surface"
        aria-invalid={!!errors[key]}
      />
      {errors[key] ? <p className="text-xs text-destructive">{errors[key]}</p> : null}
    </div>
  );

  const choose = (key: string, label: string, options: readonly string[]) => (
    <div className="space-y-1.5">
      <Label className="label-mono">{label}</Label>
      <Select value={values[key] || ""} onValueChange={(v) => set(key, v)}>
        <SelectTrigger className="bg-surface" aria-label={label}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const section = (title: string, children: React.ReactNode) => (
    <section className="rounded-lg border border-border bg-surface/40 p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateContact(values as Partial<Contact>);
    setErrors(found);
    if (Object.keys(found).some((k) => found[k])) return;
    setSaving(true);
    try {
      await onSubmit(values as Partial<Contact>);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {section(
        "Personal Information",
        <>
          {text("firstName", "First Name *")}
          {text("lastName", "Last Name *")}
          {choose("gender", "Gender", GENDERS)}
          {text("dateOfBirth", "Date of Birth", { type: "date" })}
        </>,
      )}
      {section(
        "Contact Information",
        <>
          {text("phone", "Phone *", { placeholder: "+91 98765 43210" })}
          {text("alternatePhone", "Alternate Phone")}
          {text("email", "Email *", { placeholder: "name@company.com" })}
          {text("alternateEmail", "Alternate Email")}
        </>,
      )}
      {section(
        "Professional Information",
        <>
          {text("company", "Company")}
          {text("jobTitle", "Job Title")}
          {text("department", "Department")}
          {text("website", "Website", { placeholder: "https://" })}
          {text("linkedin", "LinkedIn", { placeholder: "https://linkedin.com/in/…" })}
        </>,
      )}
      {section(
        "Address Information",
        <>
          <div className="sm:col-span-2 lg:col-span-3">{text("address", "Address")}</div>
          {text("city", "City")}
          {text("district", "District")}
          {text("state", "State")}
          {text("country", "Country")}
          {text("pincode", "Pincode")}
        </>,
      )}
      {section(
        "Additional Information",
        <>
          {choose("category", "Category", CATEGORIES)}
          {choose("status", "Status", CONTACT_STATUSES)}
          {choose("priority", "Priority", CONTACT_PRIORITIES)}
          {choose("source", "Source", CONTACT_SOURCES)}
          {choose("preferredChannel", "Preferred Channel", [
            "Email",
            "Phone",
            "WhatsApp",
            "LinkedIn",
            "Other",
          ])}
          {text("owner", "Owner", { placeholder: "Unassigned" })}
          {text("tags", "Tags", { placeholder: "vip, investor, partner" })}
          {text("lastContactedAt", "Last Contacted", { type: "date" })}
          {text("nextFollowUpAt", "Next Follow-up", { type: "date" })}
          <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
            <Label htmlFor="notes" className="label-mono">
              Notes
            </Label>
            <Textarea
              id="notes"
              rows={3}
              value={values["notes"] ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              className="bg-surface"
            />
          </div>
        </>,
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={saving} className="sm:w-auto">
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
