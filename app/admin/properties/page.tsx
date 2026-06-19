import Link from "next/link";
import PropertiesTable from "@/components/admin/PropertiesTable";

export default function AdminPropertiesPage() {
  return (
    <section className="min-h-screen bg-[#f7f2e8] px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
              Admin / Properties
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-[#163126] md:text-5xl">
              Property Portfolio
            </h1>
          </div>

          <Link
            href="/admin/properties/new"
            className="rounded-2xl bg-[#163126] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
          >
            Add New Property
          </Link>
        </div>

        <div className="mt-10">
          <PropertiesTable />
        </div>
      </div>
    </section>
  );
}