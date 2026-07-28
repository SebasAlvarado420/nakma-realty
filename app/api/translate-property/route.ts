import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Translate a property's free-text fields into EN + ES via DeepL, preserving
// the admin's original wording in whichever language they wrote it in.
// The DeepL key lives only in the server env (DEEPL_API_KEY) — never shipped
// to the browser. Fails gracefully: if anything goes wrong we return {} and the
// property saves without translations (original text still shows everywhere).

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

  async function translate(target: "EN" | "ES") {
    const res = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: texts, target_lang: target }),
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}`);
    const json = (await res.json()) as {
      translations: { detected_source_language: string; text: string }[];
    };
    return json.translations;
  }

  try {
    const [en, es] = await Promise.all([translate("EN"), translate("ES")]);
    const source = (en[0]?.detected_source_language || "").toUpperCase();

    const build = (target: "EN" | "ES", results: { text: string }[]) => {
      const useOriginal = source === target;
      const obj: any = {};
      order.forEach((path, i) => {
        setPath(obj, path, useOriginal ? texts[i] : results[i]?.text ?? texts[i]);
      });
      return obj;
    };

    return NextResponse.json({ en: build("EN", en), es: build("ES", es) });
  } catch (err) {
    console.error("translate-property:", err instanceof Error ? err.message : err);
    return NextResponse.json({});
  }
}
