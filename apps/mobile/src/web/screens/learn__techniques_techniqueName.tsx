import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { TECHNIQUES } from '@/web/data/learning';
import { Technique } from '@/web/features/learning/Technique';
import { hasOwnKey } from '@/web/lib/records';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation, learning } = model;
  const { back } = navigation;
  if (!hasOwnKey(TECHNIQUES, model.techniqueName)) return <RouteNotFound title="Technique not found" />;
  return (
    <Technique
      back={back}
      name={model.techniqueName}
      done={learning.completedTechniques.includes(model.techniqueName)}
      toggle={() => learning.toggleTechnique(model.techniqueName)}
    />
  );
}
