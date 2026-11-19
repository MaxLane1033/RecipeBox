import { useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import type { CookingCommunity } from '@/web/types/domain';

export function CreateCommunity({
  back,
  onCreate,
}: {
  back: () => void;
  onCreate: (c: CookingCommunity) => void;
}) {
  const [privacy, setPrivacy] = useState('Public');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  return (
    <>
      <Header title="Create community" back={back} />
      <label>
        Name
        <input
          className="link-input field-input block"
          placeholder="e.g. Tiny kitchen club"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          placeholder="What will you cook together?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </label>
      <b className="filter-label block text-[12px] mt-5">Who can join?</b>
      <div className="radio-cards flex flex-col gap-2 mt-2.5 mb-5 mx-0 [&_i]:w-4.5 [&_i]:h-4.5 [&_i]:relative [&_i]:rounded-full [&_i]:border [&_i]:border-brown [&>button]:bg-card [&>button]:min-h-14 [&>button]:flex [&>button]:items-center [&>button]:gap-2.5 [&>button]:text-left [&>button]:py-2 [&>button]:px-3 [&>button]:rounded-control [&>button]:border [&>button]:border-rule [&_button.active]:bg-dark [&_button.active]:border-2 [&_button.active]:border-green [&_small]:block [&_small]:text-muted [&_small]:text-[12px] [&.inline]:grid [&.inline]:grid-cols-2 [&.inline_button]:justify-center">
        {['Public', 'Invite only'].map((x) => (
          <button
            type="button"
            className={privacy === x ? 'active' : ''}
            onClick={() => setPrivacy(x)}
            key={x}
          >
            <i />
            <div>
              <b>{x}</b>
              <small>{x === 'Public' ? 'Anyone can join' : 'You approve each member'}</small>
            </div>
          </button>
        ))}
      </div>
      <Button
        disabled={!name.trim()}
        onClick={() =>
          onCreate({
            id: `x${Date.now()}`,
            name: name.trim(),
            members: privacy === 'Public' ? '1 member' : '1 member · Invite only',
            blurb: desc.trim() || 'A new community',
            priv: privacy === 'Invite only',
            status: 'joined',
            cover: 'Garlic butter pasta',
            posts: [],
          })
        }
      >
        Create
      </Button>
    </>
  );
}
