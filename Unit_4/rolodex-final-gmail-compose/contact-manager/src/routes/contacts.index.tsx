import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

import { ContactBrowser } from "@/components/ContactBrowser";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contacts/")({
  head: () => ({
    meta: [
      { title: "All Contacts — Rolodex" },
      {
        name: "description",
        content:
          "Browse the full contact database with search, advanced filters, sorting and pagination across 300+ records.",
      },
      { property: "og:title", content: "All Contacts — Rolodex" },
      {
        property: "og:description",
        content: "Search, filter, sort and page through every contact record in the database.",
      },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <div>
      <PageHeader
        title="All Contacts"
        description="Search the entire database, then open a record for complete details"
        actions={
          <Button asChild>
            <Link to="/contacts/add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Link>
          </Button>
        }
      />
      <ContactBrowser />
    </div>
  );
}
