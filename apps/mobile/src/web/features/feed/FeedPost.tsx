import { useState } from 'react';
import { Icon } from '@/web/components/ui/Icon';
import { Photo } from '@/web/components/ui/Photo';
import { FeedComments } from '@/web/features/feed/FeedComments';
import { useClampedText } from '@/web/features/feed/hooks/useClampedText';
import type { FeedEntry, FeedInteraction } from '@/web/features/feed/types';

type FeedPostProps = {
  post: FeedEntry;
  interaction?: FeedInteraction;
  toggleCheer: () => void;
  addComment: (text: string) => void;
  openRecipe?: () => void;
  openAttempt?: () => void;
  saveRecipe?: () => void;
  saved: boolean;
  recipeHref?: string;
};

export function FeedPost({
  post,
  interaction,
  toggleCheer,
  addComment,
  openRecipe,
  openAttempt,
  saveRecipe,
  saved,
  recipeHref,
}: FeedPostProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [shareFallback, setShareFallback] = useState(false);
  const comments = interaction?.comments ?? [];
  const cheered = interaction?.cheered ?? false;
  const titleId = `title-${post.id}`;
  const commentsId = `comments-${post.id}`;
  const reflection = post.reflection;
  const reflectionText = reflection?.learned
    ? `Learned: ${reflection.learned}`
    : reflection?.changed
      ? `Changed: ${reflection.changed}`
      : reflection?.worked
        ? `What worked: ${reflection.worked}`
        : '';
  const summary = [post.note, reflectionText].filter(Boolean).join(' ');
  const note = useClampedText(summary);
  const shareText = [post.title, summary, recipeHref].filter(Boolean).join('\n');
  const share = async () => {
    setShareStatus('');
    setShareFallback(false);
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: summary,
          ...(recipeHref ? { url: recipeHref } : {}),
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus(recipeHref ? 'Post and recipe link copied.' : 'Post text copied.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareFallback(true);
      setShareStatus('Select and copy the text below to share.');
    }
  };
  const openPhoto = openAttempt ?? openRecipe;
  const photo = (
    <Photo className="post-photo aspect-[8/5] min-h-0 rounded-none!" name={post.title} src={post.photo} />
  );
  return (
    <article className="feed-post border-b border-rule bg-card" aria-labelledby={titleId}>
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-dark text-[12px] font-extrabold text-green"
          aria-hidden="true"
        >
          {post.name[0]}
        </span>
        <div className="min-w-0">
          <b className="block break-words text-[13px] leading-5">{post.name}</b>
          <p className="truncate text-[11px] leading-4">
            {[
              post.source,
              post.timeLabel ?? (post.sample ? 'Sample cook' : 'Just cooked'),
              post.sample && post.timeLabel ? 'Sample cook' : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </div>
      <div className="relative">
        {openPhoto ? (
          <button
            type="button"
            className="block w-full text-left"
            aria-label={`${openAttempt ? 'View cooking attempt' : 'View recipe'}: ${post.title}`}
            onClick={openPhoto}
          >
            {photo}
          </button>
        ) : (
          photo
        )}
        {saveRecipe && (
          <button
            type="button"
            aria-label={`${saved ? 'Saved recipe, choose cookbook' : 'Save recipe'}: ${post.title}`}
            className="absolute right-4 bottom-3 grid h-control w-control place-items-center rounded-control bg-card text-green shadow-sm hover:bg-dark"
            onClick={saveRecipe}
          >
            <Icon name={saved ? 'bookmark-check' : 'bookmark'} size={21} />
          </button>
        )}
      </div>
      <div className="px-4 pt-2.5 pb-1">
        <h2 id={titleId} className="text-[19px] leading-snug">
          {openRecipe ? (
            <button type="button" className="min-h-9 text-left hover:text-green" onClick={openRecipe}>
              {post.title}
            </button>
          ) : (
            <span className="block py-2">{post.title}</span>
          )}
        </h2>
        {summary && (
          <p
            ref={note.ref}
            className={`whitespace-pre-wrap break-words text-[13px] ${note.expanded ? '' : 'line-clamp-2'}`}
          >
            {summary}
          </p>
        )}
        <div className="mt-1 flex min-h-9 items-center justify-between gap-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted">
            {post.stats.slice(0, 3).map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
          {openAttempt ? (
            <button
              type="button"
              className="min-h-9 shrink-0 text-[12px] font-bold text-green"
              onClick={openAttempt}
            >
              View attempt
            </button>
          ) : (
            note.canExpand && (
              <button
                type="button"
                className="min-h-9 shrink-0 text-[12px] font-bold text-green"
                aria-expanded={note.expanded}
                onClick={note.toggle}
              >
                {note.expanded ? 'Show less' : 'Read more'}
              </button>
            )
          )}
        </div>
        <div className="mt-1 flex min-h-control items-center justify-between text-[12px] text-green">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={`Encourage ${post.name}`}
              aria-pressed={cheered}
              className={`flex min-h-control min-w-control items-center gap-1.5 ${
                cheered ? '[&_svg]:fill-green' : ''
              }`}
              onClick={toggleCheer}
            >
              <Icon name="heart" size={20} />
              <span>{(post.cheerCount ?? 0) + (cheered ? 1 : 0)}</span>
            </button>
            <button
              type="button"
              aria-label={`Comments on ${post.title}`}
              aria-expanded={commentsOpen}
              aria-controls={commentsId}
              className="flex min-h-control items-center gap-1.5"
              onClick={() => setCommentsOpen(!commentsOpen)}
            >
              <Icon name="comment" size={20} />
              <span>{comments.length || 'Comment'}</span>
            </button>
          </div>
          <button
            type="button"
            className="flex min-h-control items-center gap-1.5"
            onClick={() => void share()}
          >
            <Icon name="share" size={19} />
            <span>Share</span>
          </button>
        </div>
        {shareStatus && (
          <p className="pb-3 text-[12px]" role="status">
            {shareStatus}
          </p>
        )}
        {shareFallback && (
          <textarea
            aria-label="Copy post to share"
            className="mb-3 text-[12px]"
            readOnly
            value={shareText}
            onFocus={(event) => event.target.select()}
          />
        )}
      </div>
      <FeedComments id={commentsId} open={commentsOpen} comments={comments} add={addComment} />
    </article>
  );
}
