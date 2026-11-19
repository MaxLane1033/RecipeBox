import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { ImportRecipe } from '@/web/features/cookbooks/ImportRecipe';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation, cookbooks } = model;
  const { back } = navigation;
  return <ImportRecipe back={back} books={cookbooks.books} saveRecipe={cookbooks.saveRecipe} />;
}
