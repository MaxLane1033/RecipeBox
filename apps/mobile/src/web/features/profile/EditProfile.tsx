import { useRef, useState } from 'react';
import { Button } from '@/web/components/ui/Button';
import type { ProfileIdentity } from '@/web/features/profile/hooks/useProfile';

type EditProfileProps = {
  identity: ProfileIdentity;
  save: (identity: ProfileIdentity) => Promise<void>;
  cancel: () => void;
};

export function EditProfile({ identity, save, cancel }: EditProfileProps) {
  const [name, setName] = useState(identity.name);
  const pending = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async () => {
    if (pending.current || !name.trim()) return;
    pending.current = true;
    setSaving(true);
    setError('');
    try {
      await save({ name });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save your profile. Try again.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };
  return (
    <form
      className="mt-5 rounded-xl border border-rule bg-card p-4"
      aria-label="Edit profile"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <h2 className="text-[17px]">Edit profile</h2>
      <label>
        Name
        <input
          className="field-input"
          value={name}
          maxLength={50}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
          disabled={saving}
        />
      </label>
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-danger">
          {error}
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button secondary onClick={cancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim() || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
