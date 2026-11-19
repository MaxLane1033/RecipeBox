import { useEffect, useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import { Segments } from '@/web/components/ui/Segments';
import { formatDuration } from '@/web/lib/format';
import { getRecipe } from '@/web/lib/recipes';
import type { RecipeData } from '@/web/types/domain';

export function Cook({
  back,
  finish,
  name,
  data,
}: {
  back: () => void;
  finish: (mins: number) => void;
  name: string;
  data?: RecipeData;
}) {
  const S = (data ?? getRecipe(name)).steps;
  const [phase, setPhase] = useState('Prep');
  const [seconds, setSeconds] = useState(0);
  const [stepSecs, setStepSecs] = useState(0);
  const [phaseSecs, setPhaseSecs] = useState<Record<string, number>>({
    Prep: 0,
    Cook: 0,
    Clean: 0,
  });
  const [splits, setSplits] = useState<number[]>([]);
  const [running, setRunning] = useState(true);
  const [step, setStep] = useState(1);
  const [share, setShare] = useState(true);
  const [cleanup, setCleanup] = useState(true);
  const [subs, setSubs] = useState(false);
  const [note, setNote] = useState(false);
  const [showSplits, setShowSplits] = useState(false);
  useEffect(() => {
    if (!running || step > S.length) return;
    const t = setInterval(() => {
      setSeconds((s) => s + 1);
      setStepSecs((s) => s + 1);
      setPhaseSecs((p) => ({ ...p, [phase]: p[phase] + 1 }));
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase, step, S.length]);
  const next = () => {
    setSplits((s) => [...s, stepSecs]);
    setStepSecs(0);
    if (step < S.length) {
      setStep(step + 1);
      setPhase(step < 2 ? 'Prep' : 'Cook');
    } else setStep(S.length + 1);
  };
  if (showSplits)
    return (
      <>
        <Header title="My splits" back={() => setShowSplits(false)} />
        <p className="hand-note private font-hand text-[14px] text-brown bg-transparent pt-3.5 pb-0 text-center mt-[5px] mb-5 mx-0 px-0 border-0">
          Your times stay private until you share them.
        </p>
        <article className="split-card bg-card mb-3 p-3.5 rounded-[12px] border border-rule [&>div]:flex [&>div]:items-center [&>div]:justify-between [&_p]:flex [&_p]:items-center [&_p]:justify-between [&_p]:text-[13px] [&_p]:border-t [&_p]:[border-top-color:var(--color-rule)] [&_p]:pt-[9px] [&_p_small]:text-brown">
          {['Prep', 'Cook', 'Clean'].map((k) => (
            <div key={k}>
              <h2>{k}</h2>
              <b>{phaseSecs[k] ? formatDuration(phaseSecs[k]) : '—'}</b>
            </div>
          ))}
        </article>
        <article className="split-card bg-card mb-3 p-3.5 rounded-[12px] border border-rule [&>div]:flex [&>div]:items-center [&>div]:justify-between [&_p]:flex [&_p]:items-center [&_p]:justify-between [&_p]:text-[13px] [&_p]:border-t [&_p]:[border-top-color:var(--color-rule)] [&_p]:pt-[9px] [&_p_small]:text-brown">
          {S.map((x, i) => {
            const done = i < splits.length;
            const d = done ? Math.round(splits[i] / 60) - x[2] : 0;
            return (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: cooking steps come from one immutable snapshot and keep their positions for the entire session.
                key={i}
              >
                <span>
                  {i + 1}. {x[0]}
                </span>
                <b>{done ? formatDuration(splits[i]) : i === step - 1 ? 'Running' : '—'}</b>
                <small>
                  {done
                    ? d === 0
                      ? 'On pace'
                      : `${Math.abs(d)} min ${d > 0 ? 'slower' : 'faster'}`
                    : `~${x[2]} min`}
                </small>
              </p>
            );
          })}
        </article>
      </>
    );
  if (step > S.length)
    return (
      <>
        <Header title="Finished" back={back} />
        <div className="finish text-center pt-10 pb-5 px-0 [&_h1]:text-[28px] [&_h1]:m-2">
          <h1>Dinner is done.</h1>
          <div className="big-time text-[52px] font-semibold mt-[35px]">{formatDuration(seconds)}</div>
          <p>Total time</p>
          <p className="post-note font-hand text-[14px] text-brown mt-1 mb-2 mx-0">
            You found your rhythm tonight.
          </p>
        </div>
        <div className="summary grid grid-cols-3 border-t [border-top-color:var(--color-rule)] border-b [border-bottom-color:var(--color-rule)] mt-2.5 mb-5 mx-0 py-3.5 px-0 [&_div]:text-center [&_div]:flex [&_div]:flex-col [&_small]:text-[12px] [&_small]:text-muted">
          <div>
            <b>{formatDuration(phaseSecs.Prep)}</b>
            <small>Prep</small>
          </div>
          <div>
            <b>{formatDuration(phaseSecs.Cook)}</b>
            <small>Cook</small>
          </div>
          <div>
            <b>{phaseSecs.Clean ? formatDuration(phaseSecs.Clean) : '—'}</b>
            <small>Clean</small>
          </div>
        </div>
        <div className="check-list border-t [border-top-color:var(--color-rule)] [&_button]:w-full [&_button]:border-t-0 [&_button]:[border-top-color:currentColor] [&_button]:border-r-0 [&_button]:[border-right-color:currentColor] [&_button]:border-b [&_button]:[border-bottom-color:var(--color-rule)] [&_button]:border-l-0 [&_button]:[border-left-color:currentColor] [&_button]:bg-transparent [&_button]:text-left [&_button]:flex [&_button]:items-center [&_button]:gap-3 [&_button]:py-[15px] [&_button]:px-0 [&_button:disabled]:opacity-40">
          <button type="button" onClick={() => setShare(!share)}>
            <span
              className={`checkbox  w-[21px] h-[21px] grid place-items-center rounded-[4px] border border-brown [&.checked]:bg-green [&.checked]:text-paper [&.checked]:border-green ${
                share ? 'checked' : ''
              }`}
            >
              {share && <Icon name="check" size={15} />}
            </span>
            Share step times to help beginners
          </button>
          <button type="button" onClick={() => setCleanup(!cleanup)}>
            <span
              className={`checkbox  w-[21px] h-[21px] grid place-items-center rounded-[4px] border border-brown [&.checked]:bg-green [&.checked]:text-paper [&.checked]:border-green ${
                cleanup ? 'checked' : ''
              }`}
            >
              {cleanup && <Icon name="check" size={15} />}
            </span>
            Include cleanup time
          </button>
        </div>
        <div className="action-stack flex flex-col gap-[9px] mt-5.5">
          <Button onClick={() => finish(Math.max(1, Math.round(seconds / 60)))}>Log this meal</Button>
          <Button secondary onClick={back}>
            Skip logging
          </Button>
        </div>
      </>
    );
  const cur = S[step - 1];
  return (
    <>
      <Header title="Cook mode" back={back} />
      <button
        type="button"
        className="splits-link min-h-control rounded-control bg-transparent flex items-center gap-[5px] text-brown ml-auto mb-[5px] border-0"
        onClick={() => setShowSplits(true)}
      >
        <Icon name="list" /> Splits
      </button>
      <Segments items={['Prep', 'Cook', 'Clean']} value={phase} set={setPhase} />
      <div className="timer text-center text-[54px] font-semibold tracking-[.03em] mt-7.5 mb-6 mx-0 [&_small]:block [&_small]:text-[12px] [&_small]:text-muted [&_small]:tracking-[.15em]">
        {formatDuration(seconds)}
        <small>TOTAL TIME</small>
      </div>
      <div className="cook-card p-4.5 rounded-[12px] border border-brown [&_h1]:text-[26px] [&_h1]:mt-5.5 [&_h1]:mb-3 [&_h1]:mx-0 [&_textarea]:h-[55px]">
        <div className="step-meta flex justify-between items-center text-muted text-[13px]">
          <span>
            Step {step} of {S.length}
          </span>
          <Chip>Step {formatDuration(stepSecs)}</Chip>
        </div>
        <h1>{cur[0]}</h1>
        <p>{cur[1]}</p>
        <div className="benchmark bg-dark text-[13px] p-2.5 rounded-[8px]">
          Beginners take about {cur[2]} min
        </div>
        <div className="cook-links flex justify-between items-center [&_button]:bg-transparent [&_button]:text-brown [&_button]:py-3 [&_button]:px-0 [&_button]:border-0">
          <button type="button" onClick={() => setSubs(!subs)}>
            Substitutions
          </button>
          <button
            type="button"
            className="hand-note font-hand text-[14px] text-brown bg-transparent pt-3.5 pb-0 px-0 border-0"
            onClick={() => setNote(!note)}
          >
            + Add a note
          </button>
        </div>
        {subs && (
          <p className="note font-hand text-[14px] text-brown">
            Olive oil works here; use a little less than butter.
          </p>
        )}
        {note && (
          <textarea
            // biome-ignore lint/a11y/noAutofocus: the note field is revealed by an explicit Add a note action.
            autoFocus
            placeholder="A private note for next time"
          />
        )}
      </div>
      <div className="cook-actions flex gap-[9px] mt-6 pb-3">
        <Button secondary onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Resume'}
        </Button>
        <Button onClick={next}>{step === S.length ? 'Finish' : 'Next step'}</Button>
      </div>
    </>
  );
}
