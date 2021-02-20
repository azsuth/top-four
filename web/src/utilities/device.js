export function isPhone() {
  if (typeof window === 'undefined') return false;

  return window.matchMedia
    ? window.matchMedia('(max-width: 767px)').matches
    : false;
}

export function isTablet() {
  if (typeof window === 'undefined') return false;

  return window.matchMedia
    ? window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches
    : false;
}

export function isDesktop() {
  if (typeof window === 'undefined') return false;

  return window.matchMedia
    ? window.matchMedia('(min-width: 1024px)').matches
    : false;
}
