import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import type { ActivityItem, Contact, ContactFilters, SavedView } from "@/lib/types";
import * as service from "@/services/contactService";

const ACTIVITY_KEY = "contact-manager.activities.v1";
const VIEWS_KEY = "contact-manager.saved-views.v1";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage errors are handled by the visible local-only status in Settings.
  }
}

interface ContactContextValue {
  contacts: Contact[];
  loading: boolean;
  activities: ActivityItem[];
  savedViews: SavedView[];
  getById: (id: string) => Contact | undefined;
  addContact: (data: Partial<Contact>) => Promise<Contact>;
  importContacts: (records: Array<Partial<Contact>>, replace?: boolean) => Promise<number>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<Contact | undefined>;
  deleteContact: (id: string) => Promise<void>;
  bulkUpdate: (ids: string[], data: Partial<Contact>) => Promise<void>;
  archiveContacts: (ids: string[]) => Promise<void>;
  addSavedView: (name: string, filters: ContactFilters) => void;
  deleteSavedView: (id: string) => void;
  logActivity: (type: ActivityItem["type"], message: string, contactId?: string) => void;
  resetDatabase: () => Promise<void>;
  clearDatabase: () => Promise<void>;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>(() => readStored(ACTIVITY_KEY, []));
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => readStored(VIEWS_KEY, []));

  useEffect(() => {
    let active = true;
    service.getContacts().then((list) => {
      if (!active) return;
      setContacts(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const logActivity = useCallback(
    (type: ActivityItem["type"], message: string, contactId?: string) => {
      setActivities((current) => {
        const next: ActivityItem[] = [
          {
            id: crypto.randomUUID(),
            type,
            message,
            ...(contactId ? { contactId } : {}),
            createdAt: new Date().toISOString(),
          },
          ...current,
        ].slice(0, 50);
        writeStored(ACTIVITY_KEY, next);
        return next;
      });
    },
    [],
  );

  const getById = useCallback((id: string) => contacts.find((c) => c.id === id), [contacts]);

  const addContact = useCallback(
    async (data: Partial<Contact>) => {
      const created = await service.addContact({ ...data, source: data.source ?? "Manual" });
      setContacts(await service.getContacts());
      logActivity("created", `${created.fullName} was added`, created.id);
      return created;
    },
    [logActivity],
  );

  const importContacts = useCallback(
    async (records: Array<Partial<Contact>>, replace = false) => {
      const added = await service.addManyContacts(records, { replace });
      setContacts(await service.getContacts());
      logActivity("imported", `${added.length} contact${added.length === 1 ? "" : "s"} imported`);
      return added.length;
    },
    [logActivity],
  );

  const updateContact = useCallback(
    async (id: string, data: Partial<Contact>) => {
      const updated = await service.updateContact(id, data);
      setContacts(await service.getContacts());
      if (updated) logActivity("updated", `${updated.fullName} was updated`, updated.id);
      return updated;
    },
    [logActivity],
  );

  const deleteContact = useCallback(
    async (id: string) => {
      const contact = contacts.find((item) => item.id === id);
      await service.deleteContact(id);
      setContacts(await service.getContacts());
      if (contact) logActivity("archived", `${contact.fullName} was removed`, contact.id);
    },
    [contacts, logActivity],
  );

  const bulkUpdate = useCallback(
    async (ids: string[], data: Partial<Contact>) => {
      await Promise.all(ids.map((id) => service.updateContact(id, data)));
      setContacts(await service.getContacts());
      logActivity("updated", `${ids.length} contact${ids.length === 1 ? "" : "s"} updated in bulk`);
      toast.success(`${ids.length} contact${ids.length === 1 ? "" : "s"} updated`);
    },
    [logActivity],
  );

  const archiveContacts = useCallback(
    async (ids: string[]) => {
      await Promise.all(
        ids.map((id) =>
          service.updateContact(id, { status: "Archived", archivedAt: new Date().toISOString() }),
        ),
      );
      setContacts(await service.getContacts());
      logActivity("archived", `${ids.length} contact${ids.length === 1 ? "" : "s"} archived`);
      toast.success(`${ids.length} contact${ids.length === 1 ? "" : "s"} archived`);
    },
    [logActivity],
  );

  const addSavedView = useCallback((name: string, filters: ContactFilters) => {
    setSavedViews((current) => {
      const next = [
        { id: crypto.randomUUID(), name, filters, createdAt: new Date().toISOString() },
        ...current,
      ].slice(0, 12);
      writeStored(VIEWS_KEY, next);
      return next;
    });
    toast.success("Saved view created");
  }, []);

  const deleteSavedView = useCallback((id: string) => {
    setSavedViews((current) => {
      const next = current.filter((view) => view.id !== id);
      writeStored(VIEWS_KEY, next);
      return next;
    });
  }, []);

  const resetDatabase = useCallback(async () => {
    const list = await service.resetContacts();
    setContacts(list);
    toast.success("Built-in database restored");
    logActivity("imported", "Built-in dataset restored");
  }, [logActivity]);

  const clearDatabase = useCallback(async () => {
    await service.clearContacts();
    setContacts([]);
    toast.success("All contacts removed");
    logActivity("archived", "All contacts removed");
  }, [logActivity]);

  const value = useMemo(
    () => ({
      contacts,
      loading,
      activities,
      savedViews,
      getById,
      addContact,
      importContacts,
      updateContact,
      deleteContact,
      bulkUpdate,
      archiveContacts,
      addSavedView,
      deleteSavedView,
      logActivity,
      resetDatabase,
      clearDatabase,
    }),
    [
      contacts,
      loading,
      activities,
      savedViews,
      getById,
      addContact,
      importContacts,
      updateContact,
      deleteContact,
      bulkUpdate,
      archiveContacts,
      addSavedView,
      deleteSavedView,
      logActivity,
      resetDatabase,
      clearDatabase,
    ],
  );

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContacts() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContacts must be used inside <ContactProvider>");
  return ctx;
}
