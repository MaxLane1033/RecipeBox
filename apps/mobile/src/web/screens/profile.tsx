import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { Profile } from '@/web/features/profile/Profile';
import { ProfilePosts } from '@/web/features/profile/ProfilePosts';
import { Progress } from '@/web/features/progress/Progress';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

type ProfileSearch = {
  tab?: 'history' | 'goals' | 'posts';
};
const validateSearch = (search: Record<string, unknown>): ProfileSearch => ({
  tab: search.tab === 'history' || search.tab === 'goals' || search.tab === 'posts' ? search.tab : undefined,
});

export default function ProfilePage() {
  const model = useRecipeBoxModel();
  const { tab } = validateSearch(useRouteValues());
  const navigate = useAppNavigate();
  const section =
    tab === 'history' ? 'History' : tab === 'goals' ? 'Goals' : tab === 'posts' ? 'Posts' : 'Insights';
  return (
    <Profile
      identity={model.profile.identity}
      update={model.profile.update}
      meals={model.journal.log.length}
      followers={model.profile.followers}
      following={model.profile.following}
      tab={section}
      setTab={(value) =>
        void navigate({
          search: {
            tab:
              value === 'History'
                ? 'history'
                : value === 'Goals'
                  ? 'goals'
                  : value === 'Posts'
                    ? 'posts'
                    : undefined,
          },
        })
      }
    >
      {section === 'Posts' ? (
        <ProfilePosts
          name={model.profile.identity.name}
          posts={model.journal.posts}
          openRecipe={model.openMyRecipe}
          openAttempt={(id) =>
            void navigate({
              to: '/attempts/$attemptId',
              params: { attemptId: id },
            })
          }
          logMeal={() => model.navigation.go('log')}
        />
      ) : (
        <Progress
          log={model.journal.log}
          goals={model.journal.goals}
          setGoals={model.journal.setGoals}
          section={section}
          go={model.navigation.go}
          openAttempt={(id) =>
            void navigate({
              to: '/attempts/$attemptId',
              params: { attemptId: id },
            })
          }
        />
      )}
    </Profile>
  );
}
