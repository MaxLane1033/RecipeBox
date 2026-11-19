import type { Cookbook } from '@/web/types/domain';

export const INITIAL_COOKBOOKS: Cookbook[] = [
  {
    name: 'Perfected',
    recipes: ['Garlic butter pasta', 'Chili crisp noodles', 'Egg fried rice'],
  },
  {
    name: 'Cheap weeknights',
    recipes: ['Veggie fried rice', 'Crispy smashed potatoes', 'Egg fried rice'],
  },
  { name: 'Meal prep', recipes: ['Sheet pan chicken', 'Veggie fried rice'] },
];
