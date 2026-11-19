import { useState } from 'react';
import { COURSES } from '@/web/data/learning';

export function useLearningProgress() {
  const [completedTechniques, setCompletedTechniques] = useState<string[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.entries(COURSES).map(([name, course]) => [name, course.done])),
  );

  const toggleTechnique = (name: string) => {
    setCompletedTechniques((previous) =>
      previous.includes(name) ? previous.filter((technique) => technique !== name) : [...previous, name],
    );
  };

  const updateCourse = (name: string, completedLessons: number) => {
    setCourseProgress((previous) => ({ ...previous, [name]: completedLessons }));
  };

  return { completedTechniques, courseProgress, toggleTechnique, updateCourse };
}
