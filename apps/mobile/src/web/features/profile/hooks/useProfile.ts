import { useState } from 'react';
import { useGetProfile } from '@/api/generated/client';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import { FOLLOWING_POSTS } from '@/web/data/feed';

export type AccountIdentity = {
  id: string;
  name: string;
  email: string;
};

export type ProfileIdentity = {
  name: string;
};

export type ProfileConnection = {
  id: string;
  name: string;
  sample: boolean;
};

const initialFollowing: ProfileConnection[] = [...new Set(FOLLOWING_POSTS.map((post) => post.name))].map(
  (name) => ({ id: name.toLowerCase(), name, sample: true }),
);

export function useProfile(user: AccountIdentity) {
  const profile = useGetProfile({
    query: { enabled: !!user.id, queryKey: ['/api/profile', user.id] },
  });
  const [savedName, setSavedName] = useState<string | null>(null);
  const identity = { name: savedName ?? profile.data?.name ?? user.name };
  const [followers] = useState<ProfileConnection[]>([]);
  const [following] = useState<ProfileConnection[]>(initialFollowing);

  const update = async (next: ProfileIdentity) => {
    const name = next.name.trim().slice(0, 50);
    if (!name) throw new Error('Enter your name.');
    try {
      const result = await authClient.updateUser({ name });
      if (result.error) throw new Error(result.error.message ?? 'Could not update your profile. Try again.');
      setSavedName(name);
      queryClient.setQueryData(
        ['/api/profile', user.id],
        profile.data ? { ...profile.data, name } : undefined,
      );
      void queryClient.invalidateQueries({ queryKey: ['/api/profile', user.id] });
    } catch (error) {
      if (error instanceof Error && error.message) throw error;
      throw new Error('Cannot reach the server. Try saving your profile again when connected.');
    }
  };

  return { identity, followers, following, update };
}
