import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { Settings } from '@/web/features/settings/Settings';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { go, back } = navigation;
  return <Settings back={back} go={go} level={model.level} />;
}
