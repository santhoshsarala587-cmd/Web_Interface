import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { ContactBrowser } from "@/components/ContactBrowser";
import { PageHeader } from "@/components/PageHeader";
import { useContacts } from "@/context/ContactContext";
import { sortContacts } from "@/services/contactService";

export const Route = createFileRoute("/recent")({
  head: () => ({
    meta: [
      { title: "Recently Added Contacts — Rolodex" },
      {
        name: "description",
        content:
          "The newest records in your contact database, ordered by the date they were created.",
      },
      { property: "og:title", content: "Recently Added Contacts — Rolodex" },
      {
        property: "og:description",
        content: "See the latest additions to the database, including contacts you just created.",
      },
    ],
  }),
  component: RecentPage,
});

function RecentPage() {
  const { contacts } = useContacts();
  const recent = useMemo(() => sortContacts(contacts, "newest").slice(0, 60), [contacts]);

  return (
    <div>
      <PageHeader
        title="Recently Added"
        description="The 60 newest records, ordered by creation date"
      />
      <ContactBrowser
        source={recent}
        defaultSort="newest"
        emptyTitle="Nothing added yet."
        emptyDescription="New contacts you create will appear here automatically."
      />
    </div>
  );
}
