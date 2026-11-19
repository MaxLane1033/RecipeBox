import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/web/components/ui/Icon';
import { Photo } from '@/web/components/ui/Photo';
import { SearchInput } from '@/web/components/ui/SearchInput';
import { BrowseCommunities } from '@/web/features/communities/BrowseCommunities';
import type { CookingCommunity } from '@/web/types/domain';

type CommunityDirectoryProps = {
  comms: CookingCommunity[];
  query: string;
  setQuery: (query: string) => void;
  setStatus: (id: string, status: CookingCommunity['status']) => void;
  openCommunity: (id: string) => void;
  createCommunity: () => void;
};

export function CommunityDirectory({
  comms,
  query,
  setQuery,
  setStatus,
  openCommunity,
  createCommunity,
}: CommunityDirectoryProps) {
  const [notice, setNotice] = useState('');
  const focusAfterJoin = useRef<string | null>(null);
  const term = query.trim().toLowerCase();
  const joined = comms.filter((community) => community.status === 'joined');
  const suggestions = comms.filter((community) => community.status !== 'joined');
  const matches = comms.filter((community) =>
    `${community.name} ${community.blurb}`.toLowerCase().includes(term),
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: restore focus only after the joined-community DOM order has committed.
  useEffect(() => {
    if (!focusAfterJoin.current) return;
    document.getElementById(`community-${focusAfterJoin.current}`)?.focus();
    focusAfterJoin.current = null;
  }, [comms]);
  const changeStatus = (id: string, status: CookingCommunity['status']) => {
    const community = comms.find((item) => item.id === id);
    if (!community) return;
    focusAfterJoin.current = id;
    setStatus(id, status);
    setNotice(status === 'joined' ? `Joined ${community.name}.` : `Request sent to ${community.name}.`);
  };
  return (
    <>
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_40px] gap-2">
        <SearchInput
          label="Search communities"
          placeholder="Search communities"
          value={query}
          onChange={setQuery}
        />
        <button
          type="button"
          aria-label="Create community"
          title="Create community"
          className="grid h-control w-control place-items-center rounded-control border border-rule bg-card text-green hover:bg-dark"
          onClick={createCommunity}
        >
          <Icon name="plus" size={20} />
        </button>
      </div>
      <div className="sr-only" role="status">
        {term ? `${matches.length} communities found. ` : ''}
        {notice}
      </div>
      {term ? (
        <section aria-labelledby="community-results-title">
          <h2 id="community-results-title" className="text-[16px]">
            Search results
          </h2>
          <BrowseCommunities comms={matches} setStatus={changeStatus} openCommunity={openCommunity} />
          {!matches.length && (
            <p className="py-5 text-[13px]">No communities found. Try a name or cooking interest.</p>
          )}
        </section>
      ) : (
        <>
          {joined.length > 0 && (
            <section aria-labelledby="your-communities-title" className="mb-5">
              <h2 id="your-communities-title" className="mb-1 text-[16px]">
                Your communities
              </h2>
              <div>
                {joined.map((community) => (
                  <button
                    type="button"
                    key={community.id}
                    id={`community-${community.id}`}
                    aria-label={`Open ${community.name}`}
                    className="flex w-full items-center gap-4 border-b border-rule py-3 text-left hover:text-green"
                    onClick={() => openCommunity(community.id)}
                  >
                    <span aria-hidden="true" className="shrink-0 [&_.photo]:min-h-0">
                      <Photo name={community.cover} className="h-18 w-18" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block break-words text-[16px]">{community.name}</b>
                      <span className="mt-1 block text-[12px] text-muted">{community.members}</span>
                      <span className="mt-1 block break-words text-[12px] text-muted">{community.blurb}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {joined.length === 0 && suggestions.length > 0 && (
            <section aria-labelledby="suggested-communities-title">
              <h2 id="suggested-communities-title" className="text-[16px]">
                Suggested communities
              </h2>
              <BrowseCommunities comms={suggestions} setStatus={changeStatus} openCommunity={openCommunity} />
            </section>
          )}
          {!comms.length && (
            <p className="py-3 text-[13px]">No communities yet. Use + to create the first one.</p>
          )}
        </>
      )}
    </>
  );
}
