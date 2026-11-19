import { Icon } from '@/web/components/ui/Icon';
import type { ProfileConnection } from '@/web/features/profile/hooks/useProfile';

type ProfileConnectionsProps = {
  title: 'Followers' | 'Following';
  people: ProfileConnection[];
  close: () => void;
};

export function ProfileConnections({ title, people, close }: ProfileConnectionsProps) {
  return (
    <section className="mt-5 rounded-xl border border-rule bg-card p-4" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-[17px]">{title}</h2>
        <button
          type="button"
          aria-label={`Close ${title.toLowerCase()}`}
          className="grid h-control w-control place-items-center rounded-control text-muted"
          onClick={close}
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      {people.length ? (
        <ul>
          {people.map((person) => (
            <li key={person.id} className="flex items-center gap-3 border-t border-rule py-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-dark font-bold text-green"
                aria-hidden="true"
              >
                {person.name[0]}
              </span>
              <div>
                <b className="block text-[14px]">{person.name}</b>
                {person.sample && <span className="text-[12px] text-muted">Sample cook</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-3 text-[13px]">People who follow you will appear here.</p>
      )}
    </section>
  );
}
