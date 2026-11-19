import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { TECHNIQUES } from '@/web/data/learning';

export function Technique({
  back,
  name,
  done,
  toggle,
}: {
  back: () => void;
  name: string;
  done: boolean;
  toggle: () => void;
}) {
  const t = TECHNIQUES[name] || TECHNIQUES['Dice an onion'];
  return (
    <>
      <Header title="Technique" back={back} />
      <div className="video relative mt-0 mb-4.5 h-[230px] -mx-5 [&_.photo]:h-full [&>button]:absolute [&>button]:left-1/2 [&>button]:top-1/2 [&>button]:[transform:translate(-50%,-50%)] [&>button]:bg-paper [&>button]:w-control [&>button]:h-control [&>button]:pl-1.5 [&>button]:rounded-control [&>button]:border-0 [&>span]:absolute [&>span]:right-3 [&>span]:bottom-3 [&>span]:bg-ink [&>span]:text-paper [&>span]:text-[12px] [&>span]:py-[3px] [&>span]:px-[7px] [&>span]:rounded-[4px]">
        <Photo name={name} />

        <span>Video preview · {t.len}</span>
      </div>
      <p className="mb-4 text-[12px]">Video playback is coming later. Follow the step-by-step guide below.</p>
      <h1 className="detail-title my-[7px] mx-0">{name}</h1>
      <Level />
      <p>{t.lead}</p>
      <div className="section-title flex justify-between items-center mt-6 mb-2.5 mx-0 [&>span]:text-[13px] [&>span]:text-muted">
        <h2>Three simple steps</h2>
      </div>
      {t.steps.map((x, i) => (
        <div
          className="tech-step py-4 grid grid-cols-[30px_1fr] gap-2 items-start border-b [border-bottom-color:var(--color-rule)] [&>b]:w-[25px] [&>b]:h-[25px] [&>b]:bg-green [&>b]:text-paper [&>b]:grid [&>b]:place-items-center [&>b]:rounded-full [&_p]:mt-0.5"
          key={x}
        >
          <b>{i + 1}</b>
          <p>{x}</p>
        </div>
      ))}
      <p className="post-note tip-note font-hand text-[14px] text-ink mt-5 mb-2 rounded-xl bg-butter/60  mx-0 p-2.5">
        {t.tip}
      </p>
      <div className="action-stack flex flex-col gap-[9px] mt-5.5">
        <Button onClick={toggle}>
          {done && <Icon name="check" size={16} />}
          {done ? 'Done · Tap to undo' : 'Mark as done'}
        </Button>
      </div>
    </>
  );
}
