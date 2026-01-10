export type Tool = {
  short: string;
  title: string;
  description: string;
  href: string;
};

export const tools: Tool[] = [
  {
    short: "AES",
    title: "AES (CBC/PKCS5)",
    description: "Criptografia simétrica AES com chave de 16 caracteres.",
    href: "/tools/aes",
  },
  {
    short: "SHA-256",
    title: "SHA-256",
    description: "Gera hash SHA-256 em hexadecimal.",
    href: "/tools/sha256",
  },
  {
    short: "Vigenère",
    title: "Criptografia Vigenère (XOR)",
    description: "Cifra/decifra via XOR com senha, exibindo saída em hex.",
    href: "/tools/vigenere",
  },
  {
    short: "DH",
    title: "Diffie–Hellman",
    description: "Troca de chaves: calcule pública e chave compartilhada.",
    href: "/tools/diffie-hellman",
  },
  {
    short: "Quebra V.",
    title: "Quebra Vigenère (hardcoded)",
    description: "Ataque estatístico usando criptograma embutido no backend.",
    href: "/tools/quebra-vigenere",
  },
  {
    short: "Quebra OTP",
    title: "Quebra OTP reutilizado (hardcoded)",
    description: "Crib-dragging em criptogramas embutidos.",
    href: "/tools/quebra-otp",
  },
  {
    short: "Crack",
    title: "Crack de Senhas (hardcoded)",
    description: "Força bruta em hashes embutidos (use com limites).",
    href: "/tools/crack-de-senha",
  },
];
