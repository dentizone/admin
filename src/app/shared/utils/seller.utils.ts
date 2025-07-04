export function getSellerInitials(sellerName: string): string {
  if (!sellerName) return '?';
  return sellerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
