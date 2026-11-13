/** Verified gov-service directory (code source of truth; DB seed mirrors this). */
export interface GovService {
  id: string;
  name: string;
  url: string;
  category: "civil_status" | "justice";
  provider: string;
  verified: boolean;
  lastVerified: string;
}

export const GOV_SERVICES: GovService[] = [
  {
    id: "birth-certificate",
    name: "رسم ولادة",
    url: "https://www.watiqa.ma",
    category: "civil_status",
    provider: "منصة وثيقة (الحالة المدنية)",
    verified: true,
    lastVerified: "2026-11-09",
  },
  {
    id: "criminal-record",
    name: "بطاقة السجل العدلي",
    url: "https://casierjudiciaire.justice.gov.ma",
    category: "justice",
    provider: "وزارة العدل",
    verified: true,
    lastVerified: "2026-11-09",
  },
];

/** Official entry point for a service, or null (never a guessed URL). */
export function getServiceUrl(serviceId: string): string | null {
  return GOV_SERVICES.find((s) => s.id === serviceId)?.url ?? null;
}
