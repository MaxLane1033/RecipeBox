import { db, user } from '@recipebox/db';
import { eq } from 'drizzle-orm';

export const profileRepository = {
  async findByUserId(userId: string) {
    const [profile] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    return profile ?? null;
  },
};
