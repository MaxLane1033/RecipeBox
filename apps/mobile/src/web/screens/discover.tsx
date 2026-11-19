import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { PageTabs } from '@/web/components/ui/PageTabs';
import { RecipeSearch } from '@/web/features/explore/RecipeSearch';
import { Learn } from '@/web/features/learning/Learn';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

type DiscoverSearch = {
  tab?: 'learn';
};
const validateSearch = (search: Record<string, unknown>): DiscoverSearch => ({
  tab: search.tab === 'learn' ? 'learn' : undefined,
});

export default function DiscoverPage() {
  const model = useRecipeBoxModel();
  const { tab } = validateSearch(useRouteValues());
  const navigate = useAppNavigate();
  return (
    <PageTabs
      label="Discover sections"
      items={['Recipes', 'Learn']}
      value={tab === 'learn' ? 'Learn' : 'Recipes'}
      set={(value) =>
        void navigate({
          search: { tab: value === 'Learn' ? 'learn' : undefined },
        })
      }
    >
      {tab === 'learn' ? (
        <Learn
          openTech={model.openTechnique}
          openCourse={model.openCourse}
          courseDone={model.learning.courseProgress}
        />
      ) : (
        <RecipeSearch
          openRecipe={model.openRecipe}
          go={model.navigation.go}
          level={model.level}
          filters={model.filters}
        />
      )}
    </PageTabs>
  );
}
