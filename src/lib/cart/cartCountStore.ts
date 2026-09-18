type Listener = () => void;

let count: number | null = null;
const listeners = new Set<Listener>();

export function getCartCountSnapshot(fallback: number): number {
  if (count === null) count = fallback;
  return count;
}

export function setCartCount(next: number) {
  count = next;
  listeners.forEach((listener) => listener());
}

export function subscribeCartCount(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
