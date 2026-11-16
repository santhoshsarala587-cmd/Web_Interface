import { Link } from "@tanstack/react-router";
import { Archive, BookmarkPlus, Check, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ContactTable } from "@/components/ContactTable";
import { EmptyState } from "@/components/EmptyState";
import { FilterPanel, activeFilterCount } from "@/components/FilterPanel";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { SortDropdown } from "@/components/SortDropdown";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContacts } from "@/context/ContactContext";
import type { Contact, ContactFilters, ContactStatus, SortKey } from "@/lib/types";
import { CONTACT_STATUSES } from "@/lib/types";
import { filterContacts, sortContacts } from "@/services/contactService";

export function ContactBrowser({
  source,
  defaultSort = "name-asc",
  emptyTitle = "Your contact database is empty.",
  emptyDescription = "Add your first contact to get started.",
}: {
  source?: Contact[];
  defaultSort?: SortKey;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const {
    contacts,
    deleteContact,
    loading,
    bulkUpdate,
    archiveContacts,
    savedViews,
    addSavedView,
    deleteSavedView,
  } = useContacts();
  const list = source ?? contacts;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ContactFilters>({});
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pending, setPending] = useState<Contact | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ContactStatus | "">("");

  const results = useMemo(
    () => sortContacts(filterContacts(list, { ...filters, query }), sort),
    [list, filters, query, sort],
  );

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [query, filters, pageSize, sort]);

  const pageItems = results.slice((page - 1) * pageSize, page * pageSize);
  const searching = query.trim().length > 0 || activeFilterCount(filters) > 0;
  const selectedCount = selectedIds.length;

  const clearAll = () => {
    setFilters({});
    setQuery("");
    toast.success("Filters cleared");
  };

  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const toggleAll = (checked: boolean) =>
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, ...pageItems.map((item) => item.id)]))
        : current.filter((id) => !pageItems.some((item) => item.id === id)),
    );

  const saveView = () => {
    const name = window.prompt(
      "Name this saved view",
      filters.status ? `${filters.status} contacts` : "My contact view",
    );
    if (name?.trim()) addSavedView(name.trim(), { ...filters, query });
  };

  const applyView = (id: string) => {
    const view = savedViews.find((item) => item.id === id);
    if (!view) return;
    setFilters(view.filters);
    setQuery(view.filters.query ?? "");
    toast.success(`Loaded ${view.name}`);
  };

  const confirmDelete = async () => {
    if (!pending) return;
    await deleteContact(pending.id);
    setPending(null);
    toast.success("Contact removed");
  };

  const applyBulkStatus = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    await bulkUpdate(selectedIds, { status: bulkStatus });
    setSelectedIds([]);
    setBulkStatus("");
  };

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} resultCount={results.length} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterPanel contacts={list} filters={filters} onChange={setFilters} onClear={clearAll} />
          <SortDropdown value={sort} onChange={setSort} />
          <Button variant="outline" className="h-10" onClick={saveView}>
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Save view
          </Button>
          {activeFilterCount(filters) > 0 ? (
            <Button variant="ghost" className="h-10" onClick={clearAll}>
              Clear Filters
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {savedViews.length > 0 ? (
            <Select onValueChange={applyView}>
              <SelectTrigger className="h-10 w-[190px]">
                <SelectValue placeholder="Saved views" />
              </SelectTrigger>
              <SelectContent>
                {savedViews.map((view) => (
                  <SelectItem key={view.id} value={view.id}>
                    {view.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {searching ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{results.length}</span> found
            </p>
          ) : null}
        </div>
      </div>

      {selectedCount > 0 ? (
        <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Check className="h-4 w-4 text-primary" />
            {selectedCount} selected
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <Select
              value={bulkStatus}
              onValueChange={(value) => setBulkStatus(value as ContactStatus)}
            >
              <SelectTrigger className="h-9 w-[170px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={applyBulkStatus} disabled={!bulkStatus}>
              Apply
            </Button>
            <Button size="sm" variant="outline" onClick={() => archiveContacts(selectedIds)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      ) : results.length === 0 ? (
        list.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={<UserPlus className="h-6 w-6" />}
            action={
              <Button asChild>
                <Link to="/contacts/add">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No contacts found"
            description="Try another search or clear your filters."
            action={
              <Button variant="outline" onClick={clearAll}>
                Clear Search
              </Button>
            }
          />
        )
      ) : (
        <>
          <ContactTable
            contacts={pageItems}
            selectedIds={selectedIds}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onDelete={setPending}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={results.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {savedViews.length > 0 ? (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {savedViews.map((view) => (
            <span
              key={view.id}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1"
            >
              {view.name}
              <button
                type="button"
                onClick={() => deleteSavedView(view.id)}
                aria-label={`Delete ${view.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <ConfirmDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        title="Remove Contact?"
        description={`Are you sure you want to remove ${pending?.fullName ?? "this contact"}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
