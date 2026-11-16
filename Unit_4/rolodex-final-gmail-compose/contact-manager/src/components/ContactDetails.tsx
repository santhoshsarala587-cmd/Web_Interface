import { Link } from "@tanstack/react-router";
import { Copy, ExternalLink, Mail, Pencil, PhoneCall, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ContactAvatar } from "@/components/ContactAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/types";

function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

/** Opens Gmail's compose window with a ready-to-edit draft. */
function buildGmailComposeUrl(email: string, firstName: string) {
  if (!email) return "";
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: email,
    su: `Hello ${firstName}`,
    body: `Hi ${firstName},\n\nI wanted to get in touch with you.\n\nBest regards,`,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function buildEmailUrl(contact: Contact) {
  if (!contact.email) return "";
  const firstName = contact.firstName || contact.fullName;
  return buildGmailComposeUrl(contact.email, firstName);
}

function formatDate(value: string) {
  if (!value) return "—";
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return new Date(t).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
  });
}

async function copy(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error(`Could not copy ${label.toLowerCase()}`);
  }
}

function Row({
  label,
  value,
  href,
  mono,
}: {
  label: string;
  value?: string | number | undefined;
  href?: string | undefined;
  mono?: boolean | undefined;
}) {
  const shown = value === undefined || value === "" ? "—" : String(value);
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/70 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="w-40 shrink-0 label-mono">{label}</span>
      {href && shown !== "—" ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="break-all text-sm text-primary hover:underline"
        >
          {shown}
        </a>
      ) : (
        <span className={`break-words text-sm ${mono ? "font-mono" : ""}`}>{shown}</span>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function ActionLabel({ children }: { children: React.ReactNode }) {
  return <span className="truncate">{children}</span>;
}

export function ContactDetails({ contact, onDelete }: { contact: Contact; onDelete: () => void }) {
  const phoneHref = contact.phone ? `tel:${cleanPhone(contact.phone)}` : "";
  const emailHref = buildEmailUrl(contact);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ContactAvatar contact={contact} size={72} className="ring-2 ring-border" />
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight">{contact.fullName}</h2>
            <p className="text-sm text-muted-foreground">
              {[contact.jobTitle, contact.company].filter(Boolean).join(" · ") || "—"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="font-mono text-[11px]">
                {contact.id}
              </Badge>
              <Badge className="text-[11px]">{contact.category}</Badge>
              <Badge variant="secondary" className="text-[11px]">
                {contact.status}
              </Badge>
              <Badge
                variant={contact.priority === "Critical" ? "destructive" : "outline"}
                className="text-[11px]"
              >
                {contact.priority} priority
              </Badge>
              {contact.department ? (
                <Badge variant="secondary" className="text-[11px]">
                  {contact.department}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="mb-2 label-mono">Quick actions</p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {phoneHref ? (
              <Button asChild className="h-11 w-full justify-center sm:w-auto sm:min-w-28">
                <a
                  href={phoneHref}
                  aria-label={`Call ${contact.fullName}`}
                  title="Open your phone dial pad"
                >
                  <PhoneCall className="mr-2 h-4 w-4 shrink-0" />
                  <ActionLabel>Call</ActionLabel>
                </a>
              </Button>
            ) : (
              <Button disabled className="h-11 w-full justify-center sm:w-auto sm:min-w-28">
                <PhoneCall className="mr-2 h-4 w-4 shrink-0" />
                <ActionLabel>No phone</ActionLabel>
              </Button>
            )}
            {emailHref ? (
              <Button
                asChild
                variant="outline"
                className="h-11 w-full justify-center sm:w-auto sm:min-w-28"
              >
                <a
                  href={emailHref}
                  aria-label={`Email ${contact.fullName}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open a Gmail compose draft"
                >
                  <Mail className="mr-2 h-4 w-4 shrink-0" />
                  <ActionLabel>Email draft</ActionLabel>
                </a>
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="h-11 w-full justify-center sm:w-auto sm:min-w-28"
              >
                <Mail className="mr-2 h-4 w-4 shrink-0" />
                <ActionLabel>No email</ActionLabel>
              </Button>
            )}
            <Button
              variant="outline"
              className="h-11 w-full justify-center sm:w-auto"
              onClick={() => copy(contact.phone, "Phone number")}
              disabled={!contact.phone}
            >
              <Copy className="mr-2 h-4 w-4 shrink-0" />
              <ActionLabel>Copy phone</ActionLabel>
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full justify-center sm:w-auto"
              onClick={() => copy(contact.email, "Email address")}
              disabled={!contact.email}
            >
              <Copy className="mr-2 h-4 w-4 shrink-0" />
              <ActionLabel>Copy email</ActionLabel>
            </Button>
            <Button asChild variant="secondary" className="h-11 w-full justify-center sm:w-auto">
              <Link to="/contacts/$id/edit" params={{ id: contact.id }}>
                <Pencil className="mr-2 h-4 w-4 shrink-0" />
                <ActionLabel>Edit</ActionLabel>
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="h-11 w-full justify-center sm:w-auto"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4 shrink-0" />
              <ActionLabel>Delete</ActionLabel>
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            Call opens your device dialer. Email opens Gmail compose with the recipient, subject,
            and message body ready to edit before sending.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Personal Information">
          <Row label="Full Name" value={contact.fullName} />
          <Row label="Gender" value={contact.gender} />
          <Row label="Age" value={contact.age || "—"} />
          <Row label="Date of Birth" value={formatDate(contact.dateOfBirth)} />
        </Section>

        <Section title="Contact Information">
          <Row label="Phone" value={contact.phone} href={phoneHref} mono />
          <Row
            label="Alternate Phone"
            value={contact.alternatePhone}
            href={contact.alternatePhone ? `tel:${cleanPhone(contact.alternatePhone)}` : undefined}
            mono
          />
          <Row label="Email" value={contact.email} href={emailHref} />
          <Row
            label="Alternate Email"
            value={contact.alternateEmail}
            href={
              contact.alternateEmail
                ? buildGmailComposeUrl(
                    contact.alternateEmail,
                    contact.firstName || contact.fullName,
                  )
                : undefined
            }
          />
        </Section>

        <Section title="Professional Information">
          <Row label="Company" value={contact.company} />
          <Row label="Job Title" value={contact.jobTitle} />
          <Row label="Department" value={contact.department} />
          <Row label="Website" value={contact.website} href={contact.website || undefined} />
          <Row label="LinkedIn" value={contact.linkedin} href={contact.linkedin || undefined} />
        </Section>

        <Section title="Address Information">
          <Row label="Address" value={contact.address} />
          <Row label="City" value={contact.city} />
          <Row label="District" value={contact.district} />
          <Row label="State" value={contact.state} />
          <Row label="Country" value={contact.country} />
          <Row label="Pincode" value={contact.pincode} mono />
        </Section>

        <Section title="Additional Information">
          <Row label="Category" value={contact.category} />
          <Row label="Status" value={contact.status} />
          <Row label="Priority" value={contact.priority} />
          <Row label="Owner" value={contact.owner} />
          <Row label="Tags" value={contact.tags?.join(", ")} />
          <Row label="Source" value={contact.source} />
          <Row label="Preferred Channel" value={contact.preferredChannel} />
          <Row label="Last Contacted" value={formatDate(contact.lastContactedAt)} />
          <Row label="Next Follow-up" value={formatDate(contact.nextFollowUpAt)} />
          <Row label="Notes" value={contact.notes} />
          <Row label="Created At" value={formatDate(contact.createdAt)} />
          <Row label="Updated At" value={formatDate(contact.updatedAt)} />
        </Section>
      </div>
    </div>
  );
}
