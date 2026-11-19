import { Icon } from '@/web/components/ui/Icon';
import { Photo } from '@/web/components/ui/Photo';

export function CookbookCover({ recipes }: { recipes: string[] }) {
  const covers = recipes.slice(0, 4);
  return (
    <div
      aria-hidden="true"
      className={`cookbook-cover grid aspect-square overflow-hidden rounded-2xl bg-dark gap-0.5 [&_.photo]:min-h-0 [&_.photo]:rounded-none ${
        covers.length > 2 ? 'grid-cols-2' : 'grid-cols-1'
      } ${covers.length > 1 ? 'grid-rows-2' : 'grid-rows-1'}`}
    >
      {covers.length ? (
        covers.map((name, index) => (
          <Photo key={name} name={name} className={covers.length === 3 && index === 0 ? 'col-span-2' : ''} />
        ))
      ) : (
        <span className="grid place-items-center text-green">
          <Icon name="book" size={32} />
        </span>
      )}
    </div>
  );
}
