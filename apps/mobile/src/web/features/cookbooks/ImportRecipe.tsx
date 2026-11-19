import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { RECIPE_LEVELS, RECIPES } from '@/web/data/recipes';
import { SaveSheet } from '@/web/features/cookbooks/SaveSheet';
import type { Cookbook } from '@/web/types/domain';

const SAMPLE_RECIPE = 'Crispy smashed potatoes';
const duplicateTitleMessage = 'A recipe with this title already exists. Choose a different title.';

function titleExists(title: string) {
  const normalized = title.trim().toLocaleLowerCase();
  return Object.keys(RECIPES).some((name) => name.toLocaleLowerCase() === normalized);
}

export function ImportRecipe({
  back,
  books,
  saveRecipe,
}: {
  back: () => void;
  books: Cookbook[];
  saveRecipe: (b: string, r: string) => void;
}) {
  const [preview, setPreview] = useState(false);
  const [write, setWrite] = useState(false);
  const [edit, setEdit] = useState(false);
  const [save, setSave] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [title, setTitle] = useState(SAMPLE_RECIPE);
  const [wTitle, setWTitle] = useState('');
  const [wServ, setWServ] = useState('2');
  const [wTime, setWTime] = useState('30 min');
  const [wIng, setWIng] = useState('200g pasta\n2 tbsp butter\n3 cloves garlic');
  const [wSteps, setWSteps] = useState('1. Boil the pasta\n2. Make the sauce\n3. Toss and serve');
  const name = write ? wTitle.trim() : title.trim();
  const createsRecipe = write || name !== SAMPLE_RECIPE;
  const titleError = saveError || (createsRecipe && titleExists(name) ? duplicateTitleMessage : '');
  const openSave = () => {
    if (!name || (createsRecipe && titleExists(name))) {
      setSaveError(name ? duplicateTitleMessage : 'Enter a recipe title.');
      return;
    }
    setSaveError('');
    setSave(true);
  };
  const sheet = save && (
    <SaveSheet
      close={() => setSave(false)}
      recipe={name}
      books={books}
      onSave={(b, r) => {
        // Recheck at submission; the catalogue can change while the picker is open.
        if (!r.trim() || ((write || r !== SAMPLE_RECIPE) && titleExists(r))) {
          setSave(false);
          setSaveError(r.trim() ? duplicateTitleMessage : 'Enter a recipe title.');
          return;
        }
        if (write) {
          const lines = wIng
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          const steps = wSteps
            .split('\n')
            .map((line) => line.trim().replace(/^\d+[.)]\s*/, ''))
            .filter(Boolean);
          Object.defineProperty(RECIPES, r, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
              source: null,
              cuisine: 'Other',
              diet: [],
              macro: [],
              has: [],
              dishes: 2,
              blurb: `Your recipe · ingredients as written for ${wServ} servings.`,
              ing: lines.map((line) => [0, '', line]),
              steps: steps.map((line, index) => [
                `Step ${index + 1}`,
                line,
                Math.max(1, Math.round((parseInt(wTime, 10) || 30) / steps.length)),
              ]),
            },
          });
        } else if (r !== SAMPLE_RECIPE) {
          Object.defineProperty(RECIPES, r, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { ...RECIPES[SAMPLE_RECIPE] },
          });
        }
        if (!Object.hasOwn(RECIPE_LEVELS, r))
          Object.defineProperty(RECIPE_LEVELS, r, {
            value: 'Starter',
            enumerable: true,
            writable: true,
            configurable: true,
          });
        saveRecipe(b, r);
      }}
    />
  );
  if (write)
    return (
      <>
        <Header
          title="Write your own"
          back={() => {
            setSaveError('');
            setWrite(false);
          }}
        />
        <label>
          Recipe title
          <input
            className="link-input field-input block"
            placeholder="My best pasta"
            value={wTitle}
            onChange={(e) => {
              setWTitle(e.target.value);
              setSaveError('');
            }}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? 'recipe-title-error' : undefined}
          />
        </label>
        {titleError && (
          <p id="recipe-title-error" role="alert" className="mt-2 text-[13px] text-danger">
            {titleError}
          </p>
        )}
        <div className="split-fields grid grid-cols-2 gap-2.5">
          <label>
            Servings
            <input
              className="link-input field-input block"
              type="number"
              min={1}
              max={12}
              value={wServ}
              onChange={(e) => setWServ(e.target.value)}
            />
          </label>
          <label>
            Time
            <input
              className="link-input field-input block"
              value={wTime}
              onChange={(e) => setWTime(e.target.value)}
            />
          </label>
        </div>
        <label>
          Ingredients
          <textarea value={wIng} onChange={(e) => setWIng(e.target.value)} />
        </label>
        <label>
          Steps
          <textarea value={wSteps} onChange={(e) => setWSteps(e.target.value)} />
        </label>
        <div className="action-stack flex flex-col gap-[9px] mt-5.5">
          <Button
            disabled={
              !!titleError ||
              !wTitle.trim() ||
              !wIng.trim() ||
              !wSteps.trim() ||
              Number(wServ) < 1 ||
              Number(wServ) > 12
            }
            onClick={openSave}
          >
            Save recipe
          </Button>
        </div>
        {sheet}
      </>
    );
  return (
    <>
      <Header title="Import recipe" back={back} />
      <p className="notice mb-4">
        Link import is a preview using a sample recipe. Write your own to save your ingredients and steps for
        this session.
      </p>
      <label>
        Instagram, TikTok, or website
        <input
          className="link-input field-input block"
          placeholder="Paste a link"
          onChange={(e) => setPreview(!!e.target.value.trim())}
        />
      </label>
      <p className="share-hint text-[13px]">Importing directly from another app is coming later.</p>
      {preview && (
        <article className="import-card bg-card mt-5 p-3 rounded-[12px] border border-rule [&_.photo]:h-[190px] [&_.photo]:mb-3 [&_h2]:mt-1.5">
          <Photo name="Crispy smashed potatoes" />
          <Level />
          {edit ? (
            <input
              className="link-input field-input block"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSaveError('');
              }}
              aria-invalid={!!titleError}
              aria-describedby={titleError ? 'recipe-title-error' : undefined}
            />
          ) : (
            <h2>{title}</h2>
          )}
          <p>3 ingredients · 4 steps · About 50 min</p>
          {titleError && (
            <p id="recipe-title-error" role="alert" className="mt-2 text-[13px] text-danger">
              {titleError}
            </p>
          )}
          <div className="split-actions flex gap-[9px] [&>*]:flex-1">
            <Button secondary onClick={() => setEdit(!edit)}>
              {edit ? 'Done' : 'Edit'}
            </Button>
            <Button disabled={!title.trim() || !!titleError} onClick={openSave}>
              Save to cookbook
            </Button>
          </div>
        </article>
      )}
      <div className="divider text-center text-muted text-[13px] my-5.5 mx-0">or</div>
      <Button
        secondary
        onClick={() => {
          setSaveError('');
          setWrite(true);
        }}
      >
        Write your own
      </Button>
      {sheet}
    </>
  );
}
