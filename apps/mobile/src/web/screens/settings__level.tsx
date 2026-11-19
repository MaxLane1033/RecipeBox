import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { CookingLevel } from '@/web/features/settings/CookingLevel';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  return <CookingLevel back={back} level={model.level} setLevel={model.changeLevel} />;
}
