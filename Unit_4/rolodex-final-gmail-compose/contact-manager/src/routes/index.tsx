import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, UserPlus, Users } from "lucide-react";
import { useMemo } from "react";

import { ContactAvatar } from "@/components/ContactAvatar";
import { ContactCard } from "@/components/ContactCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import { sortContacts } from "@/services/contactService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rolodex — Management Dashboard" },
      {
        name: "description",
        content:
          "A management cockpit for contact health, follow-ups, and relationship operations.",
      },
    ],
  }),
  component: Dashboard,
});

const accents = [
  "bg-primary/15 text-primary",
  "bg-sky-500/15 text-sky-500",
  "bg-emerald-500/15 text-emerald-500",
  "bg-fuchsia-500/15 text-fuchsia-500",
];

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 0,
  to,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: typeof Users;
  accent?: number;
  to?: string;
}) {
  const content = (
    <div className="group rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        <span
          className={`grid h-9 w-9 place-items-center rounded-full ${accents[accent % accents.length]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function Dashboard() {
  const { contacts, loading, activities } = useContacts();
  const metrics = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    const missing = contacts.filter((c) => !c.email || !c.phone).length;
    const followUps = contacts
      .filter((c) => c.nextFollowUpAt)
      .sort((a, b) => Date.parse(a.nextFollowUpAt) - Date.parse(b.nextFollowUpAt));
    const overdue = followUps.filter((c) => Date.parse(c.nextFollowUpAt) < Date.now()).length;
    const companies = new Set(contacts.map((c) => c.company).filter(Boolean));
    const categories = new Set(contacts.map((c) => c.category).filter(Boolean));
    const recent = sortContacts(contacts, "newest").slice(0, 6);
    return {
      missing,
      followUps,
      overdue,
      companies,
      categories,
      recent,
      recentCount: contacts.filter((c) => Date.parse(c.createdAt) >= cutoff).length,
    };
  }, [contacts]);

  return (
    <div>
      <PageHeader
        title="Good morning, manager"
        description="A clear view of your relationship database and the work that needs attention today."
        actions={
          <>
            <Button asChild>
              <Link to="/contacts/add">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Contact
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contacts">Open database</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Contacts"
          value={contacts.length}
          hint={`${metrics.companies.size} companies covered`}
          icon={Users}
          accent={0}
          to="/contacts"
        />
        <StatCard
          label="New This Month"
          value={metrics.recentCount}
          hint="Records created in 30 days"
          icon={Clock3}
          accent={1}
          to="/recent"
        />
        <StatCard
          label="Follow-ups Due"
          value={metrics.overdue}
          hint={`${metrics.followUps.length} scheduled overall`}
          icon={AlertTriangle}
          accent={3}
          to="/contacts"
        />
        <StatCard
          label="Data Health"
          value={`${contacts.length ? Math.round(((contacts.length - metrics.missing) / contacts.length) * 100) : 0}%`}
          hint={`${metrics.missing} need attention`}
          icon={CheckCircle2}
          accent={2}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="label-mono">Data health</p>
              <h2 className="mt-1 text-lg font-semibold">Keep the database trustworthy</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fix incomplete records before they become missed opportunities.
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              to="/contacts"
              className="rounded-lg border border-border p-3 transition-colors hover:border-primary"
            >
              <p className="text-2xl font-semibold">{metrics.missing}</p>
              <p className="text-xs text-muted-foreground">Missing phone or email</p>
            </Link>
            <Link
              to="/categories"
              className="rounded-lg border border-border p-3 transition-colors hover:border-primary"
            >
              <p className="text-2xl font-semibold">{metrics.categories.size}</p>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </Link>
            <Link
              to="/data-management"
              className="rounded-lg border border-border p-3 transition-colors hover:border-primary"
            >
              <p className="text-2xl font-semibold">{activities.length}</p>
              <p className="text-xs text-muted-foreground">Tracked activities</p>
            </Link>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-mono">Next actions</p>
              <h2 className="mt-1 text-lg font-semibold">Follow-up queue</h2>
            </div>
            <Link to="/contacts" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {metrics.followUps.slice(0, 4).map((contact) => (
              <Link
                key={contact.id}
                to="/contacts/$id"
                params={{ id: contact.id }}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <ContactAvatar contact={contact} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{contact.fullName}</p>
                  <p className="text-xs text-muted-foreground">{contact.nextFollowUpAt}</p>
                </div>
                <Badge
                  variant={
                    Date.parse(contact.nextFollowUpAt) < Date.now() ? "destructive" : "outline"
                  }
                >
                  {" "}
                  {Date.parse(contact.nextFollowUpAt) < Date.now() ? "Overdue" : "Due"}
                </Badge>
              </Link>
            ))}
            {metrics.followUps.length === 0 ? (
              <p className="py-5 text-sm text-muted-foreground">
                No follow-ups scheduled. Add one from a contact profile.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="label-mono">Workspace activity</p>
          <h2 className="mt-1 text-lg font-semibold">Recently added contacts</h2>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/recent">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      ) : metrics.recent.length === 0 ? (
        <EmptyState
          title="Your contact database is empty."
          description="Add your first contact to get started."
          icon={<UserPlus className="h-6 w-6" />}
          action={
            <Button asChild>
              <Link to="/contacts/add">Add Contact</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.recent.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-mono">Audit trail</p>
            <h2 className="mt-1 text-lg font-semibold">Recent activity</h2>
          </div>
          <Link to="/data-management" className="text-sm text-primary hover:underline">
            Manage data
          </Link>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {activities.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border/70 p-3"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your creates, edits, imports, and archive actions will appear here.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
