import { useState } from 'react';
import { Icon } from '@/web/components/ui/Icon';
import { Photo } from '@/web/components/ui/Photo';
import type { ReflectionData } from '@/web/components/ui/Reflection';
import { Reflection } from '@/web/components/ui/Reflection';

type PostProps = {
  name: string;
  title: string;
  fresh?: boolean;
  stats?: string[];
  note?: string;
  reflection?: ReflectionData;
  openAttempt?: () => void;
  openRecipe?: (name?: string) => void;
  photo?: string;
};
export function Post({
  name,
  title,
  fresh = false,
  stats,
  note,
  photo,
  reflection,
  openRecipe,
  openAttempt,
}: PostProps) {
  const [sent, setSent] = useState(false);
  const chips = stats || ['28 min', 'Easy', 'Cooked 3x'];
  const text = note ?? (name === 'Jo' ? 'Extra crispy at 450°!' : '');
  return (
    <article className="post mb-6 overflow-hidden rounded-2xl bg-white border border-rule">
      <div className="flex items-center gap-3 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-dark font-extrabold text-green">
          {name[0]}
        </div>
        <div className="min-w-0">
          <b className="block break-words text-[14px]">{name}</b>
          <span className="text-[12px] text-muted">{fresh ? 'Just cooked' : 'Cooked 2 hours ago'}</span>
        </div>
      </div>
      <div className="relative">
        <Photo className="post-photo h-[230px] rounded-none" name={title} src={photo} />
        {!photo && (
          <span className="absolute right-3 bottom-3 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-muted">
            Recipe photo
          </span>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-[21px]">
          {openRecipe ? (
            <button
              type="button"
              className="min-h-control text-left hover:text-green"
              onClick={() => openRecipe(title)}
            >
              {title}
              <span className="ml-2 inline-flex text-green" aria-hidden="true">
                <Icon name="arrow" size={18} />
              </span>
            </button>
          ) : (
            title
          )}
        </h2>
        {text && <p className="mt-2 whitespace-pre-wrap break-words text-[14px]">{text}</p>}
        <Reflection reflection={reflection} />
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold text-muted">
          {chips.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-rule pt-3">
          <button
            type="button"
            aria-pressed={sent}
            className={`inline-flex min-h-control items-center gap-1 rounded-control px-4 text-[12px] font-bold ${
              sent ? 'bg-butter text-ink' : 'bg-dark text-green hover:bg-butter'
            }`}
            onClick={() => setSent(!sent)}
          >
            {sent && <Icon name="check" size={14} />}
            {sent ? 'Encouragement sent' : 'Great work'}
            {!fresh && ` · ${12 + (sent ? 1 : 0)}`}
          </button>
          {openAttempt ? (
            <button type="button" className="text-action" onClick={openAttempt}>
              View attempt
            </button>
          ) : (
            openRecipe && (
              <button type="button" className="text-action" onClick={() => openRecipe(title)}>
                View recipe
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
}
