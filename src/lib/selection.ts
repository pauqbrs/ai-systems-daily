/**
 * Cesta de selección: los pills que has marcado para pedir una guía combinada.
 *
 * Vive solo en el navegador (localStorage). No viaja a ningún servidor: cuando
 * pides la guía, se abre un issue de GitHub prellenado y es ahí donde la
 * sesión diaria la recoge.
 */

export const SELECTION_KEY = 'asd:selection:v1';
export const SELECTION_EVENT = 'asd:selection-changed';

export type SelectedPill = {
  id: string;
  title: string;
  section: string;
  sourceUrl: string;
  addedAt: string;
};

const canStore = () => typeof window !== 'undefined';

export function readSelection(): SelectedPill[] {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is SelectedPill => !!p && typeof p.id === 'string' && typeof p.title === 'string',
    );
  } catch {
    // Ventana privada, almacenamiento bloqueado o JSON corrupto: cesta vacía.
    return [];
  }
}

function writeSelection(next: SelectedPill[]) {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(SELECTION_KEY, JSON.stringify(next));
  } catch {
    // Si no se puede persistir, al menos la UI de esta pestaña se entera.
  }
  window.dispatchEvent(new CustomEvent(SELECTION_EVENT, { detail: next }));
}

export function togglePill(pill: Omit<SelectedPill, 'addedAt'>): SelectedPill[] {
  const current = readSelection();
  const exists = current.some((p) => p.id === pill.id);
  const next = exists
    ? current.filter((p) => p.id !== pill.id)
    : [...current, { ...pill, addedAt: new Date().toISOString() }];
  writeSelection(next);
  return next;
}

export function removePill(id: string): SelectedPill[] {
  const next = readSelection().filter((p) => p.id !== id);
  writeSelection(next);
  return next;
}

export function clearSelection(): SelectedPill[] {
  writeSelection([]);
  return [];
}

/** Suscribe a cambios de la cesta, incluidos los de otras pestañas. */
export function onSelectionChange(cb: (next: SelectedPill[]) => void): () => void {
  if (!canStore()) return () => {};
  const local = () => cb(readSelection());
  const cross = (e: StorageEvent) => {
    if (e.key === SELECTION_KEY) cb(readSelection());
  };
  window.addEventListener(SELECTION_EVENT, local);
  window.addEventListener('storage', cross);
  return () => {
    window.removeEventListener(SELECTION_EVENT, local);
    window.removeEventListener('storage', cross);
  };
}
