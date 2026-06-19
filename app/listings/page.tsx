import { Suspense } from "react";
import ListingsExplorer from "@/components/listings/ListingsExplorer";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--nakma-bg)] px-6 pt-32 lg:px-16">
          <p className="nakma-body text-sm uppercase tracking-[0.28em] text-[var(--nakma-olive)]">
            Loading…
          </p>
        </div>
      }
    >
      <ListingsExplorer />
    </Suspense>
  );
}
