import { useState } from 'react';
import { Icon } from '@/web/components/ui/Icon';
import { Photo } from '@/web/components/ui/Photo';
import { formatDate } from '@/web/lib/format';
import type { MealLogEntry } from '@/web/types/domain';

type HistoryProps = {
  log: MealLogEntry[];
  openAttempt: (id: string) => void;
};

export function History({ log, openAttempt }: HistoryProps) {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState('');
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const date = (day: number) => formatDate(new Date(month.getFullYear(), month.getMonth(), day));
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(month.getDay()).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)];
  const meals = (
    selected
      ? log.filter((item) => item.date === selected)
      : [...log].sort((a, b) => b.date.localeCompare(a.date))
  ).slice(0, selected ? undefined : 5);
  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="grid h-control w-control place-items-center rounded-control bg-dark text-[24px]"
          onClick={() => {
            setOffset(offset - 1);
            setSelected('');
          }}
        >
          <Icon name="back" />
        </button>
        <h2 className="text-[17px]">
          {month.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          type="button"
          aria-label="Next month"
          disabled={offset >= 0}
          className="grid h-control w-control place-items-center rounded-control bg-dark text-[24px] disabled:opacity-30"
          onClick={() => {
            setOffset(offset + 1);
            setSelected('');
          }}
        >
          <Icon name="forward" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-[12px] text-muted">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <span key={day}>{day[0]}</span>
        ))}
      </div>
      <div className="heatmap mt-2 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          const count = day ? log.filter((item) => item.date === date(day)).length : 0;
          return day ? (
            <button
              type="button"
              key={date(day)}
              aria-label={`${date(day)}, ${count} meals`}
              aria-pressed={selected === date(day)}
              className={`aspect-square min-w-0 rounded-control-inner text-[12px] ${
                selected === date(day)
                  ? 'bg-green text-white'
                  : count
                    ? 'bg-dark font-extrabold text-green'
                    : 'text-muted'
              }`}
              onClick={() => setSelected(selected === date(day) ? '' : date(day))}
            >
              {day}
              {count > 0 && <span className="mx-auto mt-0.5 block h-1 w-1 rounded-full bg-current" />}
            </button>
          ) : (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: these blank cells represent fixed leading weekday positions.
              key={index}
            />
          );
        })}
      </div>
      <p className="mt-3 text-right text-[12px]">A dot marks a day you cooked.</p>
      <div className="section-heading">
        <h2>
          {selected
            ? new Date(`${selected}T00:00:00`).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'Recent meals'}
        </h2>
        {selected && (
          <button type="button" className="text-action" onClick={() => setSelected('')}>
            Show recent
          </button>
        )}
      </div>
      {meals.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-label={`View cooking attempt: ${item.title}, ${item.date}`}
          className="mb-4 flex w-full items-center gap-3 rounded-control text-left"
          onClick={() => openAttempt(item.id)}
        >
          <Photo name={item.title} src={item.photo} className="h-20 w-20 min-h-0 shrink-0" />
          <span>
            <b className="block">{item.title}</b>
            <span className="text-[12px] text-muted">{item.date}</span>
          </span>
        </button>
      ))}
      {!meals.length && (
        <p className="notice">
          No meals logged{selected ? ' on this day' : ' yet'}. Log your next attempt to start your cooking
          history.
        </p>
      )}
    </>
  );
}
