import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { ChallengeDetail } from '@/web/features/challenges/ChallengeDetail';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation, challenges } = model;
  const { back } = navigation;
  const selected = challenges.challenges.find((challenge) => challenge.id === model.challengeId);
  if (!selected) return <RouteNotFound title="Challenge not found" />;
  return <ChallengeDetail back={back} c={selected} currentName={model.profile.identity.name} />;
}
