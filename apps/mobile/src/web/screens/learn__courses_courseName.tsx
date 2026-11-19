import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { COURSES } from '@/web/data/learning';
import { Course } from '@/web/features/learning/Course';
import { hasOwnKey } from '@/web/lib/records';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation, learning } = model;
  const { back } = navigation;
  if (!hasOwnKey(COURSES, model.courseName)) return <RouteNotFound title="Course not found" />;
  return (
    <Course
      back={back}
      name={model.courseName}
      done={learning.courseProgress[model.courseName]}
      setDone={(completedLessons) => learning.updateCourse(model.courseName, completedLessons)}
      openRecipe={model.openRecipe}
    />
  );
}
