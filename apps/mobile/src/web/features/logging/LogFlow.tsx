import { Globe, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import { Select } from '@/web/components/ui/Select';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import type { PostData, RecipeVersion } from '@/web/types/domain';

type LogFlowProps = {
  close: () => void;
  finish: (p: PostData) => void;
  minutes: number;
  recipe: string;
  streak: number;
  versions: RecipeVersion[];
  currentVersionIds: Record<string, string>;
  initialVersionId?: string;
};

export function LogFlow({
  close,
  finish,
  minutes,
  recipe: initialRecipe,
  streak,
  versions,
  currentVersionIds,
  initialVersionId,
}: LogFlowProps) {
  const [selected, setSelected] = useState<string[]>(['Time taken', 'Difficulty score']);
  const [recipe, setRecipe] = useState(initialRecipe);
  const [versionId, setVersionId] = useState(initialVersionId ?? currentVersionIds[initialRecipe]);
  const availableVersions = versions.filter((version) => version.recipeName === recipe && !version.removed);
  const selectedVersion =
    availableVersions.find((version) => version.id === versionId) ??
    availableVersions.find((version) => version.id === currentVersionIds[recipe]) ??
    availableVersions[0];
  const [photo, setPhoto] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [note, setNote] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const stats = [
    'Macros',
    'Time taken',
    'Top ingredients',
    'Difficulty score',
    'Times cooked',
    'Cooking streak',
  ];
  const vals: Record<string, string> = {
    Macros: '540 kcal',
    'Time taken': `${minutes || 35} min`,
    'Top ingredients': 'Garlic, butter',
    'Difficulty score': 'Easy',
    'Times cooked': '4th time',
    'Cooking streak': `${Math.min(7, streak + 1)} day streak`,
  };
  const toggle = (stat: string) =>
    setSelected((previous) =>
      previous.includes(stat)
        ? previous.filter((item) => item !== stat)
        : previous.length < 3
          ? [...previous, stat]
          : previous,
    );

  return (
    <>
      <Header title="Log a meal" back={close} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          finish({
            name: 'Alex',
            title: recipe || 'Home-cooked meal',
            photo,
            note,
            stats: selected.map((stat) => vals[stat]),
            visibility,
            recipeName: recipe || undefined,
            versionId: selectedVersion?.id,
            versionName: selectedVersion?.name,
            recipeSnapshot: selectedVersion ? structuredClone(selectedVersion.snapshot) : undefined,
          });
        }}
      >
        <Select
          label="Recipe"
          value={recipe}
          onChange={(name) => {
            setRecipe(name);
            setVersionId(currentVersionIds[name]);
          }}
          options={[
            { value: '', label: 'A meal without a recipe' },
            ...Object.keys(RECIPE_LEVELS).map((name) => ({
              value: name,
              label: name,
            })),
          ]}
        />
        {availableVersions.length > 1 ? (
          <Select
            label="Version"
            value={selectedVersion?.id ?? ''}
            onChange={setVersionId}
            options={availableVersions.map((version) => ({
              value: version.id,
              label: `${version.name}${version.id === currentVersionIds[recipe] ? ' · Current' : ''}`,
            }))}
          />
        ) : selectedVersion ? (
          <p className="mt-2 text-[12px]">Version: {selectedVersion.name}</p>
        ) : null}
        <label className="relative mt-5 flex min-h-32 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed border-green bg-dark p-4 focus-within:outline-1 focus-within:outline-green">
          {photo ? (
            <>
              <img src={photo} alt="Your meal" className="h-32 w-full rounded-lg object-cover" />
              <span className="absolute bottom-5 rounded-lg bg-white px-3 py-1">Change photo</span>
            </>
          ) : (
            <>
              <Icon name="image" size={20} />
              <span>
                <b className="block">Add a photo</b>
                <span className="text-[12px] font-medium text-muted">Optional · show what you made</span>
              </span>
            </>
          )}
          <input
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Add a meal photo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
                setPhotoError('Choose an image smaller than 10 MB.');
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                setPhoto(String(reader.result));
                setPhotoError('');
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {photoError && (
          <p role="alert" className="mt-2 text-danger">
            {photoError}
          </p>
        )}
        <label>
          Your note <span className="font-medium text-muted">(optional)</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="How did it go? What would you try next time?"
          />
        </label>

        <fieldset className="mt-6" aria-describedby="stats-help">
          <legend className="text-[14px] font-extrabold">Stats</legend>
          <p id="stats-help" className="mt-1 text-[12px]" aria-live="polite">
            Choose up to 3 · {selected.length} selected
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <button
                key={stat}
                type="button"
                aria-pressed={selected.includes(stat)}
                disabled={!selected.includes(stat) && selected.length >= 3}
                className={`flex min-h-16 items-center gap-2 rounded-control border px-3 py-2 text-left disabled:opacity-40 ${
                  selected.includes(stat) ? 'border-green bg-dark' : 'border-rule bg-white'
                }`}
                onClick={() => toggle(stat)}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-control-inner border ${
                    selected.includes(stat) ? 'border-green bg-green text-white' : 'border-muted'
                  }`}
                >
                  {selected.includes(stat) && <Icon name="check" size={14} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold leading-snug">{stat}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">{vals[stat]}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6" aria-describedby="visibility-help">
          <legend className="text-[14px] font-extrabold">Visibility</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(
              [
                ['public', 'Public', Globe],
                ['private', 'Private', LockKeyhole],
              ] as const
            ).map(([value, label, VisibilityIcon]) => (
              <label
                key={value}
                className={`m-0 flex min-h-12 cursor-pointer items-center gap-2 rounded-control border px-3 py-2 ${
                  visibility === value ? 'border-green bg-dark text-green' : 'border-rule bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={visibility === value}
                  onChange={() => setVisibility(value)}
                  className="h-4 w-4 shrink-0"
                />
                <VisibilityIcon size={16} aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
          <p id="visibility-help" className="mt-2 text-[12px]" aria-live="polite">
            {visibility === 'public'
              ? 'Appears on Home and your Profile, and in your cooking history.'
              : 'Only you can see this attempt in your cooking history.'}
          </p>
        </fieldset>

        <div className="mt-6">
          <Button type="submit">{visibility === 'public' ? 'Post attempt' : 'Save privately'}</Button>
        </div>
      </form>
    </>
  );
}
