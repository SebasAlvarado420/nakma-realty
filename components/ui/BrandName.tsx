// The official NAKMA wordmark. The "N" carries a special diacritic (as used in
// the Canva "Tan Mon Cheri" logo). Swap BRAND_MARK to change it everywhere:
//   "˘" breve · "¨" diaeresis · "ˇ" caron · "˜" tilde
export const BRAND_MARK = "˘";

export default function BrandName({ className = "" }: { className?: string }) {
  return (
    <span className={className} aria-label="Ñakma">
      <span className="relative inline-block" aria-hidden="true">
        N
        <span
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none"
          style={{ top: "-0.40em", fontSize: "0.58em", lineHeight: 1 }}
        >
          {BRAND_MARK}
        </span>
      </span>
      <span aria-hidden="true">AKMA</span>
    </span>
  );
}
