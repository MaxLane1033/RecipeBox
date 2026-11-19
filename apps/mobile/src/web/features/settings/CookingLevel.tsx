import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Level } from '@/web/components/ui/Level';
import { COOKING_LEVELS } from '@/web/data/recipes';
import type { ExperienceLevel } from '@/web/types/domain';

type CookingLevelProps = {
  back: () => void;
  level: ExperienceLevel;
  setLevel: (level: ExperienceLevel) => void;
};
export function CookingLevel({ back, level, setLevel }: CookingLevelProps) {
  const [selected, setSelected] = useState(level);
  const [saved, setSaved] = useState(false);
  const descriptions = [
    'Build confidence with the basics',
    'Follow recipes with ease',
    'Improvise and adapt',
    'Take on a challenge',
  ];
  return (
    <>
      <Header title="My cooking level" back={back} />
      <h1 className="text-[25px]">Cook at your own pace.</h1>
      <p className="mt-2 mb-5">Only you see this. Your level helps sort recipes and estimate cooking time.</p>
      <fieldset className="space-y-3">
        <legend className="sr-only">Choose your cooking level</legend>
        {COOKING_LEVELS.map((item, i) => (
          <label
            key={item}
            className={`m-0 flex min-h-16 cursor-pointer items-center gap-3 rounded-control border p-3 ${
              selected === item ? 'border-green bg-dark' : 'border-rule bg-white'
            }`}
          >
            <input
              className="h-5 w-5 shrink-0"
              type="radio"
              name="level"
              value={item}
              checked={selected === item}
              onChange={() => {
                setSelected(item);
                setSaved(false);
              }}
            />
            <span>
              <Level level={item} />
              <span className="mt-1 block text-[13px] font-medium text-muted">{descriptions[i]}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="mt-6">
        <Button
          disabled={selected === level}
          onClick={() => {
            setLevel(selected);
            setSaved(true);
          }}
        >
          Save cooking level
        </Button>
      </div>
      {saved && (
        <p role="status" className="notice mt-4">
          Your level is now {selected}. You can change it anytime.
        </p>
      )}
      <div className="section-heading">
        <h2>A suggested next step</h2>
      </div>
      <p className="mb-4">
        Try a few different recipes at your level. Feeling comfortable is a better signal than speed.
      </p>
    </>
  );
}
