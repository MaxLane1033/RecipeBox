import { Header } from '@/web/components/ui/Header';
import { ProgressBar } from '@/web/components/ui/ProgressBar';
import type { Challenge } from '@/web/types/domain';
export function ChallengeDetail({
  back,
  c,
  currentName = 'Alex',
}: {
  back: () => void;
  c: Challenge;
  currentName?: string;
}) {
  const rows = [...c.members].sort((a, b) => b.count - a.count);
  const mine = c.members.find((m) => m.name === 'Alex')?.count || 0;
  return (
    <>
      <Header title="Challenge" back={back} />
      <h1>{c.name}</h1>
      <p className="mt-2">
        {c.left} days left · {c.metric === 'Streak' ? 'Cook on consecutive days' : 'Meals cooked'}
      </p>
      <div className="my-5 rounded-2xl bg-dark p-5">
        <h3>Your progress</h3>
        <p className="my-3 text-[13px]">
          {mine} of {c.goal} {c.metric === 'Streak' ? 'days' : 'meals'}
        </p>
        <ProgressBar value={(mine / c.goal) * 100} label="Your challenge progress" />
      </div>
      <div className="section-heading">
        <h2>Leaderboard</h2>
        <span className="text-[12px] text-muted">{c.members.length} cooks</span>
      </div>
      <ol>
        {rows.map((member, i) => (
          <li
            key={member.name}
            className={`mb-2 grid min-h-18 grid-cols-[20px_40px_1fr_auto] items-center gap-3 rounded-xl px-3 py-4 ${
              member.name === 'Alex' ? 'bg-dark' : 'border-b border-rule'
            }`}
          >
            <b className="text-[12px] text-muted">{i + 1}</b>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold text-green">
              {member.name === 'Alex' ? currentName[0] : member.name[0]}
            </span>
            <b className="min-w-0 break-words">
              {member.name === 'Alex' ? currentName : member.name}
              {member.name === 'Alex' ? ' (you)' : ''}
            </b>
            <span className="text-[12px] font-bold">
              {member.count} {c.metric === 'Streak' ? 'days' : 'meals'}
            </span>
          </li>
        ))}
      </ol>
      <p className="notice mt-5">
        Inviting more friends to an existing challenge is coming later. Choose friends when you create a
        challenge.
      </p>
    </>
  );
}
