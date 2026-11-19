import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { Icon } from '@/web/components/ui/Icon';

export function Onboarding({ finish }: { finish: (skill: string) => void }) {
  const [step, setStep] = useState(1);
  const [skill, setSkill] = useState('Just starting out');
  const [reasons, setReasons] = useState<string[]>(['Learn a skill']);
  const toggle = (x: string) => setReasons((s) => (s.includes(x) ? s.filter((y) => y !== x) : [...s, x]));
  return (
    <div className="onboarding min-h-0 flex flex-col pt-2 h-full [&_h1]:text-[29px] [&_h1]:my-2 [&_h1]:mx-0 [&>p]:mt-0">
      <div className="onboard-mark flex items-center gap-[7px] font-display mb-3.5">
        <Icon name="book" />
        <b>RecipeBox</b>
      </div>
      <div className="onboard-progress flex gap-[5px] mb-4.5 [&_i]:h-1 [&_i]:flex-1 [&_i]:bg-dark [&_i]:rounded-[4px] [&_i.active]:bg-green">
        <i className="active" />
        <i className={step === 2 ? 'active' : ''} />
      </div>
      {step === 1 ? (
        <>
          <span className="eyebrow text-green-dark text-[9px] font-extrabold tracking-[.1em]">
            LET’S START WHERE YOU ARE
          </span>
          <h1>How comfortable are you in the kitchen?</h1>
          <p>Only you see this. You can change it anytime.</p>
          <div className="radio-cards skill-cards flex flex-col gap-2 mt-3 mb-auto mx-0 [&_i]:w-4.5 [&_i]:h-4.5 [&_i]:relative [&_i]:rounded-full [&_i]:border [&_i]:border-brown [&>button]:bg-card [&>button]:min-h-14 [&>button]:flex [&>button]:items-center [&>button]:gap-2.5 [&>button]:text-left [&>button]:py-2 [&>button]:px-3 [&>button]:rounded-control [&>button]:border [&>button]:border-rule [&_button.active]:bg-dark [&_button.active]:border-2 [&_button.active]:border-green [&_small]:block [&_small]:text-muted [&_small]:text-[9px] [&.inline]:grid [&.inline]:grid-cols-2 [&.inline_button]:justify-center">
            {[
              'Just starting out',
              'I can follow a recipe',
              'Comfortable improvising',
              'Confident, want a challenge',
            ].map((x) => (
              <button
                type="button"
                className={skill === x ? 'active' : ''}
                onClick={() => setSkill(x)}
                key={x}
              >
                <i />
                <span>{x}</span>
              </button>
            ))}
          </div>
          <Button onClick={() => setStep(2)}>Continue</Button>
        </>
      ) : (
        <>
          <span className="eyebrow text-green-dark text-[9px] font-extrabold tracking-[.1em]">
            ONE MORE THING
          </span>
          <h1>Why are you cooking more?</h1>
          <p>Pick as many as you like.</p>
          <div className="reason-grid grid grid-cols-2 gap-2.5 mt-4.5 mb-auto mx-0 [&_.chip]:min-h-control [&_.chip]:text-[12px] [&_.chip]:rounded-control">
            {['Save money', 'Eat healthier', 'Learn a skill', 'Cook for others'].map((x) => (
              <Chip key={x} selected={reasons.includes(x)} onClick={() => toggle(x)}>
                {x}
              </Chip>
            ))}
          </div>
          <div className="onboard-actions grid grid-cols-[1fr_2fr] gap-2.5">
            <Button secondary onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => finish(skill)}>Go to Home</Button>
          </div>
        </>
      )}
    </div>
  );
}
