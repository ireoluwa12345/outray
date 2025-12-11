export function generateId(prefix: string = ""): string {
  const random = Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${random}` : random;
}

export function extractSubdomain(
  host: string,
  baseDomain: string,
): string | null {
  if (!host) return null;

  const cleanHost = host.split(":")[0].replace(/\.$/, "").toLowerCase();
  const base = baseDomain.toLowerCase();

  if (cleanHost === base) return null;
  if (!cleanHost.endsWith(`.${base}`)) return null;

  const sub = cleanHost.slice(0, cleanHost.length - base.length - 1);
  return sub || null;
}
