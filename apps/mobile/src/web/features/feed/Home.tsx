import { useState } from 'react';
import { FOLLOWING_POSTS, SUGGESTED_POSTS } from '@/web/data/feed';
import { COOKING_LEVELS, RECIPE_LEVELS } from '@/web/data/recipes';
import { SaveSheet } from '@/web/features/cookbooks/SaveSheet';
import { FeedPost } from '@/web/features/feed/FeedPost';
import type { FeedInteractions } from '@/web/features/feed/hooks/useFeedInteractions';
import type { FeedEntry } from '@/web/features/feed/types';
import { hasOwnKey } from '@/web/lib/records';
import type { Cookbook, ExperienceLevel, PostData } from '@/web/types/domain';

type HomeProps = {
  name: string;
  posts: PostData[];
  books: Cookbook[];
  level: ExperienceLevel;
  interactions: FeedInteractions;
  openAttempt: (id: string) => void;
  openRecipe: (name: string) => void;
  saveRecipe: (book: string, recipe: string) => void;
  recipeHref: (name: string) => string;
};

export function Home({
  name,
  posts,
  books,
  level,
  interactions,
  openRecipe,
  openAttempt,
  saveRecipe,
  recipeHref,
}: HomeProps) {
  const [save, setSave] = useState<string | null>(null);
  const following: FeedEntry[] = [
    ...posts.map((post, index) => ({
      ...post,
      name,
      id: post.id ?? `own-${index}`,
    })),
    ...FOLLOWING_POSTS,
  ];
  const levelIndex = COOKING_LEVELS.indexOf(level);
  const suggested = [...SUGGESTED_POSTS].sort(
    (a, b) =>
      Math.abs(COOKING_LEVELS.indexOf(RECIPE_LEVELS[a.title]) - levelIndex) -
      Math.abs(COOKING_LEVELS.indexOf(RECIPE_LEVELS[b.title]) - levelIndex),
  );
  const renderPost = (post: FeedEntry) => {
    const linkedRecipe = hasOwnKey(RECIPE_LEVELS, post.title);
    return (
      <FeedPost
        key={post.id}
        post={post}
        interaction={interactions.byPost[post.id]}
        toggleCheer={() => interactions.toggleCheer(post.id)}
        addComment={(text) => interactions.addComment(post.id, text)}
        openRecipe={linkedRecipe ? () => openRecipe(post.title) : undefined}
        openAttempt={
          !post.sample && posts.some((item) => item.id === post.id) ? () => openAttempt(post.id) : undefined
        }
        saved={books.some((book) => book.recipes.includes(post.title))}
        saveRecipe={linkedRecipe ? () => setSave(post.title) : undefined}
        recipeHref={linkedRecipe ? recipeHref(post.title) : undefined}
      />
    );
  };
  return (
    <>
      <div className="-mx-5 -mt-4 -mb-8">
        <section aria-label="Updates from people you follow" className="space-y-2">
          {following.map(renderPost)}
        </section>
        <section aria-label="Suggested cooking attempts">
          <h2 className="px-4 py-4 text-[14px] font-bold">Suggested for you</h2>
          <div className="space-y-2">{suggested.map(renderPost)}</div>
        </section>
      </div>
      {save && (
        <SaveSheet key={save} close={() => setSave(null)} recipe={save} books={books} onSave={saveRecipe} />
      )}
    </>
  );
}
