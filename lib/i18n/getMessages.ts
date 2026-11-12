import ar from "@/messages/ar.json";


const loaders: Record<string, () => Promise<unknown>> = {
  ar: () => Promise.resolve(ar),
  zgh: () => import("@/messages/zgh.json"),
  fr: () => import("@/messages/fr.json"),
  en: () => import("@/messages/en.json"),
  es: () => import("@/messages/es.json"),
  de: () => import("@/messages/de.json"),
  fa: () => import("@/messages/fa.json"),
  tr: () => import("@/messages/tr.json"),
  nl: () => import("@/messages/nl.json"),
  it: () => import("@/messages/it.json"),
};

type Msg = Record<string, unknown>;

function deepMerge(base: Msg, override: Msg): Msg {
  const out: Msg = { ...base };
  for (const k of Object.keys(override)) {
    const bv = base[k];
    const ov = override[k];
    if (typeof bv === "object" && bv !== null && !Array.isArray(bv) && typeof ov === "object" && ov !== null && !Array.isArray(ov)) {
      out[k] = deepMerge(bv as Msg, ov as Msg);
    } else {
      out[k] = ov;
    }
  }
  return out;
}

export async function getMessages(locale: string): Promise<Msg> {
  const load = loaders[locale] ?? loaders.ar;
  const mod = (await load()) as { default?: Msg } | Msg;
  const data = (mod && typeof mod === "object" && "default" in mod ? (mod as { default?: Msg }).default : mod) as Msg;
  return deepMerge(ar as Msg, data ?? {});
}