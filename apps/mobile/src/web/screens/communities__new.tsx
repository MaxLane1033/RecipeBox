import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { CreateCommunity } from '@/web/features/communities/CreateCommunity';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  return <CreateCommunity back={back} onCreate={model.createCommunity} />;
}
