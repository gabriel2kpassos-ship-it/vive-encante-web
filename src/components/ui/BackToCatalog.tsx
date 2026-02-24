import Link from "next/link";

type Props = {
  href?: string;
  label?: string;
};

export function BackToCatalog({ href = "/catalogo", label = "← Voltar ao catálogo" }: Props) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="
          inline-flex items-center gap-2
          rounded-2xl border
          bg-white
          px-4 py-2
          text-sm font-bold text-gray-800
          shadow-sm
          transition
          hover:bg-gray-50
          hover:shadow-md
        "
      >
        {label}
      </Link>
    </div>
  );
}
