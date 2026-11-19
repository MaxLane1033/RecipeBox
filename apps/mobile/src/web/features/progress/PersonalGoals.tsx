import { type Dispatch, type SetStateAction, useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { ProgressBar } from '@/web/components/ui/ProgressBar';

type PersonalGoalsProps = {
  extra: string[][];
  setExtra: Dispatch<SetStateAction<string[][]>>;
};
export function PersonalGoals({ extra, setExtra }: PersonalGoalsProps) {
  const [custom, setCustom] = useState(false);
  const [target, setTarget] = useState(2);
  const [name, setName] = useState('Cook one new dish');
  const [saved, setSaved] = useState(false);
  return (
    <>
      <h2>Your goals, your pace.</h2>
      <p className="mt-2 mb-5 text-[13px]">
        Personal commitments live here. Cook together in a shared challenge from Groups.
      </p>
      {[
        ['Cook 4 times a week', '75%', '3 of 4'],
        ['Try 5 cuisines', '40%', '2 of 5'],
        ['Protein with dinner', '60%', '3 days'],
        ...extra,
      ].map((goal, index) => (
        <div
          className="mb-5 border-b border-rule pb-5"
          // biome-ignore lint/suspicious/noArrayIndexKey: the goal list only appends, preserving existing row positions even for repeated goal names.
          key={index}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-[14px]">{goal[0]}</h3>
            <span className="shrink-0 text-[12px] text-muted">{goal[2]}</span>
          </div>
          <ProgressBar value={parseFloat(goal[1])} label={goal[0]} />
        </div>
      ))}
      {custom ? (
        <form
          className="rounded-2xl bg-dark p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setExtra((value) => [...value, [name.trim(), '0%', `0 of ${target}`]]);
            setCustom(false);
            setSaved(true);
          }}
        >
          <label className="mt-0">
            Goal name
            <input
              // biome-ignore lint/a11y/noAutofocus: the goal form opens only after the user requests a custom goal.
              autoFocus
              className="field-input"
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Target per week
            <select
              className="field-input"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'time' : 'times'}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-5 space-y-2">
            <Button type="submit" disabled={!name.trim()}>
              Save goal
            </Button>
            <Button secondary onClick={() => setCustom(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          secondary
          onClick={() => {
            setCustom(true);
            setSaved(false);
          }}
        >
          Set a custom goal
        </Button>
      )}
      {saved && (
        <p role="status" className="notice mt-4">
          Goal saved. Small steps add up.
        </p>
      )}
    </>
  );
}
