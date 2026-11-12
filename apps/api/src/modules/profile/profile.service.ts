import { profileErrors } from './profile.error.ts';
import { profileRepository } from './profile.repository.ts';
import type { Profile } from './profile.schema.ts';

export const profileService = {
  async getProfile(userId: string): Promise<Profile> {
    const user = await profileRepository.findByUserId(userId);
    if (!user) throw profileErrors.notFound(userId);
    return { ...user, image: user.image ?? null, createdAt: user.createdAt.toISOString() };
  },
};
