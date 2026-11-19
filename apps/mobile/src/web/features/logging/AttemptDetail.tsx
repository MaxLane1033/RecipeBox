import { Globe, LockKeyhole } from 'lucide-react';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Photo } from '@/web/components/ui/Photo';
import { Reflection } from '@/web/components/ui/Reflection';
import { cookingDate } from '@/web/features/logging/AttemptRow';
import type { MealLogEntry, PostData } from '@/web/types/domain';

type AttemptDetailProps = {
  attempt: MealLogEntry;
  post?: PostData;
  back: () => void;
  openRecipe?: () => void;
  openVersion?: () => void;
};

export function AttemptDetail({ attempt, post, back, openRecipe, openVersion }: AttemptDetailProps) {
  const title = post?.title || attempt.title;
  const photo = post?.photo || attempt.photo;
  const note = post?.note ?? attempt.note;
  const stats = post?.stats ?? attempt.stats ?? [];
  const versionName = post?.versionName || attempt.versionName;
  const visibility = post?.visibility ?? attempt.visibility;
  const VisibilityIcon = visibility === 'private' ? LockKeyhole : Globe;

  return (
    <>
      <Header title="Cooking attempt" back={back} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <time dateTime={attempt.date} className="text-[13px] font-semibold text-muted">
          {cookingDate(attempt.date)}
        </time>
        {visibility && (
          <span className="inline-flex items-center gap-1.5 rounded-control bg-dark px-2 py-1 text-[11px] font-semibold text-green">
            <VisibilityIcon size={12} aria-hidden="true" />
            {visibility === 'private' ? 'Private · only you' : 'Public'}
          </span>
        )}
      </div>
      <h2 className="mt-3 break-words text-[25px]">{title}</h2>
      {photo && <Photo name={title} src={photo} className="mt-4 h-56" />}
      <section className="mt-5" aria-labelledby="attempt-note-title">
        <h3 id="attempt-note-title" className="text-[14px]">
          Your note
        </h3>
        {note?.trim() ? (
          <p className="mt-2 whitespace-pre-wrap break-words text-[14px] text-ink">{note}</p>
        ) : (
          <p className="mt-2 text-[13px]">No note added for this attempt.</p>
        )}
      </section>
      <Reflection reflection={post?.reflection} />
      {stats.length > 0 && (
        <section className="mt-5" aria-labelledby="attempt-stats-title">
          <h3 id="attempt-stats-title" className="text-[14px]">
            Recorded stats
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {stats.map((stat, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: recorded stats are an immutable snapshot and may contain duplicate text.
                key={`${stat}-${index}`}
                className="rounded-control bg-dark px-3 py-1.5 text-[12px] font-semibold text-green"
              >
                {stat}
              </li>
            ))}
          </ul>
        </section>
      )}
      {(openRecipe || openVersion || versionName) && (
        <section className="mt-6 border-t border-rule pt-4" aria-labelledby="attempt-recipe-title">
          <h3 id="attempt-recipe-title" className="text-[14px]">
            Recipe used
          </h3>
          {versionName && <p className="mt-1 text-[13px]">{versionName}</p>}
          <div className={`mt-3 grid gap-3 ${openRecipe && openVersion ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {openVersion && (
              <Button secondary onClick={openVersion}>
                View this version
              </Button>
            )}
            {openRecipe && (
              <Button secondary onClick={openRecipe}>
                View recipe
              </Button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
