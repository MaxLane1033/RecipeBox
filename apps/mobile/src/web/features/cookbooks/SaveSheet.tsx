import { useEffect, useRef, useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Icon } from '@/web/components/ui/Icon';
import { Select } from '@/web/components/ui/Select';
import type { Cookbook } from '@/web/types/domain';

type SaveSheetProps = {
  close: () => void;
  recipe: string;
  books: Cookbook[];
  onSave: (book: string, recipe: string) => void;
  onOpenRecipe?: () => void;
};
export function SaveSheet({ close, recipe, books, onSave, onOpenRecipe }: SaveSheetProps) {
  const [book, setBook] = useState(books[0]?.name || '+ New cookbook');
  const [saved, setSaved] = useState('');
  const [alreadyOwned] = useState(() => books.some((item) => item.recipes.includes(recipe)));
  const [name, setName] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const isNew = book === '+ New cookbook';
  const target = isNew ? name.trim() : book;
  useEffect(() => {
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLElement>('[role="combobox"]')?.focus();
  }, []);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: this handler only dismisses the backdrop; native dialog onCancel provides Escape dismissal.
    <dialog
      ref={dialog}
      aria-labelledby="save-title"
      className="fixed inset-0 m-auto w-[calc(100%_-_32px)] max-w-[440px] max-h-[85dvh] overflow-y-auto rounded-2xl bg-white p-6 text-ink shadow-xl backdrop:bg-ink/40"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) {
          const rect = dialog.current.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            close();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h1 id="save-title" className="text-[23px]">
          {alreadyOwned ? 'Add to cookbook' : onOpenRecipe ? 'Save to my recipes' : 'Save to cookbook'}
        </h1>
        <button
          type="button"
          aria-label="Close"
          className="-mt-2 grid h-control w-control shrink-0 place-items-center rounded-control bg-dark text-[24px]"
          onClick={close}
        >
          <Icon name="close" />
        </button>
      </div>
      <p className="mt-2 break-words">{recipe}</p>
      {saved ? (
        <div className="mt-5 space-y-4">
          <p role="status" className="notice">
            {onOpenRecipe
              ? `${alreadyOwned ? 'Added to' : 'Your copy is saved to'} ${saved}.`
              : `Saved to ${saved}. Find it in Cookbook.`}
          </p>
          <Button onClick={onOpenRecipe ?? close}>{onOpenRecipe ? 'Open my recipe' : 'Done'}</Button>
        </div>
      ) : (
        <>
          <Select
            label="Choose a cookbook"
            autoFocus
            value={book}
            onChange={setBook}
            options={[...books.map((b) => b.name), '+ New cookbook'].map((name) => ({
              value: name,
              label: name,
            }))}
          />
          {isNew && (
            <label>
              Cookbook name
              <input
                className="field-input"
                placeholder="e.g. Weeknight favorites"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <p className="my-5 text-[12px]">
            {onOpenRecipe
              ? alreadyOwned
                ? 'Add your recipe to another cookbook. Its versions and cooking history stay together.'
                : 'Save your own copy with its source credited. Your edits won’t change the original.'
              : 'Your cooking attempts and version history stay connected to the recipe.'}
          </p>
          <Button
            disabled={!target}
            onClick={() => {
              onSave(target, recipe);
              setSaved(target);
            }}
          >
            {alreadyOwned ? 'Add to cookbook' : onOpenRecipe ? 'Save my copy' : 'Save'}
          </Button>
        </>
      )}
    </dialog>
  );
}
