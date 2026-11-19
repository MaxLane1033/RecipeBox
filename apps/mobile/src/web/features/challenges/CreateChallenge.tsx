import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import { Segments } from '@/web/components/ui/Segments';
import type { Challenge } from '@/web/types/domain';

type CreateChallengeProps = {
  back: () => void;
  onCreate: (c: Challenge) => void;
};
export function CreateChallenge({ back, onCreate }: CreateChallengeProps) {
  const [name, setName] = useState('Cook together');
  const [metric, setMetric] = useState('Meals cooked');
  const [friends, setFriends] = useState<string[]>(['Jo']);
  const [days, setDays] = useState(7);
  const target = metric === 'Streak' ? days : Math.max(3, Math.round(days * 1.4));
  return (
    <>
      <Header title="Create a challenge" back={back} />
      <h1 className="text-[25px]">A little friendly motivation.</h1>
      <p className="mt-2">Choose a shared target and who you’ll cook with.</p>
      <label>
        Challenge name
        <input
          className="field-input"
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <fieldset className="mt-5">
        <legend className="mb-2 text-[13px] font-bold">What counts?</legend>
        <Segments items={['Meals cooked', 'Streak']} value={metric} set={setMetric} />
      </fieldset>
      <label>
        Duration
        <select className="field-input" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          {[7, 14, 30].map((n) => (
            <option key={n} value={n}>
              {n} days
            </option>
          ))}
        </select>
      </label>
      <p className="notice mt-4">
        Target: {target} {metric === 'Streak' ? 'consecutive cooking days' : 'meals cooked'} per person.
      </p>
      <div className="section-heading">
        <h2>Who’s in?</h2>
        <span className="text-[12px] text-muted">{friends.length + 1} cooks including you</span>
      </div>
      <fieldset aria-label="Choose friends" className="mb-6">
        {['Jo', 'Sam', 'Priya', 'Mina', 'Dev'].map((friend) => (
          <button
            type="button"
            key={friend}
            aria-pressed={friends.includes(friend)}
            className="flex min-h-16 w-full items-center gap-3 border-b border-rule text-left"
            onClick={() =>
              setFriends((value) =>
                value.includes(friend) ? value.filter((x) => x !== friend) : [...value, friend],
              )
            }
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-dark font-bold text-green">
              {friend[0]}
            </span>
            <b className="flex-1">{friend}</b>
            <span
              className={`grid h-6 w-6 place-items-center rounded-md border ${
                friends.includes(friend) ? 'border-green bg-green text-white' : 'border-muted'
              }`}
            >
              {friends.includes(friend) && <Icon name="check" size={16} />}
            </span>
          </button>
        ))}
      </fieldset>
      <Button
        disabled={!friends.length || !name.trim()}
        onClick={() =>
          onCreate({
            id: crypto.randomUUID(),
            name: name.trim(),
            metric,
            goal: target,
            left: days,
            members: [{ name: 'Alex', count: 0 }, ...friends.map((friend) => ({ name: friend, count: 0 }))],
          })
        }
      >
        Create challenge
      </Button>
    </>
  );
}
