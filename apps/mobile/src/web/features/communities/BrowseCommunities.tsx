import { Photo } from '@/web/components/ui/Photo';
import type { CookingCommunity } from '@/web/types/domain';

type BrowseProps = {
  comms: CookingCommunity[];
  setStatus: (id: string, status: CookingCommunity['status']) => void;
  openCommunity: (id: string) => void;
};

export function BrowseCommunities({ comms, setStatus, openCommunity }: BrowseProps) {
  return (
    <div>
      {comms.map((community) => (
        <article
          key={community.id}
          className="browse-community flex items-start gap-3 border-b border-rule py-3"
        >
          <span aria-hidden="true" className="shrink-0 [&_.photo]:min-h-0">
            <Photo name={community.cover} className="h-12 w-12" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                id={`community-${community.id}`}
                className="min-h-control min-w-0 flex-1 rounded-control-inner text-left hover:text-green"
                onClick={() => openCommunity(community.id)}
              >
                <h3 className="break-words text-[14px]">{community.name}</h3>
                <span className="mt-0.5 block text-[11px] text-muted">{community.members}</span>
              </button>
              {community.status === 'none' ? (
                <button
                  type="button"
                  aria-label={`${community.priv ? 'Request to join' : 'Join'} ${community.name}`}
                  className="min-h-control shrink-0 rounded-control bg-green px-3 text-[12px] font-bold text-white hover:bg-green-dark"
                  onClick={() => setStatus(community.id, community.priv ? 'requested' : 'joined')}
                >
                  {community.priv ? 'Request to join' : 'Join'}
                </button>
              ) : (
                <span className="inline-flex min-h-control shrink-0 items-center rounded-control bg-dark px-3 text-[11px] font-bold text-green">
                  {community.status === 'joined' ? 'Joined' : 'Requested'}
                </span>
              )}
            </div>
            <p className="mt-1 text-[12px]">{community.blurb}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
