import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { Filters } from '@/web/features/explore/Filters';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  return <Filters back={back} filters={model.filters} setFilters={model.setFilters} level={model.level} />;
}
