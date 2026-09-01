import { useEffect, useState } from 'react';
import { onSelectionChange, readSelection, togglePill } from '../lib/selection';

type Props = {
  id: string;
  title: string;
  section: string;
  sourceUrl: string;
  /** 'icon' para las tarjetas del listado, 'full' para la página del artículo. */
  variant?: 'icon' | 'full';
};

export default function SelectToggle({ id, title, section, sourceUrl, variant = 'icon' }: Props) {
  const [selected, setSelected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = (items: { id: string }[]) => setSelected(items.some((p) => p.id === id));
    sync(readSelection());
    setMounted(true);
    return onSelectionChange(sync);
  }, [id]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePill({ id, title, section, sourceUrl });
  };

  const label = selected ? 'Quitar de la selección' : 'Guardar para la guía';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={label}
        title={label}
        className="shrink-0 w-8 h-8 grid place-items-center rounded-lg transition-colors"
        style={{
          border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
          background: selected ? 'var(--accent-soft)' : 'transparent',
          color: selected ? 'var(--accent)' : 'var(--text-faint)',
          opacity: mounted ? 1 : 0.4,
        }}
      >
        <Bookmark filled={selected} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors"
      style={{
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-strong)'}`,
        background: selected ? 'var(--accent-soft)' : 'transparent',
        color: selected ? 'var(--accent)' : 'var(--text)',
      }}
    >
      <Bookmark filled={selected} />
      {selected ? 'En tu selección' : 'Guardar para la guía'}
    </button>
  );
}

function Bookmark({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
