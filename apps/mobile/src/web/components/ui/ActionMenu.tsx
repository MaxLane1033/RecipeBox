import { Ellipsis } from 'lucide-react';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

type ActionMenuItem = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  destructive?: boolean;
  disabledReason?: string;
};

type ActionMenuProps = {
  label: string;
  items: ActionMenuItem[];
};

export function ActionMenu({ label, items }: ActionMenuProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [initialFocus, setInitialFocus] = useState<'first' | 'last'>('first');

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  };
  const expand = (focus: 'first' | 'last' = 'first') => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(192, window.innerWidth - 24);
    const height = items.length * 40 + 8;
    setPosition({
      left: Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12)),
      top:
        rect.bottom + height + 8 > window.innerHeight ? Math.max(12, rect.top - height - 4) : rect.bottom + 4,
    });
    setInitialFocus(focus);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const buttons = menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    if (buttons?.length) buttons[initialFocus === 'last' ? buttons.length - 1 : 0].focus();
    const dismissOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const dismissScroll = (event: Event) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismissOutside);
    window.addEventListener('scroll', dismissScroll, true);
    window.addEventListener('resize', dismissScroll);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      window.removeEventListener('scroll', dismissScroll, true);
      window.removeEventListener('resize', dismissScroll);
    };
  }, [open, initialFocus]);

  const handleMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === 'Tab') {
      close(true);
      return;
    }
    const buttons = Array.from(
      menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
    );
    if (!buttons.length) return;
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next].focus();
  };

  return (
    <div ref={root} className="shrink-0">
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className="grid h-control w-control place-items-center rounded-control text-green hover:bg-dark"
        onBlur={(event) => {
          if (!root.current?.contains(event.relatedTarget)) setOpen(false);
        }}
        onClick={() => (open ? close() : expand())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            expand(event.key === 'ArrowUp' ? 'last' : 'first');
          }
        }}
      >
        <Ellipsis size={20} aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={menu}
          id={id}
          role="menu"
          aria-label={label}
          style={position}
          className="fixed z-50 w-48 max-w-[calc(100vw_-_24px)] rounded-control border border-rule bg-white p-1 shadow-sm"
          onBlur={(event) => {
            if (!root.current?.contains(event.relatedTarget)) setOpen(false);
          }}
          onKeyDown={handleMenuKey}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              title={item.disabledReason}
              className={`flex min-h-control w-full items-center rounded-control-inner px-3 text-left text-[13px] font-semibold hover:bg-dark focus-visible:bg-dark disabled:opacity-40 ${
                item.destructive ? 'text-danger' : 'text-ink'
              }`}
              onClick={() => {
                close(true);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
