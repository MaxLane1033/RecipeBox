import { useState } from 'react';
import { Header } from '@/web/components/ui/Header';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { RECIPE_LEVELS } from '@/web/data/recipes';

export function AskRecipeBox({ back, openRecipe }: { back: () => void; openRecipe: (n?: string) => void }) {
  const [message, setMessage] = useState('');
  const [extra, setExtra] = useState<string[]>([]);
  const send = () => {
    const m = message.trim();
    if (!m) return;
    setExtra((x) => [
      ...x,
      m,
      'Good idea. Try finishing with chili flakes or a spoon of chili crisp, added a little at a time.',
    ]);
    setMessage('');
  };
  return (
    <>
      <Header title="Ask RecipeBox" back={back} />
      <p className="notice mb-4">Sample conversation · replies are scripted in this prototype.</p>
      <div className="chat flex flex-col gap-2.5 pb-17.5">
        <div className="bot max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] text-[12px] leading-[1.4] bg-dark self-start py-2.5 px-3">
          What are you in the mood for?
        </div>
        <div className="me max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[2px] rounded-bl-[12px] text-[12px] leading-[1.4] bg-green text-paper self-end py-2.5 px-3">
          Something cozy. I have 30 minutes.
        </div>
        <div className="bot max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] text-[12px] leading-[1.4] bg-dark self-start py-2.5 px-3">
          Any dietary preferences?
        </div>
        <div className="me max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[2px] rounded-bl-[12px] text-[12px] leading-[1.4] bg-green text-paper self-end py-2.5 px-3">
          Vegetarian. I have eggs and rice.
        </div>
        <div className="bot max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] text-[12px] leading-[1.4] bg-dark self-start py-2.5 px-3">
          Perfect. These both fit:
        </div>
        {['Egg fried rice', 'Shakshuka'].map((x) => (
          <button
            type="button"
            className="chat-recipe w-[88%] self-start bg-card grid grid-cols-[88px_1fr] text-left overflow-hidden p-0 rounded-[12px] border border-rule [&_.photo]:h-[88px] [&>div]:flex [&>div]:flex-col [&>div]:gap-[5px] [&>div]:p-2.5 [&_small]:text-muted"
            onClick={() => openRecipe(x)}
            key={x}
          >
            <Photo name={x} />
            <div>
              <Level level={RECIPE_LEVELS[x]} />
              <b>{x}</b>
              <small>{RECIPE_LEVELS[x] === 'Starter' ? '20' : '30'} min at your level</small>
            </div>
          </button>
        ))}
        {extra.map((m, i) => (
          <div
            className={
              i % 2
                ? 'bot max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] text-[12px] leading-[1.4] bg-dark self-start py-2.5 px-3'
                : 'me max-w-[82%] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[2px] rounded-bl-[12px] text-[12px] leading-[1.4] bg-green text-paper self-end py-2.5 px-3'
            }
            // biome-ignore lint/suspicious/noArrayIndexKey: conversation entries only append and retain their positions.
            key={i}
          >
            {m}
          </div>
        ))}
      </div>
      <div className="message-bar sticky -bottom-8 -mx-5 flex gap-2 border-t border-rule bg-paper px-5 py-2.5">
        <input
          className="field-input mt-0 min-w-0 flex-1"
          aria-label="Ask a follow-up"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask a follow-up"
        />
        <button
          type="button"
          className="min-h-control rounded-control bg-green px-3 text-[13px] font-bold text-white disabled:opacity-40"
          disabled={!message.trim()}
          onClick={send}
        >
          Send
        </button>
      </div>
    </>
  );
}
