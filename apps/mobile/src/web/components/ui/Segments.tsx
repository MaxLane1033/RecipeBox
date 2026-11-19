type SegmentsProps = {
  label?: string;
  items: string[];
  value: string;
  set: (value: string) => void;
};
export function Segments({ items, value, set, label = 'View' }: SegmentsProps) {
  return (
    <fieldset
      className="segments mb-4 flex min-h-control-tabs gap-0.5 rounded-control bg-dark p-0.5"
      aria-label={label}
    >
      {items.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={value === item}
          className={`min-w-0 flex-1 rounded-control-inner px-1.5 py-1 text-[12px] font-bold ${
            value === item ? 'active bg-white text-green shadow-sm' : 'text-muted hover:text-ink'
          }`}
          onClick={() => set(item)}
        >
          {item}
        </button>
      ))}
    </fieldset>
  );
}
