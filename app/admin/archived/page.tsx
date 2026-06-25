import ArchivedTable from "@/components/admin/ArchivedTable";

export default function AdminArchivedPage() {
  return (
    <section className="min-h-screen bg-[#f7f2e8] px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
              Admin / Archived
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#163126] md:text-5xl">
              Archived Properties
            </h1>
          </div>
        </div>

        <div className="mt-10">
          <ArchivedTable />
        </div>
      </div>
    </section>
  );
}
