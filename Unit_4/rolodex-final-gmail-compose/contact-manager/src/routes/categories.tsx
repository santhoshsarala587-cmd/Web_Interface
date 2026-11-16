import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ContactBrowser } from "@/components/ContactBrowser";
import { PageHeader } from "@/components/PageHeader";
import { useContacts } from "@/context/ContactContext";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Contact Categories — Rolodex" },
      {
        name: "description",
        content:
          "Group the contact database by category — personal, business, customer, client, employee, student, vendor, supplier and other.",
      },
      { property: "og:title", content: "Contact Categories — Rolodex" },
      {
        property: "og:description",
        content: "Pick a category to see only the contacts filed under it.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { contacts } = useContacts();
  const [active, setActive] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    CATEGORIES.forEach((c) => map.set(c, 0));
    contacts.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return map;
  }, [contacts]);

  const filtered = useMemo(
    () => (active ? contacts.filter((c) => c.category === active) : contacts),
    [contacts, active],
  );

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Browse contacts grouped by the category they belong to"
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[...counts.entries()].map(([name, count]) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(active === name ? null : name)}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              active === name
                ? "border-primary bg-primary/10"
                : "border-border bg-surface hover:border-primary/40",
            )}
          >
            <p className="label-mono">{name}</p>
            <p className="mt-1 text-2xl font-semibold">{count}</p>
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold">
        {active ? `${active} contacts` : "All categories"}
      </h2>
      <ContactBrowser
        source={filtered}
        emptyTitle="No contacts in this category."
        emptyDescription="Add a contact and assign it to this category."
      />
    </div>
  );
}
