import type { AppScreen } from '@/web/app/navigation';
export function Insights({ go }: { go: (screen: AppScreen) => void }) {
  return (
    <>
      <p className="mb-4 text-[12px] text-muted">
        Sample insights · your logged meals update the meal count above.
      </p>
      <section className="rounded-2xl bg-green-dark p-5 text-white">
        <h2 className="text-[20px]">You’re finding your rhythm.</h2>
        <p className="mt-2 text-[13px] text-white/85">
          Average cooking time is 38 minutes, down from 52 last month.
        </p>
        <div
          className="mt-6 flex h-28 items-end justify-around gap-5"
          role="img"
          aria-label="Average time: last month 52 minutes, this month 38 minutes"
        >
          <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[12px]">52 min</span>
            <div className="h-16 w-full rounded-t-lg bg-white/35" />
          </div>
          <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[12px] font-bold">38 min</span>
            <div className="h-12 w-full rounded-t-lg bg-butter" />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-5 text-center text-[12px]">
          <span>Last month</span>
          <span>This month</span>
        </div>
      </section>
      <div className="section-heading">
        <h2>Where your time goes</h2>
      </div>
      <div
        role="img"
        className="flex h-4 overflow-hidden rounded-full"
        aria-label="Prep 25%, cook 55%, clean 20%"
      >
        <div className="w-1/4 bg-green" />
        <div className="w-[55%] bg-butter" />
        <div className="w-1/5 bg-muted" />
      </div>
      <div className="mt-3 flex justify-between text-[12px]">
        <span>Prep · 25%</span>
        <span>Cook · 55%</span>
        <span>Clean · 20%</span>
      </div>
      <div className="section-heading">
        <h2>Cuisines you’re exploring</h2>
      </div>
      {[
        ['Italian', 78],
        ['Mexican', 52],
        ['Indian', 34],
      ].map(([name, value]) => (
        <div className="mb-4" key={name}>
          <div className="mb-2 flex justify-between text-[13px]">
            <b>{name}</b>
            <span>{value}%</span>
          </div>
          <div className="h-2 rounded-full bg-dark">
            <div className="h-2 rounded-full bg-green" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
      <p className="mt-4 text-[12px]">
        Share of sample meals that include each cuisine; a meal can include more than one.
      </p>
      <div className="mt-6 rounded-xl bg-butter/50 p-4">
        <h3>Ready for your next step?</h3>
        <p className="mt-2 text-[13px]">Your comfort in the kitchen matters more than the clock.</p>
        <button type="button" className="text-action mt-1" onClick={() => go('level')}>
          Review my cooking level
        </button>
      </div>
    </>
  );
}
