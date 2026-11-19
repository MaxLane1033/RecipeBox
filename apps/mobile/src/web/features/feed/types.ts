import type { PostData } from '@/web/types/domain';

export type FeedEntry = PostData & {
  id: string;
  sample?: boolean;
  timeLabel?: string;
  source?: string;
  cheerCount?: number;
};

export type FeedComment = {
  id: string;
  text: string;
};

export type FeedInteraction = {
  cheered: boolean;
  comments: FeedComment[];
};
