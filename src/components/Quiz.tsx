import { useMemo, useState } from 'react';

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const PROGRESS_KEY = 'asd:quiz:v1';

function saveScore(pillId: string, score: number, total: number) {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[pillId] = { score, total, at: new Date().toISOString() };
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    // Sin persistencia el examen sigue funcionando en esta sesión.
  }
}

export default function Quiz({
  pillId,
  questions,
}: {
  pillId: string;
  questions: QuizQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const current = questions[index];
  const score = useMemo(
    () => answers.reduce((n, a, i) => n + (a === questions[i]?.answer ? 1 : 0), 0),
    [answers, questions],
  );

  if (total === 0) return null;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((prev) => [...prev, i]);
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      const finalScore = answers.reduce(
        (n, a, i) => n + (a === questions[i]?.answer ? 1 : 0),
        0,
      );
      saveScore(pillId, finalScore, total);
      setDone(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const good = pct >= 70;
    return (
      <section className="rounded-xl p-6 surface" aria-live="polite">
        <p className="text-[13px] uppercase tracking-wide faint mb-3">Resultado</p>
        <p className="text-2xl font-semibold tracking-tight mb-1">
          {score} de {total} correctas
        </p>
        <p className="text-[14.5px] muted mb-5">
          {good
            ? 'Lo tienes. El siguiente paso es el bloque «Aplícalo» de arriba: elige un paso y ejecútalo hoy.'
            : 'Merece una segunda lectura. Vuelve al análisis, fíjate en las explicaciones y repite el examen.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restart}
            className="rounded-lg px-3.5 py-2 text-[13.5px] font-medium"
            style={{ border: '1px solid var(--border-strong)', color: 'var(--text)' }}
          >
            Repetir examen
          </button>
        </div>
      </section>
    );
  }

  const isCorrect = picked !== null && picked === current.answer;

  return (
    <section className="rounded-xl p-6 surface">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[13px] uppercase tracking-wide faint">
          Pregunta {index + 1} de {total}
        </p>
        <div
          className="h-1 flex-1 max-w-[140px] rounded-full overflow-hidden"
          style={{ background: 'var(--bg-sunken)' }}
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>

      <h3 className="text-[17px] font-semibold leading-snug tracking-tight mb-4">
        {current.question}
      </h3>

      <ul className="space-y-2">
        {current.options.map((option, i) => {
          const isAnswer = i === current.answer;
          const chosen = picked === i;
          const revealed = picked !== null;

          let border = 'var(--border)';
          let bg = 'transparent';
          let color = 'var(--text)';
          if (revealed && isAnswer) {
            border = 'var(--ok)';
            bg = 'var(--ok-soft)';
          } else if (revealed && chosen) {
            border = 'var(--bad)';
            bg = 'var(--bad-soft)';
          } else if (revealed) {
            color = 'var(--text-faint)';
          }

          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(i)}
                disabled={revealed}
                className="w-full text-left rounded-lg px-4 py-3 text-[14.5px] leading-snug transition-colors flex gap-3 items-start disabled:cursor-default"
                style={{ border: `1px solid ${border}`, background: bg, color }}
              >
                <span className="font-mono text-[12px] mt-0.5 shrink-0 faint">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {revealed && isAnswer && <Check />}
                {revealed && chosen && !isAnswer && <Cross />}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <div
          className="mt-4 rounded-lg px-4 py-3 text-[14px] leading-relaxed"
          style={{
            background: isCorrect ? 'var(--ok-soft)' : 'var(--bad-soft)',
            border: `1px solid ${isCorrect ? 'var(--ok)' : 'var(--bad)'}`,
          }}
        >
          <strong className="font-semibold">{isCorrect ? 'Correcto. ' : 'No exactamente. '}</strong>
          {current.explanation}
        </div>
      )}

      {picked !== null && (
        <button
          type="button"
          onClick={next}
          className="mt-4 rounded-lg px-4 py-2 text-[13.5px] font-medium"
          style={{ background: 'var(--accent)', color: 'var(--bg-raised)' }}
        >
          {index + 1 < total ? 'Siguiente pregunta' : 'Ver resultado'}
        </button>
      )}
    </section>
  );
}

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Cross = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bad)" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
