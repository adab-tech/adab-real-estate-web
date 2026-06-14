export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const USERNAME_COOLDOWN_DAYS = 30;

const USERNAME_PATTERN = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/;

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);
  if (normalized.length < USERNAME_MIN || normalized.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(normalized)) {
    return "Use lowercase letters, numbers, and hyphens only (no leading or trailing hyphen).";
  }
  return null;
}

export function listerProfilePath(username: string): string {
  return `/l/${username}`;
}

export function listerProfileUrl(username: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${listerProfilePath(username)}`;
}

export function canChangeUsername(changedAt: string | null): boolean {
  if (!changedAt) return true;
  const last = new Date(changedAt).getTime();
  const cooldownMs = USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - last >= cooldownMs;
}

export function usernameCooldownEnds(changedAt: string | null): Date | null {
  if (!changedAt) return null;
  const last = new Date(changedAt);
  const ends = new Date(
    last.getTime() + USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
  );
  return ends.getTime() > Date.now() ? ends : null;
}
