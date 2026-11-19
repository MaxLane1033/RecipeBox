import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { ScanResults } from '@/web/features/explore/ScanResults';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  return <ScanResults back={back} openRecipe={model.openRecipe} />;
}
