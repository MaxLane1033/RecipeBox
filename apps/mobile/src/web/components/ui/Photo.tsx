import { useState } from 'react';
import { Icon } from '@/web/components/ui/Icon';
import { RECIPE_PHOTOS } from '@/web/data/recipes';

type PhotoProps = {
  className?: string;
  name?: string;
  src?: string;
};
export function Photo({ className = '', name = 'Garlic butter pasta', src }: PhotoProps) {
  const source = src || RECIPE_PHOTOS[name];
  const [failed, setFailed] = useState('');
  return (
    <div className={`photo relative min-h-[100px] overflow-hidden rounded-xl bg-dark ${className}`}>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-green"
        role="img"
        aria-label={`${name} photo unavailable`}
        aria-hidden={!!source && failed !== source}
      >
        <Icon name="book" size={20} />
        {failed === source && <span className="text-[12px]">Photo unavailable</span>}
      </div>
      {source && failed !== source && (
        <img
          className="absolute inset-0 block h-full w-full object-cover"
          src={source}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(source)}
        />
      )}
    </div>
  );
}
