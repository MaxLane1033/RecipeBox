import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { Community } from '@/web/features/communities/Community';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation, communities } = model;
  const { back } = navigation;
  const selected = communities.communities.find((community) => community.id === model.communityId);
  if (!selected) return <RouteNotFound title="Community not found" />;
  return (
    <Community
      back={back}
      c={selected}
      currentName={model.profile.identity.name}
      setStatus={communities.setStatus}
      addPost={communities.addPost}
      openRecipe={model.openRecipe}
    />
  );
}
