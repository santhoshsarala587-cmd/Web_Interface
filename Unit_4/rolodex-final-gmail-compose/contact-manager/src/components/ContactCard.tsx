import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Mail, MapPin, Phone } from "lucide-react";

import { ContactAvatar } from "@/components/ContactAvatar";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/lib/types";

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      <div className="flex items-start gap-3">
        <ContactAvatar contact={contact} size={44} className="ring-2 ring-border" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{contact.fullName}</p>
          <p className="truncate text-sm text-muted-foreground">{contact.jobTitle}</p>
        </div>
        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-1">
          <Badge variant="outline" className="text-xs">
            {contact.status}
          </Badge>
          <Badge
            variant={contact.priority === "Critical" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {contact.priority}
          </Badge>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 truncate">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          {contact.company || "—"}
        </p>
        <p className="flex items-center gap-2 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {[contact.city, contact.state].filter(Boolean).join(" • ") || "—"}
        </p>
        <p className="flex items-center gap-2 truncate font-mono text-xs">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {contact.phone}
        </p>
        <p className="flex items-center gap-2 truncate text-xs">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          {contact.email}
        </p>
      </div>

      {contact.nextFollowUpAt ? (
        <p className="text-xs text-muted-foreground">
          Follow-up: <span className="font-medium text-foreground">{contact.nextFollowUpAt}</span>
        </p>
      ) : null}

      <Link
        to="/contacts/$id"
        params={{ id: contact.id }}
        className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        View Details{" "}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
