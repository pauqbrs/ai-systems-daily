import { useEffect, useState } from 'react';
import {
  clearSelection,
  onSelectionChange,
  readSelection,
  removePill,
  type SelectedPill,
} from '../lib/selection';

type Project = { id: string; name: string; blurb: string };

export default function SelectionBuilder({
  repo,
  projects,
  basePath = '/',
}: {
  repo: string;
  projects: Project[];
  basePath?: string;
}) {
  const [items, setItems] = useState<SelectedPill[]>([]);
  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState(projects[0]?.id ?? '');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setItems(readSelection());
    setMounted(true);
    return onSelectionChange(setItems);
  }, []);

  const base = basePath.replace(/\/$/, '');
  const chosen = projects.find((p) => p.id === project);

  const body = [
    `## Piezas seleccionadas`,
    '',
    ...items.map(
      (p, i) => `${i + 1}. **${p.title}** — \`${p.id}\`\n   - Fuente original: ${p.sourceUrl}`,
    ),
    '',
    `## Proyecto destino`,
    '',
    `\`${project}\`${chosen ? ` — ${chosen.name}` : ''}`,
    '',
    `## Contexto adicional`,
    '',
    note.trim() || '_(ninguno)_',
    '',
    '---',
    '',
    'Generado desde el blog. La siguiente sesión diaria recogerá este issue,',
    'escribirá la guía combinada en `src/content/guides/` y cerrará el issue',
    'con el enlace a la guía publicada.',
  ].join('\n');

  const title =
    items.length === 1
      ? `Guía: ${items[0].title}`
      : `Guía combinada (${items.length} piezas) → ${chosen?.name ?? project}`;

  const issueUrl =
    `https://github.com/${repo}/issues/new` +
    `?labels=${encodeURIComponent('guia-solicitada')}` +
    `&title=${encodeURIComponent(title)}` +
    `&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`# ${title}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted) {
    return <p className="muted text-[14.5px]">Cargando tu selección…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center surface">
        <p className="text-[15px] font-medium mb-2">Tu selección está vacía</p>
        <p className="muted text-[14px] max-w-prose mx-auto mb-5">
          Marca con el icono de marcador las piezas que quieras convertir en una guía de aplicación.
          Cuando tengas dos o tres, vuelve aquí y pide la guía combinada.
        </p>
        <a
          href={`${base}/`}
          className="inline-block rounded-lg px-4 py-2 text-[13.5px] font-medium"
          style={{ background: 'var(--accent)', color: 'var(--bg-raised)' }}
        >
          Ir a la última edición
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-[13px] uppercase tracking-wide faint mb-3">
          {items.length} {items.length === 1 ? 'pieza' : 'piezas'}
        </h2>
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex items-start gap-3 rounded-lg px-4 py-3 surface"
            >
              <div className="flex-1 min-w-0">
                <a
                  href={`${base}/pill/${p.id}`}
                  className="text-[14.5px] font-medium leading-snug hover:underline"
                >
                  {p.title}
                </a>
                <p className="faint text-[12.5px] mt-0.5 truncate">{p.sourceUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => removePill(p.id)}
                aria-label={`Quitar ${p.title}`}
                className="shrink-0 w-7 h-7 grid place-items-center rounded-md faint hover:bg-[var(--bg-sunken)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => clearSelection()}
          className="mt-3 text-[13px] faint hover:underline"
        >
          Vaciar selección
        </button>
      </section>

      <section>
        <h2 className="text-[13px] uppercase tracking-wide faint mb-3">
          ¿A qué proyecto lo aplicamos?
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {projects.map((p) => {
            const active = p.id === project;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProject(p.id)}
                aria-pressed={active}
                className="text-left rounded-lg px-4 py-3 transition-colors"
                style={{
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-soft)' : 'var(--bg-raised)',
                }}
              >
                <span className="block text-[14px] font-medium leading-snug">{p.name}</span>
                <span className="block text-[12.5px] muted mt-1 leading-snug">{p.blurb}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <label htmlFor="nota" className="block text-[13px] uppercase tracking-wide faint mb-3">
          Contexto adicional <span className="normal-case">(opcional)</span>
        </label>
        <textarea
          id="nota"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Ej.: quiero centrarme en la parte de conciliación bancaria; el despacho usa A3 y recibe unas 400 facturas al mes."
          className="w-full rounded-lg px-4 py-3 text-[14.5px] leading-relaxed resize-y"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <p className="faint text-[12.5px] mt-2">
          Cuanto más concreto seas aquí, menos genérica saldrá la guía.
        </p>
      </section>

      <section className="flex flex-wrap gap-3 items-center">
        <a
          href={issueUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium"
          style={{ background: 'var(--accent)', color: 'var(--bg-raised)' }}
        >
          Pedir la guía en GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg px-4 py-2.5 text-[14px] font-medium"
          style={{ border: '1px solid var(--border-strong)', color: 'var(--text)' }}
        >
          {copied ? 'Copiado ✓' : 'Copiar el brief'}
        </button>
      </section>

      <p className="muted text-[13.5px] leading-relaxed max-w-prose">
        El botón abre un issue ya rellenado en <code className="font-mono text-[12.5px]">{repo}</code> con
        la etiqueta <code className="font-mono text-[12.5px]">guia-solicitada</code>. La sesión de la
        mañana siguiente lo recoge, escribe la guía en{' '}
        <code className="font-mono text-[12.5px]">src/content/guides/</code> y cierra el issue con el
        enlace. Si quieres la guía ahora mismo, usa «Copiar el brief» y pégamelo en una conversación.
      </p>
    </div>
  );
}
