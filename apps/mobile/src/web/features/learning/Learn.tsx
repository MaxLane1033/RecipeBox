import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { ProgressBar } from '@/web/components/ui/ProgressBar';
import { SearchInput } from '@/web/components/ui/SearchInput';
import { COURSES, TECHNIQUES } from '@/web/data/learning';

type LearnProps = {
  openTech: (n: string) => void;
  openCourse: (n: string) => void;
  courseDone: Record<string, number>;
};
export function Learn({ openTech, openCourse, courseDone }: LearnProps) {
  const [query, setQuery] = useState('');
  const names = Object.keys(COURSES);
  const cont =
    names.find((n) => courseDone[n] > 0 && courseDone[n] < COURSES[n].lessons.length) ||
    names.find((n) => !courseDone[n]);
  const match = (name: string) => name.toLowerCase().includes(query.toLowerCase().trim());
  const techniques = Object.keys(TECHNIQUES).filter(match);
  const courses = names.filter(match);
  return (
    <>
      <SearchInput
        label="Search skills and courses"
        placeholder="Search skills and courses"
        value={query}
        onChange={setQuery}
      />
      {!query && cont && (
        <section className="mt-5 rounded-2xl bg-dark p-5">
          <h2>Keep building confidence</h2>
          <p className="my-2 text-[13px]">
            {cont} · lesson {Math.min((courseDone[cont] || 0) + 1, COURSES[cont].lessons.length)} of{' '}
            {COURSES[cont].lessons.length}
          </p>
          <h3 className="my-3">{COURSES[cont].lessons[courseDone[cont] || 0]}</h3>
          <ProgressBar
            value={((courseDone[cont] || 0) / COURSES[cont].lessons.length) * 100}
            label={`${cont} completion`}
          />
          <div className="mt-5">
            <Button onClick={() => openCourse(cont)}>View course</Button>
          </div>
        </section>
      )}
      <div className="section-heading">
        <h2>Everyday techniques</h2>
        <span className="text-[12px] text-muted">Quick to learn</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {techniques.map((name) => (
          <button type="button" className="text-left" key={name} onClick={() => openTech(name)}>
            <Photo name={name} className="h-28 w-full" />
            <b className="mt-3 block">{name}</b>
            <span className="mt-1 block text-[12px] text-muted">{TECHNIQUES[name].time} · Starter</span>
          </button>
        ))}
      </div>
      <div className="section-heading">
        <h2>Your courses</h2>
      </div>
      {courses.map((name) => (
        <button
          type="button"
          key={name}
          className="block w-full border-b border-rule py-4 text-left"
          onClick={() => openCourse(name)}
        >
          <div className="flex items-center justify-between gap-3">
            <h3>{name}</h3>
            <Level level={COURSES[name].level} />
          </div>
          <p className="my-3 text-[12px]">
            {courseDone[name] || 0} of {COURSES[name].lessons.length} lessons completed
          </p>
          <ProgressBar
            value={((courseDone[name] || 0) / COURSES[name].lessons.length) * 100}
            label={`${name} completion`}
          />
        </button>
      ))}
      {!techniques.length && !courses.length && (
        <p className="notice mt-5" role="status">
          No matching skills or courses. Try a shorter search.
        </p>
      )}
    </>
  );
}
