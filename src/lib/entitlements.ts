export function hasPremiumEntitlement(
  profile: { plan?: string | null; premium_until?: string | null } | null | undefined,
  now = Date.now(),
) {
  if (profile?.plan !== "premium") return false;
  if (profile.premium_until === null || profile.premium_until === undefined) return true;
  const expires = Date.parse(profile.premium_until);
  return Number.isFinite(expires) && expires > now;
}
