import { type ReactNode, useId } from 'react';
import { BelowHeader } from '@/web/components/ui/Header';

type PageTabsProps = {
  label: string;
  items: string[];
  value: string;
  set: (value: string) => void;
  children: ReactNode;
};

export function PageTabs({ label, items, value, set, children }: PageTabsProps) {
  const id = useId();
  const selected = Math.max(0, items.indexOf(value));
  return (
    <>
      <BelowHeader>
        <div
          role="tablist"
          aria-label={label}
          className="page-tabs flex h-control border-b border-rule bg-card px-5"
        >
          {items.map((item, index) => (
            <button
              key={item}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel`}
              aria-selected={index === selected}
              tabIndex={index === selected ? 0 : -1}
              className={`relative min-w-0 flex-1 px-3 text-[13px] focus-visible:outline-offset-[-3px] ${
                index === selected
                  ? 'font-extrabold text-green after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-green'
                  : 'font-semibold text-muted hover:text-ink'
              }`}
              onClick={() => {
                if (value !== item) set(item);
              }}
              onKeyDown={(event) => {
                if (event.altKey || event.ctrlKey || event.metaKey) return;
                let next: number;
                if (event.key === 'ArrowRight') next = (index + 1) % items.length;
                else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = items.length - 1;
                else return;
                event.preventDefault();
                event.currentTarget.parentElement
                  ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                  [next]?.focus();
                if (value !== items[next]) set(items[next]);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </BelowHeader>
      <section
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users need to focus the active tab panel before its content.
        tabIndex={0}
        className="focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
      >
        {children}
      </section>
    </>
  );
}
