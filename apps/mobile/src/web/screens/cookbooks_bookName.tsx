import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { CookbookDetail } from '@/web/features/cookbooks/CookbookDetail';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation, cookbooks } = model;
  const { go, back } = navigation;
  const selected = cookbooks.books.find((book) => book.name === model.bookName);
  if (!selected) return <RouteNotFound title="Cookbook not found" />;
  return <CookbookDetail back={back} book={selected} openRecipe={model.openMyRecipe} go={go} />;
}
