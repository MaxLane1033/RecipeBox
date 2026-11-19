import { type FocusEvent, useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Icon } from '@/web/components/ui/Icon';
import type { Cookbook } from '@/web/types/domain';

type CookbookAddProps = {
  books: Cookbook[];
  addBook: (name: string) => void;
  newRecipe: () => void;
};

export function CookbookAdd({ books, addBook, newRecipe }: CookbookAddProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const duplicate = books.some((book) => book.name.toLowerCase() === name.trim().toLowerCase());
  const cancel = () => {
    setCreating(false);
    setName('');
    trigger.current?.focus();
  };
  const dismissOnBlur = (event: FocusEvent<HTMLButtonElement>) => {
    if (!dropdown.current?.contains(event.relatedTarget)) setOpen(false);
  };
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!dropdown.current?.contains(event.target as Node)) setOpen(false);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', dismissEscape);
    };
  }, [open]);
  return (
    <>
      <div ref={dropdown} className="relative">
        <button
          ref={trigger}
          type="button"
          aria-label="Add to Cookbook"
          aria-expanded={open}
          aria-controls={menuId}
          className="grid h-control w-control place-items-center rounded-control border border-rule bg-card text-green hover:bg-dark"
          onBlur={dismissOnBlur}
          onClick={() => setOpen(!open)}
        >
          <Icon name="plus" size={22} />
        </button>
        {open && (
          <fieldset
            id={menuId}
            aria-label="Add to Cookbook"
            className="absolute right-0 top-12 z-10 w-44 overflow-hidden rounded-control border border-rule bg-card py-1 [&_button]:min-h-control [&_button]:w-full [&_button]:px-4 [&_button]:text-left [&_button]:text-[13px] [&_button]:font-bold [&_button:hover]:bg-dark [&_button:focus-visible]:outline-offset-[-2px]"
          >
            <button
              // biome-ignore lint/a11y/noAutofocus: the dropdown opens only after the user activates its trigger.
              autoFocus
              type="button"
              onBlur={dismissOnBlur}
              onClick={() => {
                setOpen(false);
                setCreating(true);
              }}
            >
              New cookbook
            </button>
            <button type="button" onBlur={dismissOnBlur} onClick={newRecipe}>
              New recipe
            </button>
          </fieldset>
        )}
      </div>
      {creating && (
        <form
          aria-label="New cookbook"
          className="col-span-2 rounded-2xl bg-dark p-4"
          onKeyDown={(event) => {
            if (event.key === 'Escape') cancel();
          }}
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim() || duplicate) return;
            addBook(name.trim());
            cancel();
          }}
        >
          <label className="mt-0">
            Cookbook name
            <input
              // biome-ignore lint/a11y/noAutofocus: the user explicitly opens the new-cookbook form.
              autoFocus
              className="field-input"
              placeholder="e.g. Date night"
              value={name}
              maxLength={60}
              aria-invalid={duplicate || undefined}
              aria-describedby={duplicate ? `${menuId}-error` : undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          {duplicate && (
            <p id={`${menuId}-error`} role="alert" className="mt-2 text-[12px] text-danger">
              You already have a cookbook with this name.
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <Button secondary onClick={cancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || duplicate}>
              Create cookbook
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
