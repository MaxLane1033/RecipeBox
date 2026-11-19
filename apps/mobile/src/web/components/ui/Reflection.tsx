export type ReflectionData = {
  worked: string;
  changed: string;
  learned: string;
};
export function Reflection({ reflection }: { reflection?: ReflectionData }) {
  if (!reflection) return null;
  return (
    <dl className="mt-4 grid gap-2 text-[13px]">
      {(
        [
          ['worked', 'What worked'],
          ['changed', 'What I changed'],
          ['learned', 'What I learned'],
        ] as const
      ).map(([key, label]) =>
        reflection[key] ? (
          <div key={key} className={`rounded-xl p-4 ${key === 'learned' ? 'bg-butter/60' : 'bg-dark'}`}>
            <dt className="mb-1 font-extrabold text-green">{label}</dt>
            <dd className="whitespace-pre-wrap break-words text-ink">{reflection[key]}</dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}
