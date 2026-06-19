"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const provinces = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function PropertySearch() {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredProvinces = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) return provinces;

    return provinces.filter((province) =>
      normalize(province).includes(normalizedQuery)
    );
  }, [query]);

  const exactProvinceMatch = useMemo(() => {
    const normalizedQuery = normalize(query);
    return provinces.find(
      (province) => normalize(province) === normalizedQuery
    );
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch() {
    const provinceToUse =
      exactProvinceMatch || (filteredProvinces.length === 1 ? filteredProvinces[0] : "");

    if (provinceToUse) {
      router.push(`/listings?province=${encodeURIComponent(provinceToUse)}`);
      return;
    }

    router.push("/listings");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSearch();
  }

  function handleSelectProvince(province: string) {
    setQuery(province);
    setOpen(false);
    router.push(`/listings?province=${encodeURIComponent(province)}`);
  }

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] bg-[var(--nakma-bg)]/96 p-3 shadow-[0_18px_50px_rgba(22,17,13,0.08)] backdrop-blur-sm"
        >
          <div
            ref={wrapperRef}
            className="relative flex flex-col gap-3 md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <label
                htmlFor="province-search"
                className="mb-2 block px-3 text-[11px] uppercase tracking-[0.32em] text-[var(--nakma-olive)] nakma-body"
              >
                Search by province
              </label>

              <div className="flex h-[62px] items-center rounded-[20px] border border-black/8 bg-white px-4">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mr-3 h-5 w-5 shrink-0 text-[var(--nakma-dark)]/55"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>

                <input
                  id="province-search"
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  placeholder="Type a province in Costa Rica"
                  autoComplete="off"
                  className="h-full w-full border-0 bg-transparent text-[16px] text-[var(--nakma-dark)] outline-none placeholder:text-[var(--nakma-dark)]/38 nakma-body"
                />
              </div>

              {open && filteredProvinces.length > 0 && (
                <div className="absolute left-0 right-0 top-[92px] z-30 overflow-hidden rounded-[20px] border border-black/8 bg-white shadow-[0_18px_40px_rgba(22,17,13,0.10)]">
                  {filteredProvinces.map((province) => (
                    <button
                      key={province}
                      type="button"
                      onClick={() => handleSelectProvince(province)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-[15px] text-[var(--nakma-dark)] transition-colors hover:bg-[var(--nakma-bg)] nakma-body"
                    >
                      <span>{province}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="h-[62px] rounded-[20px] bg-[var(--nakma-dark)] px-8 text-[12px] uppercase tracking-[0.28em] text-white transition-transform duration-200 hover:scale-[1.01] nakma-body md:min-w-[190px]"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}