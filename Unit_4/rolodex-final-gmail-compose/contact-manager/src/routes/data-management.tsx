import { createFileRoute } from "@tanstack/react-router";
import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useContacts } from "@/context/ContactContext";
import type { Contact } from "@/lib/types";
import { parseCsv, toCsv } from "@/services/contactService";
import { isImportableContact } from "@/utils/validation";

export const Route = createFileRoute("/data-management")({
  head: () => ({
    meta: [
      { title: "Data Management — Rolodex" },
      {
        name: "description",
        content: "Export the contact database as JSON or CSV, and import validated contact files.",
      },
      { property: "og:title", content: "Data Management — Rolodex" },
      {
        property: "og:description",
        content: "Back up or restore your contact records with JSON and CSV import/export.",
      },
    ],
  }),
  component: DataManagementPage,
});

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function DataManagementPage() {
  const { contacts, importContacts } = useContacts();
  const fileRef = useRef<HTMLInputElement>(null);
  const [replace, setReplace] = useState(false);

  const exportJson = () => {
    download("contacts.json", JSON.stringify(contacts, null, 2), "application/json");
    toast.success("Contacts exported");
  };

  const exportCsv = () => {
    download("contacts.csv", toCsv(contacts), "text/csv");
    toast.success("Contacts exported");
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    let records: unknown[] = [];
    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        const parsed = JSON.parse(text);
        records = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        records = parseCsv(text);
      }
    } catch {
      toast.error("That file could not be read");
      return;
    }

    const valid = records.filter(isImportableContact) as Array<Partial<Contact>>;
    const skipped = records.length - valid.length;
    if (valid.length === 0) {
      toast.error("No valid contact records found in the file");
      return;
    }
    const added = await importContacts(valid, replace);
    toast.success(`Contacts imported — ${added} added${skipped > 0 ? `, ${skipped} skipped` : ""}`);
  };

  return (
    <div>
      <PageHeader title="Data Management" description="Export a backup or import contact records" />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Export Contacts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Download all {contacts.length} records currently in the database.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={exportJson}>
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Import Contacts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Accepts JSON or CSV. Records are validated first, and new unique IDs are generated when
            needed.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <Label htmlFor="replace" className="text-sm">
              Replace existing records
            </Label>
            <Switch id="replace" checked={replace} onCheckedChange={setReplace} />
          </div>
          <div className="mt-4">
            <input
              ref={fileRef}
              type="file"
              accept=".json,.csv,application/json,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = "";
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Choose file
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
