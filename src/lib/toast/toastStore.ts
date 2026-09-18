export interface Toast {
  id: number;
  message: string;
}

const DURATION_MS = 3000;

let toasts: Toast[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getToastsSnapshot(): Toast[] {
  return toasts;
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showToast(message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    notify();
  }, DURATION_MS);
}
