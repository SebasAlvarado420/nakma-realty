"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabaseEnabled } from "@/lib/supabase";
import {
  fetchProperties,
  createProperty,
  updatePropertyApi,
  setArchived,
  deletePropertyApi,
} from "@/lib/properties-api";
import { logActivity } from "@/lib/activity-api";
import type { Property, PropertyLocation, PropertyFeatures } from "@/types/property";

type CreatePropertyInput = {
  code: string;
  title: string;
  slug?: string;
  location: string;
  province: string;
  price: string;
  priceOnRequest?: boolean;
  bedrooms: number;
  bathrooms: number;
  landSize: string;
  constructionSize: string;
  hoa?: string;
  image: string;
  featured: boolean;
  description?: string;
  video?: string;
  listingType?: "sale" | "rent" | "both";
  rentPrice?: string;
  exclusive?: boolean;
  gallery?: string[];
  highlights?: string[];
  features?: PropertyFeatures;
  agentId?: string;
  propertyType?: string;
  geo?: PropertyLocation;
  priceStartingFrom?: boolean;
  status?: "sold" | "rented";
  translations?: Property["translations"];
};

type PropertiesContextType = {
  /** Active (non-archived) listings — what the public site and the main admin
   *  table show. */
  properties: Property[];
  /** Archived listings — shown only in the admin "Archived" section. They keep
   *  their NK code and can be restored at any time. */
  archivedProperties: Property[];
  loading: boolean;
  addProperty: (input: CreatePropertyInput) => Promise<void>;
  updateProperty: (
    id: string,
    patch: Partial<Property>,
    opts?: { silent?: boolean }
  ) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  archiveProperty: (id: string) => Promise<void>;
  restoreProperty: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function PropertiesProvider({ children }: { children: React.ReactNode }) {
  // Single source of truth: Supabase. There is NO demo seed / fallback — an
  // empty database means an empty portfolio. Every listing is added manually
  // through the admin panel.
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabaseEnabled) {
      setProperties([]);
      setLoading(false);
      return;
    }
    try {
      setProperties(await fetchProperties());
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Human-readable label for the activity log (NK code + title). Resolved from
  // current state so delete/archive entries still name the listing.
  const labelOf = useCallback(
    (id: string) => {
      const p = properties.find((x) => x.id === id);
      return p ? `${p.code || "—"} · ${p.title}` : id;
    },
    [properties]
  );

  const addProperty = useCallback(
    async (input: CreatePropertyInput) => {
      const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
      await createProperty({
        code: input.code.trim(),
        slug,
        title: input.title.trim(),
        location: input.location.trim(),
        province: input.province.trim(),
        price: input.price.trim(),
        priceOnRequest: input.priceOnRequest ?? false,
        bedrooms: Number(input.bedrooms) || 0,
        bathrooms: Number(input.bathrooms) || 0,
        landSize: input.landSize.trim(),
        constructionSize: input.constructionSize.trim(),
        hoa: input.hoa?.trim() || undefined,
        image:
          input.image.trim() ||
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
        featured: input.featured,
        description: input.description?.trim() || "",
        video: input.video?.trim() || "",
        listingType: input.listingType ?? "sale",
        rentPrice: input.rentPrice?.trim() || undefined,
        exclusive: input.exclusive ?? false,
        gallery: input.gallery?.filter((g) => g.trim()) ?? [],
        highlights: input.highlights?.filter((h) => h.trim()) ?? [],
        features: input.features,
        agentId: input.agentId || undefined,
        propertyType: input.propertyType || undefined,
        geo: input.geo,
        priceStartingFrom: input.priceStartingFrom ?? false,
        status: input.status,
        translations: input.translations,
      });
      void logActivity({
        action: "created",
        entity: "property",
        entityLabel: `${input.code} · ${input.title}`,
      });
      await refresh();
    },
    [refresh]
  );

  const updateProperty = useCallback(
    async (id: string, patch: Partial<Property>, opts?: { silent?: boolean }) => {
      await updatePropertyApi(id, patch);
      // `silent` is used by bulk operations (e.g. Translate-all) so they can log
      // a single summary entry instead of flooding the history.
      if (!opts?.silent) {
        void logActivity({
          action: "updated",
          entity: "property",
          entityLabel: patch.title
            ? `${patch.code ?? ""} · ${patch.title}`.replace(/^ · /, "")
            : labelOf(id),
        });
      }
      await refresh();
    },
    [refresh, labelOf]
  );

  // The NK code is a unique, permanent identifier for each property: it never
  // gets renumbered. Archiving keeps the code with the listing; a fresh add
  // takes the lowest free NK slot (see PropertyForm).
  const deleteProperty = useCallback(
    async (id: string) => {
      const label = labelOf(id);
      await deletePropertyApi(id);
      void logActivity({ action: "deleted", entity: "property", entityLabel: label });
      await refresh();
    },
    [refresh, labelOf]
  );

  const archiveProperty = useCallback(
    async (id: string) => {
      const label = labelOf(id);
      await setArchived(id, true);
      void logActivity({ action: "archived", entity: "property", entityLabel: label });
      await refresh();
    },
    [refresh, labelOf]
  );

  const restoreProperty = useCallback(
    async (id: string) => {
      const label = labelOf(id);
      await setArchived(id, false);
      void logActivity({ action: "restored", entity: "property", entityLabel: label });
      await refresh();
    },
    [refresh, labelOf]
  );

  const activeProperties = useMemo(
    () => properties.filter((p) => !p.archived),
    [properties]
  );
  const archivedProperties = useMemo(
    () => properties.filter((p) => p.archived),
    [properties]
  );

  const value = useMemo(
    () => ({
      properties: activeProperties,
      archivedProperties,
      loading,
      addProperty,
      updateProperty,
      deleteProperty,
      archiveProperty,
      restoreProperty,
      refresh,
    }),
    [
      activeProperties,
      archivedProperties,
      loading,
      addProperty,
      updateProperty,
      deleteProperty,
      archiveProperty,
      restoreProperty,
      refresh,
    ]
  );

  return (
    <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties must be used inside a PropertiesProvider");
  }
  return context;
}
