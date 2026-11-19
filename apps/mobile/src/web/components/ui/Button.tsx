import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  secondary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  form?: string;
};
export function Button({ children, secondary, onClick, disabled, type = 'button', form }: ButtonProps) {
  return (
    <button
      type={type}
      form={form}
      className={`btn flex min-h-control w-full items-center justify-center gap-2 rounded-control px-3 py-2 text-[13px] font-bold disabled:opacity-40 ${
        secondary
          ? 'secondary border border-rule bg-white text-green hover:bg-dark'
          : 'bg-green text-white hover:bg-green-dark'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
