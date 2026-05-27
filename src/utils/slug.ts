export function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function createUniqueSlug(value: string, suffix?: string) {
  const slug = createSlug(value);
  return suffix ? `${slug}-${suffix}` : slug;
}
