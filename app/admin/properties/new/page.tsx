import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <section className="min-h-screen bg-[#f7f2e8] px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
          Admin / New Property
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-[#163126] md:text-5xl">
          Create a New Listing
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5d7268]">
          Use this template to keep every Nakma property standardized and easy to manage.
        </p>

        <div className="mt-10">
          <PropertyForm />
        </div>
      </div>
    </section>
  );
}