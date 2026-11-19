import { useState } from 'react';
import type { FeedComment } from '@/web/features/feed/types';

type FeedCommentsProps = {
  id: string;
  open: boolean;
  comments: FeedComment[];
  add: (text: string) => void;
};

export function FeedComments({ id, open, comments, add }: FeedCommentsProps) {
  const [text, setText] = useState('');
  return (
    <section id={id} hidden={!open} aria-label="Comments" className="border-t border-rule px-4 pb-4 pt-3">
      {comments.length ? (
        <ol className="space-y-3" aria-live="polite">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-2.5">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-dark text-[11px] font-bold text-green"
                aria-hidden="true"
              >
                A
              </span>
              <div className="min-w-0">
                <b className="text-[12px]">You</b>
                <p className="whitespace-pre-wrap break-words text-[13px] text-ink">{comment.text}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[13px]">Share a tip or a little encouragement.</p>
      )}
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!text.trim()) return;
          add(text);
          setText('');
        }}
      >
        <input
          className="field-input mt-0 min-w-0 flex-1 text-[13px]"
          aria-label="Add a comment"
          placeholder="Add a comment…"
          value={text}
          maxLength={500}
          onChange={(event) => setText(event.target.value)}
        />
        <button
          className="min-h-control rounded-control px-3 text-[13px] font-bold text-green disabled:opacity-40"
          type="submit"
          disabled={!text.trim()}
        >
          Post
        </button>
      </form>
    </section>
  );
}
