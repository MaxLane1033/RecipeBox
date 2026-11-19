import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ActionMenu } from '@/web/components/ui/ActionMenu';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import type { RecipeVersion } from '@/web/types/domain';

type VersionsProps = {
  back: () => void;
  recipeName: string;
  versions: RecipeVersion[];
  currentVersionId: string;
  detail: (id: string) => void;
  rename: (id: string, name: string) => void;
  restore: (id: string) => void;
  remove: (id: string) => void;
};

function savedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
}

type RenameDialogProps = {
  version: RecipeVersion;
  close: () => void;
  save: (name: string) => void;
};

function RenameDialog({ version, close, save }: RenameDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(version.name);
  useEffect(() => {
    dialog.current?.showModal();
    input.current?.focus();
    input.current?.select();
    return () => dialog.current?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="rename-version-title"
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_32px)] max-w-[400px] overflow-y-auto rounded-2xl bg-white p-5 text-ink shadow-xl backdrop:bg-ink/40"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="rename-version-title" className="text-[20px]">
          Rename version
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="grid h-control w-control shrink-0 place-items-center rounded-control text-green hover:bg-dark"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) save(name.trim());
        }}
      >
        <label>
          Version name
          <input
            ref={input}
            autoFocus
            className="field-input"
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button secondary onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Save name
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export function Versions({
  back,
  recipeName,
  versions,
  currentVersionId,
  detail,
  rename,
  restore,
  remove,
}: VersionsProps) {
  const [renaming, setRenaming] = useState<RecipeVersion | null>(null);
  const [status, setStatus] = useState('');
  const statusMessage = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (status) statusMessage.current?.focus();
  }, [status]);
  const ordered = [...versions]
    .filter((version) => !version.removed)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <>
      <Header title="Versions" back={back} />
      <h1 className="break-words text-[24px]">{recipeName}</h1>
      <p className="mt-2 text-[13px]">Saved recipes you can return to and cook again.</p>
      {status && (
        <p
          ref={statusMessage}
          role="status"
          tabIndex={-1}
          className="notice mt-4 focus-visible:outline-2 focus-visible:outline-green"
        >
          {status}
        </p>
      )}
      <ul className="mt-4">
        {ordered.map((version) => {
          const current = version.id === currentVersionId;
          const original = version.parentId === null;
          return (
            <li key={version.id} className="flex items-start gap-2 border-b border-rule py-4">
              <button
                type="button"
                onClick={() => detail(version.id)}
                className="min-w-0 flex-1 rounded-control text-left hover:text-green"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <b className="min-w-0 max-w-full break-words text-[15px]">{version.name}</b>
                  {current && (
                    <span className="rounded-control-inner bg-dark px-2 py-0.5 text-[10px] font-bold text-green">
                      Current
                    </span>
                  )}
                  {original && version.name !== 'Original' && (
                    <span className="text-[11px] text-muted">Original</span>
                  )}
                </span>
                <time dateTime={version.createdAt} className="mt-1 block text-[12px] text-muted">
                  {savedDate(version.createdAt)}
                </time>
                {version.changed && (
                  <span className="mt-2 line-clamp-2 block break-words text-[13px] text-muted">
                    {version.changed}
                  </span>
                )}
              </button>
              <ActionMenu
                label={`Actions for ${version.name}`}
                items={[
                  {
                    label: 'Rename',
                    onSelect: () => {
                      setStatus('');
                      setRenaming(version);
                    },
                  },
                  {
                    label: 'Restore',
                    disabled: current,
                    disabledReason: current ? 'This is already the current version' : undefined,
                    onSelect: () => {
                      restore(version.id);
                      setStatus(`${version.name} restored as a new current version.`);
                    },
                  },
                  {
                    label: 'Remove',
                    destructive: true,
                    disabled: original,
                    disabledReason: original
                      ? 'The original recipe is kept as your starting point'
                      : undefined,
                    onSelect: () => {
                      remove(version.id);
                      setStatus('Version removed. Past cooking logs are preserved.');
                    },
                  },
                ]}
              />
            </li>
          );
        })}
      </ul>
      {ordered.length <= 1 && (
        <p className="mt-5 text-[13px]">
          Edit the recipe to save a new version. Your original stays here as a starting point.
        </p>
      )}
      {renaming && (
        <RenameDialog
          key={renaming.id}
          version={renaming}
          close={() => setRenaming(null)}
          save={(name) => {
            rename(renaming.id, name);
            setRenaming(null);
            setStatus('Version renamed.');
          }}
        />
      )}
    </>
  );
}
