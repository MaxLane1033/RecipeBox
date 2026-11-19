import { Circle, Diamond, Layers, Square } from 'lucide-react';
import type { ExperienceLevel } from '@/web/types/domain';

const levelMarkers = {
  Starter: { icon: Circle, color: 'text-green' },
  'Home cook': { icon: Square, color: 'text-gold' },
  Skilled: { icon: Diamond, color: 'text-terra' },
  Chef: { icon: Layers, color: 'text-ink' },
};

type LevelProps = {
  level?: ExperienceLevel;
};

export function Level({ level = 'Starter' }: LevelProps) {
  const { icon: Marker, color } = levelMarkers[level];
  return (
    <span
      className={`level inline-flex items-center gap-[5px] text-[12px] font-bold whitespace-nowrap text-muted ${level.toLowerCase().replace(' ', '-')}`}
    >
      <Marker size={12} strokeWidth={2} className={`shrink-0 ${color}`} aria-hidden="true" />
      {level}
    </span>
  );
}
