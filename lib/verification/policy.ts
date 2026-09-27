import { createHash } from "crypto";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk",
  "outlook.com", "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com",
  "proton.me", "protonmail.com", "mail.com", "aol.com", "gmx.com", "zoho.com",
]);

const EDUCATION_ROLE_PATTERNS = [
  /^professor(?:\s+emeritus)?(?:\s+of\s+.+)?$/,
  /^distinguished professor(?:\s+of\s+.+)?$/,
  /^dean(?:\s+of\s+.+)?$/,
  /^principal$/, /^registrar$/, /^vice[-\s]?chancellor$/, /^chancellor$/,
  /^provost$/, /^director(?:\s+of\s+.+)?$/, /^president(?:\s+of\s+.+)?$/,
];

const WORK_ROLE_PATTERNS = [
  /^(?:senior\s+)?manager$/, /^general manager$/, /^(?:deputy|assistant) general manager$/,
  /^director(?:\s+of\s+.+)?$/, /^senior director(?:\s+of\s+.+)?$/,
  /^head(?:\s+of\s+.+)?$/, /^(?:vice\s+president|vp)(?:\s+of\s+.+)?$/,
  /^senior vice president(?:\s+of\s+.+)?$/, /^executive vice president(?:\s+of\s+.+)?$/,
  /^(?:chief executive officer|ceo)$/, /^(?:chief operating officer|coo)$/,
  /^(?:chief financial officer|cfo)$/, /^(?:chief technology officer|cto)$/,
  /^(?:chief human resources officer|chro)$/, /^(?:chief people officer)$/,
  /^(?:owner|founder|co-founder|partner)$/,
];

export function normalizeVerifierRole(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isAllowedVerifierRole(type: string, role: string) {
  const normalized = normalizeVerifierRole(role);
  if (type === "EDUCATION") {
    if (/^(assistant|associate) professor(?:\s+of\s+.+)?$/.test(normalized)) return false;
    return EDUCATION_ROLE_PATTERNS.some((pattern) => pattern.test(normalized));
  }
  if (type === "EXPERIENCE") {
    if (/^(assistant|deputy) manager$/.test(normalized)) return false;
    if (/^(assistant|deputy)\s+.+\s+manager$/.test(normalized)) return false;
    if (/^team lead$|^lead$|^supervisor$/.test(normalized)) return false;
    return WORK_ROLE_PATTERNS.some((pattern) => pattern.test(normalized));
  }
  return false;
}

export function isOfficialVerifierEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const match = normalized.match(/^[^\s@]+@([^\s@]+)$/);
  if (!match) return false;
  const domain = match[1];
  if (!domain.includes(".") || PERSONAL_EMAIL_DOMAINS.has(domain)) return false;
  return true;
}

export function hashVerifierId(idType: string, idNumber: string) {
  const normalized = `${idType.trim().toLowerCase()}|${idNumber.trim().replace(/\s+/g, "").toUpperCase()}`;
  return createHash("sha256").update(normalized).digest("hex");
}

export function maskVerifierId(idNumber: string) {
  const compact = idNumber.trim().replace(/\s+/g, "");
  return compact.length <= 4 ? "****" : "••••" + compact.slice(-4);
}
