import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { COURSES } from '@/web/data/learning';

export function Course({
  back,
  name,
  done,
  setDone,
  openRecipe,
}: {
  back: () => void;
  name: string;
  done: number;
  setDone: (n: number) => void;
  openRecipe: (n?: string) => void;
}) {
  const c = COURSES[name];
  return (
    <>
      <Header title="Course" back={back} />
      <Photo className="course-hero h-[175px] mt-0 mb-4  -mx-[5px]" name={c.cover} />
      <h1 className="detail-title my-[7px] mx-0">{name}</h1>
      <Level level={c.level} />
      <p>{c.blurb}</p>
      <div className="progress course-progress h-1.5 bg-dark overflow-hidden my-4.5 mx-0 rounded-[4px] [&_i]:block [&_i]:h-full [&_i]:bg-green">
        <i style={{ width: `${(done / 6) * 100}%` }} />
      </div>
      <div className="lesson-list [&>div]:grid [&>div]:grid-cols-[30px_1fr] [&>div]:gap-2.5 [&>div]:border-b [&>div]:[border-bottom-color:var(--color-rule)] [&>div]:py-3 [&>div]:px-0 [&>div>span]:w-[25px] [&>div>span]:h-[25px] [&>div>span]:grid [&>div>span]:place-items-center [&>div>span]:rounded-full [&>div>span]:border [&>div>span]:border-rule [&_.done>span]:bg-green [&_.done>span]:text-paper [&_.next]:py-3 [&_.next]:px-2 [&_.next]:rounded-[10px] [&_.next]:border [&_.next]:border-green [&_.locked]:text-muted [&_small]:block [&_small]:text-muted [&_small]:text-[12px] [&_p]:text-[12px] [&_p]:my-[5px] [&_p]:mx-0">
        {c.lessons.map((x, i) => (
          <div
            className={`${i < done ? 'done ' : ''}${i === done ? 'next ' : ''}${i > done ? 'locked' : ''}`}
            key={x}
          >
            <span>{i < done ? <Icon name="check" size={16} /> : i + 1}</span>
            <div>
              <b>{x}</b>
              <small>
                {i === done
                  ? 'Up next · about 40 min at your level'
                  : i > done
                    ? 'Complete the previous lesson'
                    : 'Completed'}
              </small>
              {i === done && <p>Skills: emulsifying · seasoning · timing</p>}
            </div>
          </div>
        ))}
      </div>
      {done < 6 ? (
        <div className="action-stack flex flex-col gap-[9px] mt-5.5">
          <Button onClick={() => openRecipe(c.recipes[done])}>Cook this dish</Button>
          <Button secondary onClick={() => setDone(done + 1)}>
            Mark lesson complete
          </Button>
        </div>
      ) : (
        <p className="hand-note private font-hand text-[14px] text-brown bg-transparent pt-3.5 pb-0 text-center mt-[5px] mb-5 mx-0 px-0 border-0">
          Course complete. Nicely done!
        </p>
      )}
    </>
  );
}
