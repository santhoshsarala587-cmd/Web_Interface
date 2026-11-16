import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { useContacts } from "@/context/ContactContext";

export const Route = createFileRoute("/contacts/add")({
  head: () => ({
    meta: [
      { title: "Add Contact — Rolodex" },
      {
        name: "description",
        content:
          "Create a new contact record with personal, contact, professional and address information.",
      },
      { property: "og:title", content: "Add Contact — Rolodex" },
      {
        property: "og:description",
        content: "Add a complete new record to your contact database in one form.",
      },
    ],
  }),
  component: AddContactPage,
});

function AddContactPage() {
  const { addContact } = useContacts();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Add Contact"
        description="Enter the complete information for the new record"
      />
      <ContactForm
        submitLabel="Add Contact"
        onSubmit={async (values) => {
          const created = await addContact(values);
          toast.success("Contact added successfully");
          navigate({ to: "/contacts/$id", params: { id: created.id } });
        }}
        onCancel={() => navigate({ to: "/contacts" })}
      />
    </div>
  );
}
