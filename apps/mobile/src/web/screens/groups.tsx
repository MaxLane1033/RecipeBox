import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { PageTabs } from '@/web/components/ui/PageTabs';
import { ChallengeList } from '@/web/features/challenges/ChallengeList';
import { CommunityDirectory } from '@/web/features/communities/CommunityDirectory';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

type GroupsSearch = {
  tab?: 'challenges';
  q?: string;
  // Legacy links still open the unified directory.
  view?: 'browse';
};
const validateSearch = (search: Record<string, unknown>): GroupsSearch => ({
  q: typeof search.q === 'string' ? search.q : undefined,
  tab: search.tab === 'challenges' ? 'challenges' : undefined,
  view: search.view === 'browse' ? 'browse' : undefined,
});

export default function GroupsPage() {
  const model = useRecipeBoxModel();
  const { tab, q = '' } = validateSearch(useRouteValues());
  const navigate = useAppNavigate();
  return (
    <PageTabs
      label="Groups sections"
      items={['Communities', 'Challenges']}
      value={tab === 'challenges' ? 'Challenges' : 'Communities'}
      set={(value) =>
        void navigate({
          search: { tab: value === 'Challenges' ? 'challenges' : undefined },
        })
      }
    >
      {tab === 'challenges' ? (
        <ChallengeList
          challenges={model.challenges.challenges}
          openChallenge={model.openChallenge}
          go={model.navigation.go}
        />
      ) : (
        <CommunityDirectory
          query={q}
          setQuery={(query) => void navigate({ search: { q: query || undefined }, replace: true })}
          createCommunity={() => model.navigation.go('createCommunity')}
          comms={model.communities.communities}
          setStatus={model.communities.setStatus}
          openCommunity={model.openCommunity}
        />
      )}
    </PageTabs>
  );
}
