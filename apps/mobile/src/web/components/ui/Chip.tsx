import type { ReactNode } from 'react';

type ChipProps = {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};
export function Chip({ children, selected, onClick }: ChipProps) {
  const style = `chip inline-flex shrink-0 whitespace-nowrap min-h-control-small items-center justify-center rounded-control border px-2.5 py-1 text-[12px] font-semibold ${
    selected ? 'selected border-green bg-green text-white' : 'border-rule bg-white text-muted'
  }`;
  return onClick ? (
    <button type="button" className={style} aria-pressed={!!selected} onClick={onClick}>
      {children}
    </button>
  ) : (
    <span className={style}>{children}</span>
  );
}
