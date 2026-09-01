import { useEffect, useState } from 'react';
import { onSelectionChange, readSelection, type SelectedPill } from '../lib/selection';

export default function SelectionTray({ basePath = '/' }: { basePath?: string }) {
  const [items, setItems] = useState<SelectedPill[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(readSelection());
    setMounted(true);
    return onSelectionChange(setItems);
  }, []);

  if (!mounted || items.length === 0) return null;

  const href = `${basePath.replace(/\/$/, '')}/seleccion`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none px-4 pb-4">
      <div className="mx-auto max-w-md pointer-events-auto">
        <a
          href={href}
          className="flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg transition-transform hover:-translate-y-0.5"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text)',
          }}
        >
          <span
            className="grid place-items-center w-7 h-7 rounded-lg text-[13px] font-semibold shrink-0"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {items.length}
          </span>
          <span className="text-[13.5px] leading-tight flex-1 min-w-0">
            <strong className="font-semibold">
              {items.length === 1 ? '1 pieza seleccionada' : `${items.length} piezas seleccionadas`}
            </strong>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Pedir guía de aplicación →</span>
          </span>
        </a>
      </div>
    </div>
  );
}
