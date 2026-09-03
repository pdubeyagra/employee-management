export const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#059669",
  "#d97706",
  "#0891b2",
] as const;

export const generateAvatarClasses = (selector: string): string => {
  return AVATAR_COLORS.map(
    (color, index) => `${selector}.avatar-${index} { background: ${color}; }`,
  ).join("\n");
};

export const getAvatarVariant = (seed: string): number => {
  let hash = 0;

  for (let index = 0; index < seed.length; index++) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
    hash |= 0;
  }

  return Math.abs(hash) % AVATAR_COLORS.length;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase();
};
