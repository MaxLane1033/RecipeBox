import { ChevronLeft, type LucideIcon } from 'lucide-react';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

type HeaderAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

type HeaderProps = {
  title: string;
  divider?: boolean;
  back?: () => void;
  leadingAction?: HeaderAction;
  trailingAction?: HeaderAction;
  trailingActions?: HeaderAction[];
};

const HeaderOutlet = createContext<HTMLElement | null | undefined>(undefined);
const BelowHeaderOutlet = createContext<HTMLElement | null | undefined>(undefined);

/** Keeps page-owned titles and callbacks in the shell, outside scrolling content. */
export function HeaderHost({ children }: { children: ReactNode }) {
  const [outlet, setOutlet] = useState<HTMLDivElement | null>(null);
  const [below, setBelow] = useState<HTMLDivElement | null>(null);
  return (
    <HeaderOutlet value={outlet}>
      <BelowHeaderOutlet value={below}>
        <div ref={setOutlet} className="shrink-0" />
        <div ref={setBelow} className="shrink-0" />
        {children}
      </BelowHeaderOutlet>
    </HeaderOutlet>
  );
}

/** Places page-owned navigation immediately below the shared header. */
export function BelowHeader({ children }: { children: ReactNode }) {
  const outlet = useContext(BelowHeaderOutlet);
  if (outlet === undefined) return children;
  return outlet ? createPortal(children, outlet) : null;
}

function Action({ action, side }: { action?: HeaderAction; side: 'start' | 'end' }) {
  if (!action) return <span />;
  const ActionIcon = action.icon;
  return (
    <button
      type="button"
      aria-label={action.label}
      title={action.label}
      className={`relative grid h-6 w-6 bg-transparent p-0 text-green hover:text-green-dark active:opacity-75 focus-visible:outline-green ${
        side === 'start' ? 'justify-self-start' : 'justify-self-end'
      }`}
      onClick={action.onClick}
    >
      <ActionIcon size={20} aria-hidden="true" />
    </button>
  );
}

export function Header({
  title,
  divider = true,
  back,
  leadingAction,
  trailingAction,
  trailingActions,
}: HeaderProps) {
  const outlet = useContext(HeaderOutlet);
  const actions = trailingActions ?? (trailingAction ? [trailingAction] : []);
  const header = (
    <header
      className={`header global-header grid h-14 shrink-0 ${
        actions.length > 1 ? 'grid-cols-[60px_minmax(0,1fr)_60px]' : 'grid-cols-[24px_minmax(0,1fr)_24px]'
      } items-center justify-items-center gap-3 bg-card px-5 text-ink ${
        divider ? 'border-b border-rule' : ''
      }`}
    >
      <Action
        side="start"
        action={back ? { label: 'Back', icon: ChevronLeft, onClick: back } : leadingAction}
      />
      <h1 className="w-full truncate text-center text-[20px] tracking-[-.04em]" title={title}>
        {title}
      </h1>
      <div className="flex items-center justify-self-end gap-3">
        {actions.map((action) => (
          <Action key={action.label} side="end" action={action} />
        ))}
      </div>
    </header>
  );
  if (outlet === undefined) return header;
  return outlet ? createPortal(header, outlet) : null;
}
