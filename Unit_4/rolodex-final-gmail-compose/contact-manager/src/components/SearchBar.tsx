import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({
  value,
  onChange,
  resultCount,
  placeholder = "Search contacts by name, phone, email, company...",
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount?: number;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search contacts"
          className="h-11 bg-surface pl-9 pr-9 text-base"
        />
        {value ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      {typeof resultCount === "number" ? (
        <span className="shrink-0 rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-muted-foreground">
          {resultCount} match{resultCount === 1 ? "" : "es"}
        </span>
      ) : null}
    </div>
  );
}
