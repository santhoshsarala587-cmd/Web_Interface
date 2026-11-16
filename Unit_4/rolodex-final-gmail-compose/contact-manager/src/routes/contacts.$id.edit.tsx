import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { ContactForm } from "@/components/ContactForm";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";

export const Route = createFileRoute("/contacts/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Contact — Rolodex" },
      {
        name: "description",
        content: "Update the stored information for an existing contact record.",
      },
      { property: "og:title", content: "Edit Contact — Rolodex" },
      {
        property: "og:description",
        content: "Modify any field of a contact record while keeping its unique ID.",
      },
    ],
  }),
  component: EditContactPage,
});

function EditContactPage() {
  const { id } = useParams({ from: "/contacts/$id/edit" });
  const { getById, updateContact, loading } = useContacts();
  const navigate = useNavigate();
  const contact = getById(id);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />;
  }

  if (!contact) {
    return (
      <EmptyState
        title="Contact not found"
        description="This record no longer exists in the database."
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
      <PageHeader
        title="Edit Contact"
        description={`Updating ${contact.fullName} · ${contact.id}`}
      />
      <ContactForm
        contact={contact}
        submitLabel="Save Changes"
        onSubmit={async (values) => {
          await updateContact(contact.id, values);
          toast.success("Contact updated successfully");
          navigate({ to: "/contacts/$id", params: { id: contact.id } });
        }}
        onCancel={() => navigate({ to: "/contacts/$id", params: { id: contact.id } })}
      />
    </div>
  );
}
