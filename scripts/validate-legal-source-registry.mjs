#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "data", "legal-source-registry.json");
const errors = [];
let registry;

try {
  registry = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
  console.error(`REGISTRY_INVALID_JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const allowedAuthorities = new Set([
  "primary",
  "primary_government_portal",
  "primary_institutional",
  "secondary_non_government",
]);
const allowedAutomation = new Set(["manual_review_required", "link_only"]);
const allowedLegalEffects = new Set([
  "publication_evidence",
  "government_reference_copy",
  "published_judicial_material",
  "operational_court_service",
  "legislative_process_evidence",
  "secondary_discovery",
  "institutional_analysis_and_discovery",
]);
const ids = new Set();

if (registry.schemaVersion !== 1) errors.push("schemaVersion must equal 1");
if (!registry.policy?.primaryEvidenceRequiredForLegalStatus) errors.push("primaryEvidenceRequiredForLegalStatus must be true");
if (registry.policy?.neverAutoPublish !== true) errors.push("neverAutoPublish must be true");
if (registry.policy?.neverOverwriteHistoricalVersions !== true) errors.push("neverOverwriteHistoricalVersions must be true");
if (!Array.isArray(registry.sources) || registry.sources.length === 0) errors.push("sources must be a non-empty array");

for (const [index, source] of (registry.sources ?? []).entries()) {
  const label = `sources[${index}]`;
  if (!source.id || typeof source.id !== "string") errors.push(`${label}: missing id`);
  else if (ids.has(source.id)) errors.push(`${label}: duplicate id ${source.id}`);
  else ids.add(source.id);

  if (!source.name || typeof source.name !== "string") errors.push(`${label}: missing name`);
  if (!allowedAuthorities.has(source.authority)) errors.push(`${label}: invalid authority`);
  if (!Array.isArray(source.scope) || source.scope.length === 0) errors.push(`${label}: scope must be non-empty`);
  if (!Array.isArray(source.permittedUse) || source.permittedUse.length === 0) errors.push(`${label}: permittedUse must be non-empty`);
  if (!allowedAutomation.has(source.automation)) errors.push(`${label}: invalid automation policy`);
  if (!allowedLegalEffects.has(source.legalEffect)) errors.push(`${label}: invalid legalEffect`);

  for (const key of ["url", "discoveryUrl"]) {
    if (source[key] === undefined) continue;
    try {
      const parsed = new URL(source[key]);
      if (parsed.protocol !== "https:") errors.push(`${label}: ${key} must use HTTPS`);
    } catch {
      errors.push(`${label}: ${key} is not a valid URL`);
    }
  }

  if (source.authority === "secondary_non_government" && source.legalEffect !== "secondary_discovery") {
    errors.push(`${label}: secondary source cannot be assigned primary legal effect`);
  }
}

if (errors.length) {
  console.error("LEGAL SOURCE REGISTRY CHECK FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`LEGAL SOURCE REGISTRY OK: ${registry.sources.length} sources; schema v${registry.schemaVersion}; no network requests performed.`);
