import { Check, ChevronDown } from 'lucide-react';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id?: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
};

export function Select({
  id: suppliedId,
  label,
  options,
  value,
  onChange,
  autoFocus,
  disabled,
}: SelectProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const search = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const unavailable = disabled || options.length === 0;

  useEffect(() => {
    if (autoFocus && !unavailable) trigger.current?.focus();
  }, [autoFocus, unavailable]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const expand = () => {
    if (unavailable) return;
    search.current = { text: '', time: 0 };
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  };
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (unavailable) return;
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) expand();
      else
        setActive((index) =>
          Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))),
        );
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setOpen(true);
      setActive(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) choose(active);
      else expand();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = (now - search.current.time < 700 ? search.current.text : '') + event.key;
      search.current = { text, time: now };
      const query = (/^(.)\1*$/.test(text) ? text[0] : text).toLocaleLowerCase();
      const start = open ? active : selectedIndex;
      for (let offset = 1; offset <= options.length; offset++) {
        const index = (Math.max(0, start) + offset) % options.length;
        if (options[index].label.toLocaleLowerCase().startsWith(query)) {
          setActive(index);
          if (!open) onChange(options[index].value);
          break;
        }
      }
    }
  };

  return (
    <div ref={root}>
      {label && (
        <label id={`${id}-label`} htmlFor={id}>
          {label}
        </label>
      )}
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        aria-expanded={open}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        disabled={unavailable}
        className="mt-2 flex min-h-control w-full items-center gap-3 rounded-control border border-rule bg-white px-3 py-2 text-left text-[14px] font-medium disabled:opacity-40"
        onClick={() => (open ? setOpen(false) : expand())}
        onKeyDown={handleKey}
        onBlur={(event) => {
          if (!root.current?.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <span className="min-w-0 flex-1 break-words">
          {options[selectedIndex]?.label || 'Choose an option'}
        </span>
        <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-green" />
      </button>
      {open && (
        <div
          ref={list}
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={label ? `${id}-label` : id}
          className="mt-1 max-h-[min(240px,35dvh)] overflow-y-auto overscroll-contain rounded-control border border-rule bg-white p-1"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              tabIndex={-1}
              aria-selected={option.value === value}
              className={`flex min-h-control cursor-pointer items-center gap-3 rounded-control-inner px-2 py-2 text-[14px] ${
                index === active ? 'bg-dark text-ink' : 'text-ink'
              }`}
              onPointerMove={() => setActive(index)}
              onPointerDown={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  choose(index);
                }
              }}
              onClick={() => choose(index)}
            >
              <span className="min-w-0 flex-1 break-words">{option.label}</span>
              {option.value === value && (
                <Check size={16} aria-hidden="true" className="shrink-0 text-green" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
