import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { Header } from '@/web/components/ui/Header';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { Post } from '@/web/features/feed/Post';
import type { CommunityPost, CookingCommunity } from '@/web/types/domain';

export function Community({
  back,
  c,
  setStatus,
  addPost,
  openRecipe,
  currentName = 'Alex',
}: {
  currentName?: string;
  openRecipe: (name?: string) => void;
  back: () => void;
  c: CookingCommunity;
  setStatus: (id: string, st: CookingCommunity['status']) => void;
  addPost: (id: string, p: CommunityPost) => void;
}) {
  const [tab, setTab] = useState('Recipes');
  const [pick, setPick] = useState(false);
  const toggle = () => setStatus(c.id, c.status === 'none' ? (c.priv ? 'requested' : 'joined') : 'none');
  return (
    <>
      <Header title="Community" back={back} />
      <div className="community-hero [&_.photo]:h-[165px] [&_.photo]:mt-0 [&_.photo]:mb-4 [&_.photo]:-mx-5 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div>span]:text-[13px] [&>div>span]:text-muted">
        <Photo name={c.cover} />
        <h1>{c.name}</h1>
        <p>{c.blurb}</p>
        <div>
          <span>{c.members}</span>
          <Chip selected={c.status === 'joined'} onClick={toggle}>
            {c.status === 'joined'
              ? 'Joined'
              : c.status === 'requested'
                ? 'Requested'
                : c.priv
                  ? 'Request'
                  : 'Join'}
          </Chip>
        </div>
      </div>
      <p className="my-3 text-[12px]">Demo community · includes sample posts and member counts.</p>
      <div className="text-tabs min-h-control-tabs flex gap-5.5 border-b [border-bottom-color:var(--color-rule)] mb-[15px] [&_button]:bg-transparent [&_button]:relative [&_button]:rounded-control-inner [&_button]:text-muted [&_button]:py-0 [&_button]:px-0.5 [&_button]:border-0 [&_button.active]:font-bold [&_button.active]:text-ink">
        {['Recipes', 'Challenges'].map((x) => (
          <button
            type="button"
            aria-pressed={tab === x}
            className={tab === x ? 'active' : ''}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === 'Recipes' ? (
        <>
          {c.posts.map((p) =>
            p.text ? (
              <article
                className="text-recipe bg-card mb-[15px] p-[15px] rounded-[12px] border border-rule"
                key={p.id ?? `${p.name}:${p.title}:${p.text ?? ''}`}
              >
                <Level />
                <h2>{p.title}</h2>
                <p>{p.text}</p>
              </article>
            ) : (
              <Post
                key={p.id ?? `${p.name}:${p.title}:${p.text ?? ''}`}
                fresh={p.name === 'Alex'}
                name={`${p.name === 'Alex' ? currentName : p.name} · ${c.name}`}
                title={p.title}
                openRecipe={openRecipe}
                note=""
              />
            ),
          )}
          {c.posts.length === 0 && (
            <p className="hand-note private font-hand text-[14px] text-brown bg-transparent pt-3.5 pb-0 text-center mt-[5px] mb-5 mx-0 px-0 border-0">
              No recipes yet. Be the first to post.
            </p>
          )}
        </>
      ) : (
        <article className="challenge bg-card w-full block text-left mb-3 p-4 rounded-[12px] border border-rule [&_h1]:mt-2 [&_h1]:mb-5 [&_h1]:mx-0 [&>div:last-child]:flex [&>div:last-child]:justify-between [&>div:last-child]:mt-2 [&>div:last-child]:text-[12px] [&>span]:text-[12px] [&>span]:text-muted [&>span]:uppercase [&>span]:tracking-[.08em] [&_h2]:mt-[7px] [&_h2]:mb-2.5 [&_h2]:mx-0">
          <span>Example group challenge</span>
          <h2>{c.name} weekly challenge</h2>
          <div className="progress h-1.5 bg-dark overflow-hidden rounded-[4px] [&_i]:block [&_i]:h-full [&_i]:bg-green">
            <i style={{ width: '60%' }} />
          </div>
        </article>
      )}
      <div className="mt-5" />
      <Button disabled={c.status !== 'joined'} onClick={() => setPick(!pick)}>
        {c.status === 'joined' ? 'Post a recipe' : 'Join to post'}
      </Button>
      {pick && (
        <div className="radio-list border-t [border-top-color:var(--color-rule)] mb-2.5 [&_button]:w-full [&_button]:min-h-control [&_button]:border-t-0 [&_button]:[border-top-color:currentColor] [&_button]:border-r-0 [&_button]:[border-right-color:currentColor] [&_button]:border-b [&_button]:[border-bottom-color:var(--color-rule)] [&_button]:border-l-0 [&_button]:[border-left-color:currentColor] [&_button]:bg-transparent [&_button]:flex [&_button]:items-center [&_button]:gap-2.5 [&_i]:w-4.5 [&_i]:h-4.5 [&_i]:relative [&_i]:rounded-full [&_i]:border [&_i]:border-brown">
          {Object.keys(RECIPE_LEVELS).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => {
                addPost(c.id, { name: 'Alex', title: r });
                setPick(false);
                setTab('Recipes');
              }}
            >
              <i />
              <span>{r}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
