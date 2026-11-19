import { createContext, type ReactNode, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const BottomBarOutlet = createContext<HTMLElement | null | undefined>(undefined);

export function BottomBarHost({ children }: { children: ReactNode }) {
  const [outlet, setOutlet] = useState<HTMLDivElement | null>(null);
  return (
    <BottomBarOutlet value={outlet}>
      {children}
      <div ref={setOutlet} className="shrink-0" />
    </BottomBarOutlet>
  );
}

/** Keeps a page's primary action below its scrolling content. */
export function BottomBar({ children }: { children: ReactNode }) {
  const outlet = useContext(BottomBarOutlet);
  const bar = (
    <div className="border-t border-rule bg-card px-5 pt-3 pb-[calc(12px_+_env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
  if (outlet === undefined) return bar;
  return outlet ? createPortal(bar, outlet) : null;
}
