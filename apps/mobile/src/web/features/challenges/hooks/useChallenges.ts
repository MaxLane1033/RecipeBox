import { useState } from 'react';
import { INITIAL_CHALLENGES } from '@/web/data/challenges';
import type { Challenge } from '@/web/types/domain';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const addChallenge = (challenge: Challenge) => {
    setChallenges((previous) => [...previous, challenge]);
  };

  const recordMeal = () => {
    setChallenges((previous) =>
      previous.map((challenge) => ({
        ...challenge,
        members: challenge.members.map((member) =>
          member.name === 'Alex' ? { ...member, count: member.count + 1 } : member,
        ),
      })),
    );
  };

  return { challenges, addChallenge, recordMeal };
}
