import { SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  CATEGORIES,
  CONTACT_PRIORITIES,
  CONTACT_STATUSES,
  GENDERS,
  type Contact,
  type ContactFilters,
} from "@/lib/types";

const ANY = "__any__";

function uniqueValues(list: Contact[], key: keyof Contact) {
  return [...new Set(list.map((c) => String(c[key] ?? "")).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

type SelectKey = Extract<
  keyof ContactFilters,
  | "category"
  | "company"
  | "jobTitle"
  | "department"
  | "city"
  | "district"
  | "state"
  | "country"
  | "gender"
  | "status"
  | "priority"
  | "owner"
>;

function FilterFields({
  contacts,
  filters,
  onChange,
}: {
  contacts: Contact[];
  filters: ContactFilters;
  onChange: (f: ContactFilters) => void;
}) {
  const options = useMemo(
    () => ({
      company: uniqueValues(contacts, "company"),
      jobTitle: uniqueValues(contacts, "jobTitle"),
      department: uniqueValues(contacts, "department"),
      city: uniqueValues(contacts, "city"),
      district: uniqueValues(contacts, "district"),
      state: uniqueValues(contacts, "state"),
      country: uniqueValues(contacts, "country"),
      owner: uniqueValues(contacts, "owner"),
    }),
    [contacts],
  );

  const set = (key: SelectKey, value: string) =>
    onChange({ ...filters, [key]: value === ANY ? undefined : value });

  const field = (key: SelectKey, label: string, values: string[]) => (
    <div className="space-y-1.5">
      <Label className="label-mono">{label}</Label>
      <Select value={filters[key] ?? ANY} onValueChange={(v) => set(key, v)}>
        <SelectTrigger className="bg-surface">
          <SelectValue placeholder={`Any ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value={ANY}>Any {label.toLowerCase()}</SelectItem>
          {values.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {field("category", "Category", [...CATEGORIES])}
      {field("company", "Company", options.company)}
      {field("jobTitle", "Job Title", options.jobTitle)}
      {field("department", "Department", options.department)}
      {field("city", "City", options.city)}
      {field("district", "District", options.district)}
      {field("state", "State", options.state)}
      {field("country", "Country", options.country)}
      {field("gender", "Gender", [...GENDERS])}
      {field("status", "Status", [...CONTACT_STATUSES])}
      {field("priority", "Priority", [...CONTACT_PRIORITIES])}
      {field("owner", "Owner", options.owner)}
      <div className="space-y-1.5">
        <Label className="label-mono">Age Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            className="bg-surface"
            value={filters.minAge ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minAge: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            className="bg-surface"
            value={filters.maxAge ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxAge: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function activeFilterCount(filters: ContactFilters) {
  const { query: _query, ...rest } = filters;
  return Object.values(rest).filter((v) => v !== undefined && v !== "").length;
}

export function FilterPanel({
  contacts,
  filters,
  onChange,
  onClear,
}: {
  contacts: Contact[];
  filters: ContactFilters;
  onChange: (f: ContactFilters) => void;
  onClear: () => void;
}) {
  const count = activeFilterCount(filters);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10 justify-start bg-surface">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {count > 0 ? (
            <Badge className="ml-2 h-5 px-1.5 font-mono text-[10px]">{count}</Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Advanced filters</SheetTitle>
        </SheetHeader>
        <FilterFields contacts={contacts} filters={filters} onChange={onChange} />
        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={onClear} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
