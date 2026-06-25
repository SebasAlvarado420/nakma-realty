"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { initialProperties } from "@/data/properties";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import {
  fetchProperties,
  createProperty,
  updatePropertyApi,
  setArchived,
  deletePropertyApi,
  seedProperties,
} from "@/lib/properties-api";
import type { Property, PropertyLocation, PropertyFeatures } from "@/types/property";

type CreatePropertyInput = {
  code: string;
  title: string;
  slug?: string;
  location: string;
  province: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  landSize: string;
  constructionSize: string;
  yearBuilt?: string;
  hoa?: string;
  image: string;
  featured: boolean;
  description?: string;
  video?: string;
  listingType?: "sale" | "rent";
  rentPrice?: string;
  exclusive?: boolean;
  gallery?: string[];
  highlights?: string[];
  features?: PropertyFeatures;
  agentId?: string;
  geo?: PropertyLocation;
};

type PropertiesContextType = {
  /** Active (non-archived) listings — what the public site and the main admin
   *  table show. */
  properties: Property[];
  /** Archived listings — shown only in the admin "Archived" section. They keep
   *  their NK code and can be restored at any time. */
  archivedProperties: Property[];
  loading: boolean;
  usingFallback: boolean;
  addProperty: (input: CreatePropertyInput) => Promise<void>;
  updateProperty: (id: string, patch: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  archiveProperty: (id: string) => Promise<void>;
  restoreProperty: (id: string) => Promise<void>;
  importDemoListings: () => Promise<void>;
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
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(!supabaseEnabled);

  const refresh = useCallback(async () => {
    if (!supabaseEnabled) {
      setProperties(initialProperties);
      setUsingFallback(true);
      setLoading(false);
      return;
    }
    try {
      const data = await fetchProperties();
      if (data.length > 0) {
        setProperties(data);
        setUsingFallback(false);
      } else {
        // DB is empty — show the demo seed so the site is never blank.
        setProperties(initialProperties);
        setUsingFallback(true);
      }
    } catch {
      setProperties(initialProperties);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
        bedrooms: Number(input.bedrooms) || 0,
        bathrooms: Number(input.bathrooms) || 0,
        landSize: input.landSize.trim(),
        constructionSize: input.constructionSize.trim(),
        yearBuilt: input.yearBuilt?.trim() || undefined,
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
        geo: input.geo,
      });
      await refresh();
    },
    [refresh]
  );

  const updateProperty = useCallback(
    async (id: string, patch: Partial<Property>) => {
      await updatePropertyApi(id, patch);
      await refresh();
    },
    [refresh]
  );

  // The NK code is a unique, permanent identifier for each property: it never
  // gets renumbered. Archiving keeps the code with the listing; a fresh add
  // takes the lowest free NK slot (see PropertyForm).
  const deleteProperty = useCallback(
    async (id: string) => {
      await deletePropertyApi(id);
      await refresh();
    },
    [refresh]
  );

  const archiveProperty = useCallback(
    async (id: string) => {
      await setArchived(id, true);
      await refresh();
    },
    [refresh]
  );

  const restoreProperty = useCallback(
    async (id: string) => {
      await setArchived(id, false);
      await refresh();
    },
    [refresh]
  );

  const importDemoListings = useCallback(async () => {
    // propertyToRow ignores `id`, so Supabase generates fresh uuids.
    await seedProperties(initialProperties);
    await refresh();
  }, [refresh]);

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
      usingFallback,
      addProperty,
      updateProperty,
      deleteProperty,
      archiveProperty,
      restoreProperty,
      importDemoListings,
      refresh,
    }),
    [
      activeProperties,
      archivedProperties,
      loading,
      usingFallback,
      addProperty,
      updateProperty,
      deleteProperty,
      archiveProperty,
      restoreProperty,
      importDemoListings,
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
