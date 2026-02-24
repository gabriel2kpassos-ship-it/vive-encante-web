export const WHATSAPP_NUMBER = "553185933480";

export type BuildWhatsAppLinkArgs = {
  nome: string;
  /** opcional porque muitos itens não terão código */
  codigo?: string | null;
  /** link do item no seu site (preferencialmente absoluto) */
  link: string;
  fotoUrl?: string | null;
};

export function buildWhatsAppLink(args: BuildWhatsAppLinkArgs) {
  const codigo = (args.codigo ?? "").trim();
  const foto = (args.fotoUrl ?? "").trim();

  const msg =
    `Olá! Encontrei este item no site da Vive Encante e gostaria de orçamento e disponibilidade.\n\n` +
    `Item: ${args.nome}\n` +
    (codigo ? `Código: ${codigo}\n` : "") +
    `Link: ${args.link}\n` +
    (foto ? `Foto: ${foto}\n` : "") +
    `\nData do evento: \n` +
    `Bairro/Cidade:`;

  const text = encodeURIComponent(msg);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
