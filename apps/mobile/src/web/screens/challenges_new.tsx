import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { CreateChallenge } from '@/web/features/challenges/CreateChallenge';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  return <CreateChallenge back={back} onCreate={model.createChallenge} />;
}
