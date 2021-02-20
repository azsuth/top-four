export function isPhone() {
  return window && window.matchMedia
    ? window.matchMedia('(max-width: 767px)').matches
    : false;
}

export function isTablet() {
  return window && window.matchMedia
    ? window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches
    : false;
}

export function isDesktop() {
  return window && window.matchMedia
    ? window.matchMedia('(min-width: 1024px)').matches
    : null;
}
