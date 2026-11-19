import { useState } from 'react';
import { INITIAL_COMMUNITIES } from '@/web/data/communities';
import type { CommunityPost, CookingCommunity } from '@/web/types/domain';

export function useCommunities() {
  const [communities, setCommunities] = useState<CookingCommunity[]>(INITIAL_COMMUNITIES);

  const setStatus = (id: string, status: CookingCommunity['status']) => {
    setCommunities((previous) =>
      previous.map((community) => (community.id === id ? { ...community, status } : community)),
    );
  };

  const addPost = (id: string, post: CommunityPost) => {
    setCommunities((previous) =>
      previous.map((community) =>
        community.id === id
          ? { ...community, posts: [{ ...post, id: post.id ?? crypto.randomUUID() }, ...community.posts] }
          : community,
      ),
    );
  };

  const addCommunity = (community: CookingCommunity) => {
    setCommunities((previous) => [...previous, community]);
  };

  return { communities, setStatus, addPost, addCommunity };
}
