import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ContactDetails } from "@/components/ContactDetails";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";

export const Route = createFileRoute("/contacts/$id/")({
  head: () => ({
    meta: [
      { title: "Contact Details — Rolodex" },
      {
        name: "description",
        content:
          "Complete details for a single contact: personal, contact, professional, address and additional information.",
      },
      { property: "og:title", content: "Contact Details — Rolodex" },
      {
        property: "og:description",
        content:
          "View every stored field for this contact and call, email, copy, edit or delete it.",
      },
    ],
  }),
  component: ContactDetailsPage,
});

function ContactDetailsPage() {
  const { id } = useParams({ from: "/contacts/$id/" });
  const { getById, deleteContact, loading } = useContacts();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const contact = getById(id);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />;
  }

  if (!contact) {
    return (
      <EmptyState
        title="Contact not found"
        description="This record may have been deleted. Try searching the database again."
        action={
          <Button asChild>
            <Link to="/contacts">Back to contacts</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/contacts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to contacts
        </Link>
      </Button>

      <ContactDetails contact={contact} onDelete={() => setConfirming(true)} />

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete Contact?"
        description={`Are you sure you want to delete ${contact.fullName}? This action cannot be undone.`}
        onConfirm={async () => {
          await deleteContact(contact.id);
          setConfirming(false);
          toast.success("Contact deleted successfully");
          navigate({ to: "/contacts" });
        }}
      />
    </div>
  );
}
