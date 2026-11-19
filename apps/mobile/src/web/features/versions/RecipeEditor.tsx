import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { BottomBar } from '@/web/components/ui/BottomBar';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { displayIngredientAmount, savedIngredientAmount } from '@/web/features/versions/recipeEditDraft';
import type { RecipeData, RecipeVersion } from '@/web/types/domain';

type IngredientDraft = {
  id: string;
  amount: string;
  initialDisplayAmount: string;
  originalAmount: number | null;
  unit: string;
  name: string;
};

type StepDraft = {
  id: string;
  heading: string;
  body: string;
  minutes: string;
};

type RecipeEditOptions = {
  name: string;
  changed: string;
};

type RecipeEditorProps = {
  back: () => void;
  recipeName: string;
  baseVersion: RecipeVersion;
  servings?: number;
  save: (snapshot: RecipeData, options: RecipeEditOptions) => void;
};

type FieldError = {
  field: string;
  message: string;
};

const inlineField =
  'h-control min-w-0 w-full rounded-control-inner border border-transparent bg-transparent px-1.5 text-[13px] focus:border-green focus:bg-white';

export function RecipeEditor({ back, recipeName, baseVersion, servings = 2, save }: RecipeEditorProps) {
  const formId = useId();
  const [name, setName] = useState('');
  const [changed, setChanged] = useState('');
  const [description, setDescription] = useState(baseVersion.snapshot.blurb);
  const [editingDescription, setEditingDescription] = useState(false);
  const [versionDetailsOpen, setVersionDetailsOpen] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientDraft[]>(() =>
    baseVersion.snapshot.ing.map(([amount, unit, ingredient]) => ({
      id: crypto.randomUUID(),
      amount: displayIngredientAmount(amount, servings),
      initialDisplayAmount: displayIngredientAmount(amount, servings),
      originalAmount: amount,
      unit,
      name: ingredient,
    })),
  );
  const [steps, setSteps] = useState<StepDraft[]>(() =>
    baseVersion.snapshot.steps.map(([heading, body, minutes]) => ({
      id: crypto.randomUUID(),
      heading,
      body,
      minutes: String(minutes),
    })),
  );
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [error, setError] = useState<FieldError | null>(null);
  const [focusField, setFocusField] = useState<string | null>(null);
  const ingredientField = (id: string, field: string) => `${formId}-ingredient-${id}-${field}`;
  const stepField = (id: string, field: string) => `${formId}-step-${id}-${field}`;
  const errorId = `${formId}-error`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: newly added or expanded fields must exist in the committed DOM before focus can move.
  useEffect(() => {
    if (!focusField) return;
    const field = document.getElementById(focusField);
    if (field) {
      field.focus();
      setFocusField(null);
    }
  }, [focusField, expandedStep, ingredients.length, steps.length]);

  const updateIngredient = (id: string, update: Partial<IngredientDraft>) => {
    setIngredients((previous) =>
      previous.map((ingredient) => (ingredient.id === id ? { ...ingredient, ...update } : ingredient)),
    );
    if (error?.field.startsWith(ingredientField(id, ''))) setError(null);
  };
  const updateStep = (id: string, update: Partial<StepDraft>) => {
    setSteps((previous) => previous.map((step) => (step.id === id ? { ...step, ...update } : step)));
    if (error?.field.startsWith(stepField(id, ''))) setError(null);
  };
  const invalid = (field: string, message: string, stepId?: string) => {
    if (stepId) setExpandedStep(stepId);
    setError({ field, message });
    setFocusField(field);
  };
  const errorFor = (field: string) => error?.field === field;
  const fieldHelp = (field: string) => (errorFor(field) ? errorId : undefined);
  const errorMessage = (field: string) =>
    errorFor(field) && (
      <p id={errorId} role="alert" className="mt-1 text-[12px] text-danger">
        {error?.message}
      </p>
    );

  const submit = () => {
    for (const ingredient of ingredients) {
      if (!ingredient.name.trim()) {
        invalid(ingredientField(ingredient.id, 'name'), 'Add an ingredient name.');
        return;
      }
      if (!Number.isFinite(Number(ingredient.amount)) || Number(ingredient.amount) < 0) {
        invalid(
          ingredientField(ingredient.id, 'amount'),
          'Enter zero or more, or leave blank for ingredients added to taste.',
        );
        return;
      }
    }
    for (const step of steps) {
      if (!step.heading.trim()) {
        invalid(stepField(step.id, 'heading'), 'Give this step a title.', step.id);
        return;
      }
      if (!step.body.trim()) {
        invalid(stepField(step.id, 'body'), 'Add instructions for this step.', step.id);
        return;
      }
      if (!Number.isFinite(Number(step.minutes)) || Number(step.minutes) < 0) {
        invalid(stepField(step.id, 'minutes'), 'Use zero minutes or more.', step.id);
        return;
      }
    }
    const snapshot: RecipeData = {
      ...structuredClone(baseVersion.snapshot),
      blurb: description.trim(),
      ing: ingredients.map((ingredient) => [
        savedIngredientAmount(
          ingredient.amount,
          servings,
          ingredient.originalAmount,
          ingredient.initialDisplayAmount,
        ),
        ingredient.unit.trim(),
        ingredient.name.trim(),
      ]),
      steps: steps.map((step) => [step.heading.trim(), step.body.trim(), Number(step.minutes)]),
    };
    const updates = [
      snapshot.blurb !== baseVersion.snapshot.blurb ? 'description' : '',
      JSON.stringify(snapshot.ing) !== JSON.stringify(baseVersion.snapshot.ing) ? 'ingredients' : '',
      JSON.stringify(snapshot.steps) !== JSON.stringify(baseVersion.snapshot.steps) ? 'method' : '',
    ].filter(Boolean);
    const summary = updates.length ? `Updated ${updates.join(' and ')}.` : `Saved from ${baseVersion.name}.`;
    save(snapshot, { name: name.trim(), changed: changed.trim() || summary });
  };

  return (
    <>
      <Header title="Edit recipe" back={back} />
      <h1 className="break-words text-[24px]">{recipeName}</h1>
      <p className="mt-1 text-[12px]">Based on {baseVersion.name}</p>
      <form
        id={formId}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {editingDescription ? (
          <textarea
            // biome-ignore lint/a11y/noAutofocus: description editing is opened explicitly by the user.
            autoFocus
            aria-label="Description"
            className="mt-3 min-h-20 text-[14px]"
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={() => setEditingDescription(false)}
          />
        ) : (
          <button
            type="button"
            aria-label="Edit description"
            className="mt-3 flex min-h-control w-full items-start gap-3 rounded-control text-left"
            onClick={() => setEditingDescription(true)}
          >
            <span className="line-clamp-3 min-w-0 flex-1 text-[14px] leading-relaxed text-muted">
              {description || 'Add a short description'}
            </span>
            <Pencil size={16} aria-hidden="true" className="mt-1 shrink-0 text-green" />
          </button>
        )}

        <section aria-labelledby="edit-ingredients-title" className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="edit-ingredients-title">Ingredients</h2>
            <span className="text-[12px] font-semibold text-muted">{servings} servings</span>
          </div>
          <div
            aria-hidden="true"
            className="mt-3 grid grid-cols-[48px_44px_minmax(0,1fr)_32px] gap-1 text-[10px] font-semibold text-muted"
          >
            <span className="px-1.5">Amount</span>
            <span className="px-1.5">Unit</span>
            <span className="px-1.5">Ingredient</span>
            <span />
          </div>
          {ingredients.map((ingredient, index) => {
            const amountId = ingredientField(ingredient.id, 'amount');
            const nameId = ingredientField(ingredient.id, 'name');
            return (
              <div key={ingredient.id} className="border-b border-rule py-1">
                <div className="grid grid-cols-[48px_44px_minmax(0,1fr)_32px] items-center gap-1">
                  <input
                    id={amountId}
                    className={`${inlineField} tabular-nums`}
                    type="text"
                    inputMode="decimal"
                    aria-label={`Amount for ingredient ${index + 1}`}
                    aria-invalid={errorFor(amountId) || undefined}
                    aria-describedby={fieldHelp(amountId)}
                    value={ingredient.amount}
                    placeholder="—"
                    onChange={(event) =>
                      updateIngredient(ingredient.id, {
                        amount: event.target.value,
                      })
                    }
                  />
                  <input
                    className={inlineField}
                    aria-label={`Unit for ingredient ${index + 1}`}
                    value={ingredient.unit}
                    onChange={(event) =>
                      updateIngredient(ingredient.id, {
                        unit: event.target.value,
                      })
                    }
                  />
                  <input
                    id={nameId}
                    className={inlineField}
                    aria-label={`Ingredient ${index + 1}`}
                    aria-invalid={errorFor(nameId) || undefined}
                    aria-describedby={fieldHelp(nameId)}
                    value={ingredient.name}
                    required
                    placeholder="Ingredient"
                    title={ingredient.name}
                    onChange={(event) =>
                      updateIngredient(ingredient.id, {
                        name: event.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove ingredient ${index + 1}`}
                    disabled={ingredients.length <= 1}
                    className="grid h-control-small w-control-small place-items-center rounded-control text-muted hover:bg-dark hover:text-danger disabled:opacity-30"
                    onClick={() => {
                      setIngredients((previous) => previous.filter((item) => item.id !== ingredient.id));
                      if (error?.field.startsWith(ingredientField(ingredient.id, ''))) setError(null);
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
                {errorMessage(amountId)}
                {errorMessage(nameId)}
              </div>
            );
          })}
          <p className="mt-2 text-[11px]">Leave amounts blank for ingredients added to taste.</p>
          <button
            type="button"
            className="text-action mt-1 inline-flex items-center gap-2"
            onClick={() => {
              const ingredient: IngredientDraft = {
                id: crypto.randomUUID(),
                amount: '',
                initialDisplayAmount: '',
                originalAmount: null,
                unit: '',
                name: '',
              };
              setIngredients((previous) => [...previous, ingredient]);
              setFocusField(ingredientField(ingredient.id, 'name'));
            }}
          >
            <Plus size={16} aria-hidden="true" /> Add ingredient
          </button>
        </section>

        <section aria-labelledby="edit-method-title" className="mt-6">
          <h2 id="edit-method-title" className="mb-2">
            Method
          </h2>
          {steps.map((step, index) => {
            const open = expandedStep === step.id;
            const headingId = stepField(step.id, 'heading');
            const bodyId = stepField(step.id, 'body');
            const minutesId = stepField(step.id, 'minutes');
            const panelId = stepField(step.id, 'panel');
            const Chevron = open ? ChevronUp : ChevronDown;
            return (
              <div key={step.id} className="border-b border-rule">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-16 w-full items-start gap-3 rounded-control py-3 text-left hover:bg-dark/40"
                  onClick={() => setExpandedStep(open ? null : step.id)}
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-dark text-[11px] font-bold text-green">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold">{step.heading || 'New step'}</span>
                    {!open && (
                      <span className="mt-1 line-clamp-2 block text-[12px] leading-snug text-muted">
                        {step.body || 'Tap to add instructions'}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 flex shrink-0 items-center gap-2 text-muted">
                    {Number(step.minutes) > 0 && <span className="text-[11px]">{step.minutes} min</span>}
                    <Chevron size={16} aria-hidden="true" />
                  </span>
                </button>
                {open && (
                  <div id={panelId} className="pb-4 pl-9">
                    <label className="mt-0 text-[12px]">
                      Step title
                      <input
                        id={headingId}
                        className="field-input mt-1"
                        value={step.heading}
                        required
                        aria-label={`Title for step ${index + 1}`}
                        aria-invalid={errorFor(headingId) || undefined}
                        aria-describedby={fieldHelp(headingId)}
                        onChange={(event) => updateStep(step.id, { heading: event.target.value })}
                      />
                    </label>
                    {errorMessage(headingId)}
                    <label className="mt-3 text-[12px]">
                      Instructions
                      <textarea
                        id={bodyId}
                        className="mt-1 min-h-20"
                        value={step.body}
                        required
                        aria-label={`Instructions for step ${index + 1}`}
                        aria-invalid={errorFor(bodyId) || undefined}
                        aria-describedby={fieldHelp(bodyId)}
                        onChange={(event) => updateStep(step.id, { body: event.target.value })}
                      />
                    </label>
                    {errorMessage(bodyId)}
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <label className="mt-0 max-w-24 text-[11px]">
                        Minutes
                        <input
                          id={minutesId}
                          className="field-input mt-1"
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          aria-label={`Minutes for step ${index + 1}`}
                          aria-invalid={errorFor(minutesId) || undefined}
                          aria-describedby={fieldHelp(minutesId)}
                          value={step.minutes}
                          onChange={(event) => updateStep(step.id, { minutes: event.target.value })}
                        />
                      </label>
                      <button
                        type="button"
                        aria-label={`Remove step ${index + 1}`}
                        disabled={steps.length <= 1}
                        className="inline-flex min-h-control items-center gap-1.5 rounded-control px-2 text-[12px] font-semibold text-muted hover:bg-dark hover:text-danger disabled:opacity-30"
                        onClick={() => {
                          setSteps((previous) => previous.filter((item) => item.id !== step.id));
                          setExpandedStep(null);
                          if (error?.field.startsWith(stepField(step.id, ''))) setError(null);
                        }}
                      >
                        <Trash2 size={16} aria-hidden="true" /> Remove step
                      </button>
                    </div>
                    {errorMessage(minutesId)}
                  </div>
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="text-action mt-2 inline-flex items-center gap-2"
            onClick={() => {
              const step: StepDraft = {
                id: crypto.randomUUID(),
                heading: '',
                body: '',
                minutes: '0',
              };
              setSteps((previous) => [...previous, step]);
              setExpandedStep(step.id);
              setFocusField(stepField(step.id, 'heading'));
            }}
          >
            <Plus size={16} aria-hidden="true" /> Add step
          </button>
        </section>

        <section className="mt-6 border-t border-rule pt-2">
          <button
            type="button"
            className="flex min-h-control w-full items-center justify-between gap-3 rounded-control text-left text-[13px] font-semibold text-green"
            aria-expanded={versionDetailsOpen}
            aria-controls={`${formId}-version-details`}
            onClick={() => setVersionDetailsOpen(!versionDetailsOpen)}
          >
            <span>
              Version details <span className="font-medium text-muted">(optional)</span>
            </span>
            {versionDetailsOpen ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </button>
          {versionDetailsOpen && (
            <div id={`${formId}-version-details`}>
              <label className="mt-3">
                Version name
                <input
                  className="field-input"
                  value={name}
                  maxLength={80}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. More lemon"
                />
              </label>
              <label>
                Change summary
                <textarea
                  className="min-h-20"
                  value={changed}
                  onChange={(event) => setChanged(event.target.value)}
                  placeholder="What changed in this version?"
                />
              </label>
            </div>
          )}
        </section>
      </form>
      <BottomBar>
        <Button type="submit" form={formId}>
          Save changes
        </Button>
        <p className="mt-1.5 text-center text-[11px]">Creates a new version</p>
      </BottomBar>
    </>
  );
}
