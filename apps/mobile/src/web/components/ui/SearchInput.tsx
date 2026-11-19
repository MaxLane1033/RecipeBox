import { type RefObject, useRef } from 'react';
import { Icon } from '@/web/components/ui/Icon';

type SearchInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function SearchInput({ label, placeholder, value, onChange, inputRef }: SearchInputProps) {
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localRef;
  return (
    <search
      aria-label={label}
      className="search-input flex h-control min-w-0 items-center gap-2 rounded-control border border-rule bg-card px-3 text-muted focus-within:border-green"
    >
      <Icon name="search" size={18} />
      <input
        ref={ref}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="-mr-1 grid h-control-small w-control-small shrink-0 place-items-center rounded-control-inner text-green hover:bg-dark"
          onClick={() => {
            onChange('');
            ref.current?.focus();
          }}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </search>
  );
}
