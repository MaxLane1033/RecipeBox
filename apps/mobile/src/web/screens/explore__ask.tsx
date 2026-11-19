import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { AskRecipeBox } from '@/web/features/explore/AskRecipeBox';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  return <AskRecipeBox back={back} openRecipe={model.openRecipe} />;
}
