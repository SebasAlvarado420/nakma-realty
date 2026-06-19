import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="min-h-screen bg-[#f7f2e8] px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
          Admin Dashboard
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-[#163126] md:text-6xl">
          Nakma Internal Management
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5d7268]">
          Manage listings, create new properties, and keep the Nakma portfolio organized.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/properties"
            className="rounded-[28px] bg-white p-8 shadow-xl transition hover:-translate-y-1"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-[#8b6d3b]">
              Properties
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#163126]">
              View All Properties
            </h2>
            <p className="mt-3 text-[#5d7268]">
              Review current listings in the portfolio.
            </p>
          </Link>

          <Link
            href="/admin/properties/new"
            className="rounded-[28px] bg-[#163126] p-8 text-white shadow-xl transition hover:-translate-y-1"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-[#d7b56d]">
              New Listing
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Add New Property
            </h2>
            <p className="mt-3 text-white/80">
              Use the Nakma property template to upload a new home.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}