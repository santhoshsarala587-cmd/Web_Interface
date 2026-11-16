import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactAvatar } from "@/components/ContactAvatar";
import { ContactCard } from "@/components/ContactCard";
import type { Contact } from "@/lib/types";

export function ContactTable({
  contacts,
  selectedIds,
  onToggle,
  onToggleAll,
  onDelete,
}: {
  contacts: Contact[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onDelete: (contact: Contact) => void;
}) {
  const navigate = useNavigate();
  const allSelected =
    contacts.length > 0 && contacts.every((contact) => selectedIds.includes(contact.id));

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {contacts.map((c) => (
          <ContactCard key={c.id} contact={c} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-surface lg:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onToggleAll(checked === true)}
                  aria-label="Select all visible contacts"
                />
              </TableHead>
              <TableHead className="w-[130px] label-mono">ID</TableHead>
              <TableHead className="label-mono">Name</TableHead>
              <TableHead className="label-mono">Company</TableHead>
              <TableHead className="label-mono">Status</TableHead>
              <TableHead className="label-mono">Priority</TableHead>
              <TableHead className="label-mono">Follow-up</TableHead>
              <TableHead className="label-mono">City</TableHead>
              <TableHead className="w-[120px] text-right label-mono">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer"
                onClick={() => navigate({ to: "/contacts/$id", params: { id: c.id } })}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(c.id)}
                    onCheckedChange={() => onToggle(c.id)}
                    aria-label={`Select ${c.fullName}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2.5">
                    <ContactAvatar contact={c} size={28} />
                    <span className="truncate">{c.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{c.company || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={c.status === "Archived" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={c.priority === "Critical" ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {c.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {c.nextFollowUpAt || "—"}
                </TableCell>
                <TableCell className="text-sm">{c.city || "—"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to="/contacts/$id" params={{ id: c.id }} aria-label="View contact">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to="/contacts/$id/edit" params={{ id: c.id }} aria-label="Edit contact">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label="Delete contact"
                      onClick={() => onDelete(c)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
