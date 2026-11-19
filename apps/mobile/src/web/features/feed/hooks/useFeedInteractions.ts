import { useState } from 'react';
import type { FeedInteraction } from '@/web/features/feed/types';

const emptyInteraction: FeedInteraction = { cheered: false, comments: [] };

export function useFeedInteractions() {
  const [byPost, setByPost] = useState<Record<string, FeedInteraction>>({});
  const toggleCheer = (id: string) => {
    setByPost((previous) => {
      const current = previous[id] ?? emptyInteraction;
      return { ...previous, [id]: { ...current, cheered: !current.cheered } };
    });
  };
  const addComment = (id: string, value: string) => {
    const text = value.trim().slice(0, 500);
    if (!text) return;
    const comment = { id: crypto.randomUUID(), text };
    setByPost((previous) => {
      const current = previous[id] ?? emptyInteraction;
      return {
        ...previous,
        [id]: { ...current, comments: [...current.comments, comment] },
      };
    });
  };
  return { byPost, toggleCheer, addComment };
}

export type FeedInteractions = ReturnType<typeof useFeedInteractions>;
