import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { Header } from '@/web/components/ui/Header';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';

export function ScanResults({ back, openRecipe }: { back: () => void; openRecipe: (n?: string) => void }) {
  return (
    <>
      <Header title="Fridge scan" back={back} />
      <p className="notice mb-4">Sample fridge scan · camera recognition is coming later.</p>
      <Photo className="scan-photo h-[220px] " name="Fridge" />
      <div className="section-title flex justify-between items-center mt-6 mb-2.5 mx-0 [&>span]:text-[13px] [&>span]:text-muted">
        <h2>Ingredients in this example</h2>
        <span>6 ingredients</span>
      </div>
      <div className="chip-row flex gap-1.5 flex-wrap">
        {['Eggs', 'Rice', 'Carrots', 'Peas', 'Butter', 'Soy sauce'].map((x) => (
          <Chip selected key={x}>
            {x}
          </Chip>
        ))}
      </div>
      <article className="scan-match bg-card my-5 mx-0 p-[15px] rounded-[12px] border border-rule [&_h1]:mt-[5px]">
        <Level />
        <h1>Egg fried rice</h1>
        <p>Also needs: scallions, sesame oil</p>
        <p className="post-note font-hand text-[14px] text-brown mt-1 mb-2 mx-0">
          swap: chives for scallions
        </p>
        <div className="nearby border-t [border-top-color:var(--color-rule)] pt-3 text-[12px]">
          Check your pantry for sesame oil.
        </div>
      </article>
      <Button onClick={() => openRecipe('Egg fried rice')}>View matching recipe</Button>
    </>
  );
}
