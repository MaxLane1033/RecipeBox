import { type ReactNode, useState } from 'react';
import { Segments } from '@/web/components/ui/Segments';
import { EditProfile } from '@/web/features/profile/EditProfile';
import type { ProfileConnection, ProfileIdentity } from '@/web/features/profile/hooks/useProfile';
import { ProfileConnections } from '@/web/features/profile/ProfileConnections';

type ProfileProps = {
  identity: ProfileIdentity;
  update: (identity: ProfileIdentity) => Promise<void>;
  meals: number;
  followers: ProfileConnection[];
  following: ProfileConnection[];
  tab: string;
  setTab: (tab: string) => void;
  children: ReactNode;
};

export function Profile({
  identity,
  update,
  meals,
  followers,
  following,
  tab,
  setTab,
  children,
}: ProfileProps) {
  const [panel, setPanel] = useState<'edit' | 'followers' | 'following' | null>(null);
  const [status, setStatus] = useState('');
  const [shareFallback, setShareFallback] = useState(false);
  const initials = identity.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const shareText = [identity.name, `${meals} meals cooked on RecipeBox.`].filter(Boolean).join('\n');
  const openPanel = (next: typeof panel) => {
    setPanel(panel === next ? null : next);
    setStatus('');
    setShareFallback(false);
  };
  const shareProfile = async () => {
    setStatus('');
    setShareFallback(false);
    try {
      if (navigator.share)
        await navigator.share({
          title: `${identity.name} on RecipeBox`,
          text: shareText,
        });
      else {
        await navigator.clipboard.writeText(shareText);
        setStatus('Profile details copied.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareFallback(true);
      setStatus('Select and copy your profile details below.');
    }
  };
  return (
    <>
      <section aria-label="Your profile">
        <div className="profile-head flex items-start gap-3 pt-1 pb-4">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-dark text-[23px] font-extrabold text-green"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="flex min-h-20 min-w-0 flex-1 flex-col justify-between">
            <h1 className="break-words text-[24px]">{identity.name}</h1>
            <div className="profile-stats mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                className="min-h-control rounded-control-inner text-left"
                aria-label={`${meals} meals, view cooking history`}
                onClick={() => {
                  setPanel(null);
                  setTab('History');
                }}
              >
                <b className="block text-[18px] leading-tight tabular-nums">{meals}</b>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted">Meals</span>
              </button>
              <button
                type="button"
                className="min-h-control rounded-control-inner text-left"
                aria-label={`${followers.length} followers`}
                aria-expanded={panel === 'followers'}
                onClick={() => openPanel('followers')}
              >
                <b className="block text-[18px] leading-tight tabular-nums">{followers.length}</b>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted">Followers</span>
              </button>
              <button
                type="button"
                className="min-h-control rounded-control-inner text-left"
                aria-label={`${following.length} following`}
                aria-expanded={panel === 'following'}
                onClick={() => openPanel('following')}
              >
                <b className="block text-[18px] leading-tight tabular-nums">{following.length}</b>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted">Following</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="min-h-control rounded-control border border-rule bg-card px-3 text-[13px] font-bold hover:bg-dark"
            aria-expanded={panel === 'edit'}
            onClick={() => openPanel('edit')}
          >
            Edit profile
          </button>
          <button
            type="button"
            className="min-h-control rounded-control border border-rule bg-card px-3 text-[13px] font-bold hover:bg-dark"
            onClick={() => void shareProfile()}
          >
            Share profile
          </button>
        </div>
        {status && (
          <p className="mt-3 text-[12px]" role="status">
            {status}
          </p>
        )}
        {shareFallback && (
          <textarea
            aria-label="Copy profile details"
            readOnly
            value={shareText}
            onFocus={(event) => event.target.select()}
          />
        )}
        {panel === 'edit' && (
          <EditProfile
            identity={identity}
            save={async (next) => {
              await update(next);
              setPanel(null);
              setStatus('Profile updated.');
            }}
            cancel={() => setPanel(null)}
          />
        )}
        {(panel === 'followers' || panel === 'following') && (
          <ProfileConnections
            title={panel === 'followers' ? 'Followers' : 'Following'}
            people={panel === 'followers' ? followers : following}
            close={() => setPanel(null)}
          />
        )}
      </section>
      <div className="mt-5">
        <Segments
          label="Profile views"
          items={['Insights', 'History', 'Goals', 'Posts']}
          value={tab}
          set={(value) => {
            setPanel(null);
            setTab(value);
          }}
        />
      </div>
      {children}
    </>
  );
}
