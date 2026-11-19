import { useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import type { AppScreen } from '@/web/app/navigation';
import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import type { ExperienceLevel } from '@/web/types/domain';

export function Settings({
  back,
  go,
  level,
}: {
  back: () => void;
  go: (s: AppScreen) => void;
  level: ExperienceLevel;
}) {
  const { data: session } = authClient.useSession();
  const signingOutRef = useRef(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const signOut = async () => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    setSigningOut(true);
    setSignOutError('');
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setSignOutError(result.error.message ?? 'Could not sign out. Try again.');
        return;
      }
      await queryClient.cancelQueries();
      queryClient.clear();
    } catch {
      setSignOutError('Cannot reach the server. Try signing out again when connected.');
    } finally {
      signingOutRef.current = false;
      setSigningOut(false);
    }
  };
  const [open, setOpen] = useState('');
  const [chosen, setChosen] = useState<string[]>(['Vegetarian', 'Oven', 'Stovetop']);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Meal reminders': true,
    'Challenge updates': true,
    'Share my step times by default': false,
    'Private diary': true,
  });
  const toggle = (x: string) => setChosen((s) => (s.includes(x) ? s.filter((y) => y !== x) : [...s, x]));
  return (
    <>
      <Header title="Settings" back={back} />
      <p className="notice mb-4">
        Preference controls are previews. Cooking level is saved on this device; other settings reset when you
        leave.
      </p>
      <button
        type="button"
        className="settings-row w-full h-[55px] border-t-0 [border-top-color:currentColor] border-r-0 [border-right-color:currentColor] border-b [border-bottom-color:var(--color-rule)] border-l-0 [border-left-color:currentColor] bg-transparent flex items-center justify-between text-left [&_b]:text-muted [&_b]:text-[13px]"
        onClick={() => go('level')}
      >
        <span>My cooking level</span>
        <b className="inline-flex items-center gap-2">
          {level}
          <Icon name="forward" size={16} />
        </b>
      </button>
      {['Dietary preferences', 'Kitchen equipment'].map((x) => (
        <div className="settings-block [&_.setting-chips]:py-3 [&_.setting-chips]:px-0" key={x}>
          <button
            type="button"
            className="settings-row w-full h-[55px] border-t-0 [border-top-color:currentColor] border-r-0 [border-right-color:currentColor] border-b [border-bottom-color:var(--color-rule)] border-l-0 [border-left-color:currentColor] bg-transparent flex items-center justify-between text-left [&_b]:text-muted [&_b]:text-[13px]"
            onClick={() => setOpen(open === x ? '' : x)}
          >
            <span>{x}</span>
            <Icon name={open === x ? 'minus' : 'forward'} size={16} />
          </button>
          {open === x && (
            <div className="chip-row setting-chips flex gap-1.5 flex-wrap">
              {(x === 'Dietary preferences'
                ? ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free']
                : ['Oven', 'Stovetop', 'Air fryer', 'Blender', 'Slow cooker']
              ).map((y) => (
                <Chip key={y} selected={chosen.includes(y)} onClick={() => toggle(y)}>
                  {y}
                </Chip>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="settings-block [&_.setting-chips]:py-3 [&_.setting-chips]:px-0">
        <button
          type="button"
          className="settings-row w-full h-[55px] border-t-0 [border-top-color:currentColor] border-r-0 [border-right-color:currentColor] border-b [border-bottom-color:var(--color-rule)] border-l-0 [border-left-color:currentColor] bg-transparent flex items-center justify-between text-left [&_b]:text-muted [&_b]:text-[13px]"
          onClick={() => setOpen(open === 'store' ? '' : 'store')}
        >
          <span>Preferred grocery store</span>
          <Icon name="forward" size={16} />
        </button>
        {open === 'store' && (
          <input
            className="link-input setting-input field-input mb-3 block"
            aria-label="Preferred grocery store"
            defaultValue="Green Market"
          />
        )}
      </div>
      {['Notifications', 'Privacy'].map((group) => (
        <div className="settings-block [&_.setting-chips]:py-3 [&_.setting-chips]:px-0" key={group}>
          <button
            type="button"
            className="settings-row w-full h-[55px] border-t-0 [border-top-color:currentColor] border-r-0 [border-right-color:currentColor] border-b [border-bottom-color:var(--color-rule)] border-l-0 [border-left-color:currentColor] bg-transparent flex items-center justify-between text-left [&_b]:text-muted [&_b]:text-[13px]"
            onClick={() => setOpen(open === group ? '' : group)}
          >
            <span>{group}</span>
            <Icon name={open === group ? 'minus' : 'forward'} size={16} />
          </button>
          {open === group &&
            (group === 'Notifications'
              ? ['Meal reminders', 'Challenge updates']
              : ['Share my step times by default', 'Private diary']
            ).map((x) => (
              <button
                type="button"
                className="toggle-row w-full border-t-0 [border-top-color:currentColor] border-r-0 [border-right-color:currentColor] border-b [border-bottom-color:var(--color-rule)] border-l-0 [border-left-color:currentColor] bg-transparent flex justify-between items-center text-[13px] py-3 px-0 [&_i]:w-[38px] [&_i]:h-5.5 [&_i]:bg-dark [&_i]:relative [&_i]:rounded-[12px] [&_i.on]:bg-green"
                role="switch"
                aria-checked={toggles[x]}
                onClick={() => setToggles((t) => ({ ...t, [x]: !t[x] }))}
                key={x}
              >
                <span>{x}</span>
                <i className={toggles[x] ? 'on' : ''} />
              </button>
            ))}
        </div>
      ))}
      <section className="mt-6 border-t border-rule pt-5" aria-labelledby="account-title">
        <h2 id="account-title" className="text-[17px]">
          Account
        </h2>
        {session?.user.email && <p className="mt-2 break-words text-[13px]">{session.user.email}</p>}
        {signOutError && (
          <p role="alert" className="mt-3 text-[13px] text-danger">
            {signOutError}
          </p>
        )}
        <div className="mt-4">
          <Button secondary disabled={signingOut} onClick={() => void signOut()}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </section>
    </>
  );
}
