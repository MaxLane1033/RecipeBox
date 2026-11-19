import { Button } from '@/web/components/ui/Button';
import { Post } from '@/web/features/feed/Post';
import type { PostData } from '@/web/types/domain';

type ProfilePostsProps = {
  name: string;
  posts: PostData[];
  openRecipe: (name?: string) => void;
  openAttempt: (id: string) => void;
  logMeal: () => void;
};

export function ProfilePosts({ name, posts, openRecipe, openAttempt, logMeal }: ProfilePostsProps) {
  return (
    <section aria-label="Your posts">
      {!posts.length && (
        <div className="rounded-xl bg-dark p-5">
          <h2 className="text-[18px]">Every cook starts somewhere.</h2>
          <p className="my-3 text-[13px]">Share a meal and what you learned. Your posts will appear here.</p>
          <Button onClick={logMeal}>Log your first meal</Button>
        </div>
      )}
      {posts.map((post, index) => {
        const id = post.id;
        return (
          <Post
            key={id || index}
            {...post}
            name={name}
            fresh
            openRecipe={openRecipe}
            openAttempt={id ? () => openAttempt(id) : undefined}
          />
        );
      })}
    </section>
  );
}
