import type { AppScreen } from '@/web/app/navigation';
import { Button } from '@/web/components/ui/Button';
import { Icon } from '@/web/components/ui/Icon';
import { ProgressBar } from '@/web/components/ui/ProgressBar';
import type { Challenge } from '@/web/types/domain';

type ChallengeListProps = {
  challenges: Challenge[];
  openChallenge: (id: string) => void;
  go: (screen: AppScreen) => void;
};
export function ChallengeList({ challenges, openChallenge, go }: ChallengeListProps) {
  return (
    <>
      <h2>Better together.</h2>
      <p className="mt-2 mb-5 text-[13px]">A shared goal, a little encouragement, and a reason to cook.</p>
      <div className="mb-4 flex justify-between text-[12px] text-muted">
        <span>Your challenges</span>
        <span>{challenges.length} active</span>
      </div>
      <p className="mb-4 text-[12px] text-muted">Includes sample challenges and activity.</p>
      {challenges.map((c) => {
        const count = c.members.find((m) => m.name === 'Alex')?.count || 0;
        return (
          <button
            type="button"
            className="challenge mb-4 block w-full rounded-2xl border border-rule bg-white p-5 text-left"
            onClick={() => openChallenge(c.id)}
            key={c.id}
          >
            <div className="mb-3 flex justify-between text-[12px] text-muted">
              <span>{c.members.length === 2 ? 'One-on-one' : `${c.members.length} cooks`}</span>
              <span>{c.left} days left</span>
            </div>
            <h3 className="mb-2 text-[20px]">{c.name}</h3>
            <p className="mb-4 text-[13px]">
              {c.members.map((m) => (m.name === 'Alex' ? 'You' : m.name)).join(', ')}
            </p>
            <ProgressBar value={(count / c.goal) * 100} label={`${c.name} your progress`} />
            <div className="mt-3 flex justify-between text-[12px]">
              <b>
                {count} of {c.goal} {c.metric === 'Streak' ? 'days' : 'meals'}
              </b>
              <span className="inline-flex items-center gap-1 text-green">
                View challenge <Icon name="forward" size={14} />
              </span>
            </div>
          </button>
        );
      })}
      {!challenges.length && (
        <p className="notice mb-5">Start a challenge with a friend to cook toward something together.</p>
      )}
      <Button secondary onClick={() => go('createChallenge')}>
        Create a challenge
      </Button>
    </>
  );
}
