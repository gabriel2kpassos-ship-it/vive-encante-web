import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white shadow-md hover:opacity-95"
      : "border bg-white text-gray-900 hover:bg-gray-50";

  const cls = `${base} ${styles} ${className}`;

  // Link não suporta disabled nativo — então a gente bloqueia via pointer-events
  if (href) {
    return (
      <Link
        className={`${cls} ${disabled ? "pointer-events-none opacity-60" : ""}`}
        href={href}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}
