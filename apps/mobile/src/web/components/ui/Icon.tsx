import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  History,
  House,
  Image,
  List,
  type LucideIcon,
  MessageCircle,
  Minus,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Timer,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

type IconProps = {
  name: string;
  size?: number;
};

const icons: Record<string, LucideIcon> = {
  arrow: ArrowUpRight,
  back: ChevronLeft,
  book: BookOpen,
  bookmark: Bookmark,
  'bookmark-check': BookmarkCheck,
  check: Check,
  close: X,
  forward: ChevronRight,
  gear: Settings,
  heart: Heart,
  history: History,
  edit: Pencil,
  comment: MessageCircle,
  home: House,
  image: Image,
  list: List,
  minus: Minus,
  plus: Plus,
  search: Search,
  share: Share2,
  timer: Timer,
  user: UserRound,
  users: UsersRound,
};

export function Icon({ name, size = 20 }: IconProps) {
  const Component = icons[name];
  if (!Component) return null;
  return (
    <Component
      className="icon block shrink-0"
      aria-hidden="true"
      focusable="false"
      size={size}
      strokeWidth={2}
    />
  );
}
