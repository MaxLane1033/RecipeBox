import { useState } from 'react';
import { useNavigation } from '@/web/app/useNavigation';
import { DEFAULT_FILTERS } from '@/web/data/recipes';
import { getOriginalVersionId } from '@/web/data/versions';
import { useChallenges } from '@/web/features/challenges/hooks/useChallenges';
import { useCommunities } from '@/web/features/communities/hooks/useCommunities';
import { useCookbooks } from '@/web/features/cookbooks/hooks/useCookbooks';
import { useFeedInteractions } from '@/web/features/feed/hooks/useFeedInteractions';
import { useLearningProgress } from '@/web/features/learning/hooks/useLearningProgress';
import { useMealJournal } from '@/web/features/profile/hooks/useMealJournal';
import type { AccountIdentity } from '@/web/features/profile/hooks/useProfile';
import { useProfile } from '@/web/features/profile/hooks/useProfile';
import { useRecipeVersions } from '@/web/features/versions/hooks/useRecipeVersions';
import { useAppNavigate, useRecipeParams } from '@/web/navigation/navigation';
import type {
  Challenge,
  CookingCommunity,
  ExperienceLevel,
  PostData,
  RecipeFilters,
} from '@/web/types/domain';

const cookingLevels: ExperienceLevel[] = ['Starter', 'Home cook', 'Skilled', 'Chef'];

function readCookingLevel(userId: string): ExperienceLevel {
  try {
    if (typeof window === 'undefined') return 'Starter';
    const stored = window.localStorage.getItem(`recipebox:${userId}:level`);
    return cookingLevels.includes(stored as ExperienceLevel) ? (stored as ExperienceLevel) : 'Starter';
  } catch {
    return 'Starter';
  }
}

