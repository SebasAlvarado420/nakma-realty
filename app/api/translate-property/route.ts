import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Translate a property's free-text fields into EN + ES via DeepL, preserving the
// admin's original wording in whichever language they wrote it in.
// Costa Rican Spanish: English→Spanish goes through a DeepL glossary that maps
// Euro-Spanish terms to tico ones (lot→lote, parking→parqueo, …) and uses the
// formal "usted" register. Translated TITLES are Title-Cased so they don't come
// back all-lowercase. The DeepL key lives only in the server env — never in the
// browser. Fails gracefully: any error returns {} and the property still saves
// (original text shows everywhere).

type Body = {
  title?: string;
  description?: string;
  location?: string;
  highlights?: string[];
  features?: { internal?: string[]; external?: string[]; community?: string[] };
  communityName?: string;
  communityDescription?: string;
};

const DEEPL_URL = "https://api-free.deepl.com/v2/translate";
// Account-scoped glossary id (not a secret; useless without the API key).
const CR_GLOSSARY_ID = "25169448-51f1-4ca2-8368-0ff71d20d5e2";

// Spanish/English title-casing — capitalise significant words, keep the small
// connectors lowercase, and leave the rest of each word untouched (preserves
// "m²", "180°", mixed case, etc.).
const SMALL_WORDS = new Set([
  "de", "del", "la", "las", "el", "los", "y", "o", "u", "a", "en", "con",
  "por", "para", "un", "una", "unos", "unas", "al", "e",
  "the", "of", "in", "on", "and", "or", "an", "to", "with", "for", "at", "by",
]);
function titleCase(s: string): string {
  let first = true;
  return s
    .split(/(\s+)/)
    .map((tok) => {
      if (!tok || /^\s+$/.test(tok)) return tok;
      const core = tok.toLowerCase().replace(/[^a-záéíóúñü]/g, "");
      const isSmall = SMALL_WORDS.has(core);
      const out = isSmall && !first ? tok.toLowerCase() : tok.charAt(0).toUpperCase() + tok.slice(1);
      first = false;
      return out;
    })
    .join("");
}

function setPath(obj: any, path: string, val: string) {
  const parts = path.split(".");
  if (parts.length === 1) {
    obj[parts[0]] = val;
  } else if (parts[0] === "highlights") {
    (obj.highlights ??= [])[Number(parts[1])] = val;
  } else if (parts[0] === "features") {
    obj.features ??= { internal: [], external: [], community: [] };
    (obj.features[parts[1]] ??= [])[Number(parts[2])] = val;
  }
}

type Trans = { detected_source_language: string; text: string };

export async function POST(req: Request) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return NextResponse.json({});

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({});
  }

  // Flatten every non-empty field into an ordered list of strings.
  const order: string[] = [];
  const texts: string[] = [];
  const add = (path: string, v?: string) => {
    if (v && v.trim()) {
      order.push(path);
      texts.push(v);
    }
  };
  add("title", body.title);
  add("description", body.description);
  add("location", body.location);
  add("communityName", body.communityName);
  add("communityDescription", body.communityDescription);
  (body.highlights ?? []).forEach((h, i) => add(`highlights.${i}`, h));
  (["internal", "external", "community"] as const).forEach((cat) =>
    (body.features?.[cat] ?? []).forEach((f, i) => add(`features.${cat}.${i}`, f))
  );

  if (texts.length === 0) return NextResponse.json({ en: {}, es: {} });

  async function deepl(
    textList: string[],
    target: "EN" | "ES",
    opts: { sourceLang?: string; glossaryId?: string; formality?: string } = {}
  ): Promise<Trans[]> {
    const payload: any = { text: textList, target_lang: target };
    if (opts.sourceLang) payload.source_lang = opts.sourceLang;
    if (opts.glossaryId) payload.glossary_id = opts.glossaryId;
    if (opts.formality) payload.formality = opts.formality;
    const res = await fetch(DEEPL_URL, {
      method: "POST",
      headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}`);
    const json = (await res.json()) as { translations: Trans[] };
    return json.translations;
  }

  try {
    // 1) Everything → EN (auto-detect source). Gives us per-field language + EN.
    const en = await deepl(texts, "EN");
    const detected = order.map((_, i) => (en[i]?.detected_source_language || "").toUpperCase());

    // 2) The fields that still need Spanish (anything not already ES) → ES,
    //    through the Costa Rican glossary with the formal "usted" register.
    const esIdx: number[] = [];
    order.forEach((_, i) => {
      if (detected[i] !== "ES") esIdx.push(i);
    });
    let esSub: Trans[] = [];
    if (esIdx.length) {
      const subTexts = esIdx.map((i) => texts[i]);
      try {
        esSub = await deepl(subTexts, "ES", {
          sourceLang: "EN",
          glossaryId: CR_GLOSSARY_ID,
          formality: "prefer_more",
        });
      } catch {
        // Glossary missing/invalid → retry without it so we still translate.
        esSub = await deepl(subTexts, "ES", { sourceLang: "EN", formality: "prefer_more" });
      }
    }
    const esByIdx = new Map<number, string>();
    esIdx.forEach((globalI, k) => esByIdx.set(globalI, esSub[k]?.text ?? texts[globalI]));

    const buildEn = () => {
      const obj: any = {};
      order.forEach((path, i) => {
        const translated = detected[i] !== "EN";
        let val = translated ? en[i]?.text ?? texts[i] : texts[i];
        if (path === "title" && translated) val = titleCase(val);
        setPath(obj, path, val);
      });
      return obj;
    };
    const buildEs = () => {
      const obj: any = {};
      order.forEach((path, i) => {
        const translated = detected[i] !== "ES";
        let val = translated ? esByIdx.get(i) ?? texts[i] : texts[i];
        if (path === "title" && translated) val = titleCase(val);
        setPath(obj, path, val);
      });
      return obj;
    };

    return NextResponse.json({ en: buildEn(), es: buildEs() });
  } catch (err) {
    console.error("translate-property:", err instanceof Error ? err.message : err);
    return NextResponse.json({});
  }
}
