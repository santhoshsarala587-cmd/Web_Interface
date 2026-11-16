import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import { STORAGE_KEY } from "@/utils/storage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Rolodex" },
      {
        name: "description",
        content:
          "Database settings: restore the built-in contact dataset or clear all locally stored records.",
      },
      { property: "og:title", content: "Settings — Rolodex" },
      {
        property: "og:description",
        content: "Control how the contact database is stored, restored and cleared on this device.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { contacts, resetDatabase, clearDatabase } = useContacts();
  const [confirm, setConfirm] = useState<"reset" | "clear" | null>(null);

  return (
    <div>
      <PageHeader title="Settings" description="Storage and database maintenance" />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Storage</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between border-b border-border/70 pb-2">
              <dt className="text-muted-foreground">Records stored</dt>
              <dd className="font-medium">{contacts.length}</dd>
            </div>
            <div className="flex justify-between border-b border-border/70 pb-2">
              <dt className="text-muted-foreground">Storage mode</dt>
              <dd className="font-medium">Browser local storage</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Storage key</dt>
              <dd className="font-mono text-xs">{STORAGE_KEY}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            Everything you add, edit or delete stays on this device and survives a refresh. The data
            layer is isolated, so a server API can replace it later without UI changes.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Database actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These actions affect all stored records on this device.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setConfirm("reset")}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore built-in dataset
            </Button>
            <Button variant="destructive" onClick={() => setConfirm("clear")}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete all contacts
            </Button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm === "clear" ? "Delete all contacts?" : "Restore built-in dataset?"}
        description={
          confirm === "clear"
            ? "Every record on this device will be removed. This action cannot be undone."
            : "The original 320 built-in records will replace everything currently stored, including contacts you added."
        }
        confirmLabel={confirm === "clear" ? "Delete all" : "Restore"}
        onConfirm={async () => {
          if (confirm === "clear") await clearDatabase();
          else await resetDatabase();
          setConfirm(null);
        }}
      />
    </div>
  );
}