/** Session-only feature state; the account-keyed provider clears it on sign-out. */
export function useRecipeBox(user: AccountIdentity) {
  const navigate = useAppNavigate();
  const params = useRecipeParams();
  const searchRecipe = params.recipe;
  const collections = useCookbooks();
  const recipeVersions = useRecipeVersions();
  const cookbooks = {
    ...collections,
    saveRecipe: (book: string, name: string) => {
      recipeVersions.saveRecipeCopy(name);
      collections.saveRecipe(book, name);
    },
  };
  const searchVersion = params.version;
  const communities = useCommunities();
  const challenges = useChallenges();
  const learning = useLearningProgress();
  const journal = useMealJournal();
  const profile = useProfile(user);
  const feed = useFeedInteractions();

  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);
  const [lastRecipeName, setLastRecipeName] = useState(
    () => params.recipeName ?? searchRecipe ?? 'Garlic butter pasta',
  );
  const recipeName = params.recipeName ?? searchRecipe ?? lastRecipeName;
  const communityId = params.communityId ?? 'bb';
  const techniqueName = params.techniqueName ?? 'Dice an onion';
  const courseName = params.courseName ?? 'Italian basics';
  const bookName = params.bookName ?? 'Perfected';
  const versionId =
    params.versionId ??
    searchVersion ??
    (recipeVersions.isOwnedRecipe(recipeName) ? recipeVersions.currentVersionIds[recipeName] : undefined) ??
    getOriginalVersionId(recipeName);
  const challengeId = params.challengeId ?? 'c1';
  const routeNavigation = useNavigation({
    recipeName,
    communityId,
    techniqueName,
    courseName,
    bookName,
    versionId,
    personalRecipe: recipeVersions.isOwnedRecipe(recipeName),
    challengeId,
  });
  // Remember the current recipe when a UI action leaves its URL; the router owns history.
  const navigation = {
    ...routeNavigation,
    go: (screen: Parameters<typeof routeNavigation.go>[0]) => {
      setLastRecipeName(recipeName);
      routeNavigation.go(screen);
    },
    back: () => {
      setLastRecipeName(recipeName);
      routeNavigation.back();
    },
  };
  const [cookingMinutes, setCookingMinutes] = useState(0);
  const [level, setLevel] = useState<ExperienceLevel>(() => readCookingLevel(user.id));
  const [onboarding, setOnboarding] = useState(false);

  const changeLevel = (nextLevel: ExperienceLevel) => {
    try {
      window.localStorage.setItem(`recipebox:${user.id}:level`, nextLevel);
    } catch {
      // Keep the preference usable when browser storage is disabled.
    }
    setLevel(nextLevel);
  };

  const finishOnboarding = (skill: string) => {
    changeLevel(
      skill.startsWith('Just')
        ? 'Starter'
        : skill.startsWith('I can')
          ? 'Home cook'
          : skill.startsWith('Comfortable')
            ? 'Skilled'
            : 'Chef',
    );
    setOnboarding(false);
  };

  // Accept a click event as well as a name, preserving existing button callbacks.
  const openRecipe = (name?: unknown) => {
    const selectedRecipe = typeof name === 'string' ? name : recipeName;
    setLastRecipeName(selectedRecipe);
    void navigate({
      to: '/recipes/$recipeName',
      params: { recipeName: selectedRecipe },
    });
  };
  const openMyRecipe = (name?: unknown) => {
    const selectedRecipe = typeof name === 'string' ? name : recipeName;
    setLastRecipeName(selectedRecipe);
    void navigate({
      to: '/recipes/$recipeName',
      params: { recipeName: selectedRecipe },
      search: {
        view: recipeVersions.isOwnedRecipe(selectedRecipe) ? 'mine' : undefined,
      },
    });
  };
  const openCommunity = (id: string) => {
    void navigate({
      to: '/communities/$communityId',
      params: { communityId: id },
    });
  };
  const openChallenge = (id: string) => {
    void navigate({
      to: '/challenges/$challengeId',
      params: { challengeId: id },
    });
  };
  const openTechnique = (name: string) => {
    void navigate({
      to: '/learn/techniques/$techniqueName',
      params: { techniqueName: name },
    });
  };
  const openCourse = (name: string) => {
    void navigate({
      to: '/learn/courses/$courseName',
      params: { courseName: name },
    });
  };
  const openBook = (name: string) => {
    void navigate({ to: '/cookbooks/$bookName', params: { bookName: name } });
  };
  const openVersion = (id: string) => {
    void navigate({
      to: '/recipes/$recipeName/versions/$versionId',
      params: { recipeName, versionId: id },
    });
  };
  const createChallenge = (challenge: Challenge) => {
    challenges.addChallenge(challenge);
    void navigate({
      to: '/challenges/$challengeId',
      params: { challengeId: challenge.id },
      replace: true,
    });
  };
  const createCommunity = (community: CookingCommunity) => {
    communities.addCommunity(community);
    void navigate({
      to: '/communities/$communityId',
      params: { communityId: community.id },
      replace: true,
    });
  };
  const finishCooking = (minutes: number) => {
    setCookingMinutes(minutes);
    setLastRecipeName(recipeName);
    void navigate({
      to: '/log',
      search: { recipe: recipeName, version: versionId },
    });
  };
  const finishMeal = (post: PostData) => {
    journal.recordMeal({ ...post, name: profile.identity.name });
    if (post.visibility !== 'private') challenges.recordMeal();
    setCookingMinutes(0);
    setLastRecipeName(post.recipeName || recipeName);
    if (post.visibility === 'private')
      void navigate({
        to: '/profile',
        search: { tab: 'history' },
        replace: true,
      });
    else navigation.resetHome();
  };

  return {
    navigation,
    cookbooks,
    communities,
    challenges,
    learning,
    journal,
    profile,
    feed,
    filters,
    setFilters,
    level,
    changeLevel,
    onboarding,
    finishOnboarding,
    communityId,
    techniqueName,
    courseName,
    bookName,
    versionId,
    challengeId,
    recipeName,
    cookingMinutes,
    recipeVersions,
    openRecipe,
    openMyRecipe,
    openCommunity,
    openChallenge,
    openTechnique,
    openCourse,
    openBook,
    openVersion,
    createChallenge,
    createCommunity,
    finishCooking,
    finishMeal,
  };
}

export type RecipeBoxModel = ReturnType<typeof useRecipeBox>;
