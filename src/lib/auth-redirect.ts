/** Accept only local destinations; reject auth loops and open redirects. */
export function safeAuthRedirect(value: unknown, fallback = "/home"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//"))
    return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (
      [...decoded].some((char) => char.charCodeAt(0) <= 32 || char === "\\") ||
      decoded.startsWith("//")
    )
      return fallback;
    const url = new URL(value, "https://langlume.invalid");
    if (
      url.origin !== "https://langlume.invalid" ||
      /^\/(login|signup|forgot-password|reset-password)\/?$/i.test(decodeURIComponent(url.pathname))
    )
      return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
