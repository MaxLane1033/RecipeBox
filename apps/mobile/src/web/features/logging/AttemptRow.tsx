import { ChevronRight, Globe, LockKeyhole } from 'lucide-react';
import { Photo } from '@/web/components/ui/Photo';
import type { MealLogEntry } from '@/web/types/domain';

export function newestAttempts(attempts: MealLogEntry[]) {
  return attempts
    .map((attempt, index) => ({ attempt, index }))
    .sort((a, b) => b.attempt.date.localeCompare(a.attempt.date) || b.index - a.index)
    .map(({ attempt }) => attempt);
}

export function cookingDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

type AttemptRowProps = {
  attempt: MealLogEntry;
  open: () => void;
};

export function AttemptRow({ attempt, open }: AttemptRowProps) {
  const VisibilityIcon = attempt.visibility === 'private' ? LockKeyhole : Globe;
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`View cooking attempt from ${cookingDate(attempt.date)}${
        attempt.versionName ? `, ${attempt.versionName}` : ''
      }`}
      className="flex min-h-20 w-full items-center gap-3 rounded-control border-b border-rule py-3 text-left hover:bg-dark/50"
    >
      {attempt.photo && (
        <Photo
          name={attempt.title}
          src={attempt.photo}
          className="h-14 w-14 min-h-0 shrink-0 rounded-control"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <time dateTime={attempt.date} className="text-[13px] font-bold">
            {cookingDate(attempt.date)}
          </time>
          {attempt.visibility && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <VisibilityIcon size={12} aria-hidden="true" />
              {attempt.visibility === 'private' ? 'Private' : 'Public'}
            </span>
          )}
        </span>
        <span className="mt-1 block line-clamp-2 break-words text-[13px] leading-snug text-muted">
          {attempt.note?.trim() || 'No note added'}
        </span>
        {attempt.versionName && (
          <span className="mt-1 block truncate text-[11px] font-semibold text-green">
            {attempt.versionName}
          </span>
        )}
      </span>
      <ChevronRight size={16} className="shrink-0 text-green" aria-hidden="true" />
    </button>
  );
}
