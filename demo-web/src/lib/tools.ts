import type { IconType } from 'react-icons';
import {
  FiHash,
  FiKey,
  FiLock,
  FiSearch,
  FiShuffle,
  FiTarget,
  FiUnlock,
} from 'react-icons/fi';

export type Tool = {
  short: string;
  title: string;
  description: string;
  href: string;
  icon: IconType;
  beginner: {
    what: string;
    why: string;
    how: string;
    note?: string;
  };
};

export const tools: Tool[] = [
  {
    short: 'AES',
    title: 'AES (CBC/PKCS5)',
    description: 'Criptografia simétrica AES com chave de 16 caracteres.',
    href: '/tools/aes',
    icon: FiLock,
    beginner: {
      what: 'Criptografa e descriptografa um texto com uma chave (senha).',
      why: 'Mostra como uma cifra simétrica protege dados quando você tem a chave correta.',
      how: 'Digite uma chave de 16 caracteres e um texto. Clique em Criptografar para gerar o resultado e Decriptografar para voltar ao texto original.',
      note: 'Demo didático: o IV é fixo (não recomendado em produção).',
    },
  },
  {
    short: 'SHA-256',
    title: 'SHA-256',
    description: 'Gera hash SHA-256 em hexadecimal.',
    href: '/tools/sha256',
    icon: FiHash,
    beginner: {
      what: 'Transforma um texto em uma “impressão digital” (hash) de tamanho fixo.',
      why: 'Hashes ajudam a verificar integridade e armazenar senhas de forma mais segura (com técnicas adicionais).',
      how: 'Digite um texto e gere o hash. Se mudar uma letra, o hash muda completamente.',
    },
  },
  {
    short: 'Vigenère',
    title: 'Criptografia Vigenère (XOR)',
    description: 'Cifra/decifra via XOR com senha, exibindo saída em hex.',
    href: '/tools/vigenere',
    icon: FiKey,
    beginner: {
      what: 'Cifra e decifra usando uma senha repetida, aplicando XOR caractere a caractere.',
      why: 'Ajuda a entender o conceito de “texto + chave” gerando um criptograma.',
      how: 'Digite uma senha e uma mensagem. Clique em Cifrar para ver o texto cifrado (hex) e em Decifrar para recuperar a mensagem.',
      note: 'Não é a Vigenère clássica; é uma versão XOR para fins didáticos.',
    },
  },
  {
    short: 'DH',
    title: 'Diffie–Hellman',
    description: 'Troca de chaves: calcule pública e chave compartilhada.',
    href: '/tools/diffie-hellman',
    icon: FiShuffle,
    beginner: {
      what: 'Duas pessoas combinam uma chave em comum sem enviar a chave diretamente.',
      why: 'É a base de muitas conexões seguras (ideia de trocar segredo em público).',
      how: 'Digite sua chave privada para gerar sua chave pública. Depois, cole a pública da outra parte e calcule a chave compartilhada.',
    },
  },
  {
    short: 'Quebra V.',
    title: 'Quebra Vigenère (hardcoded)',
    description: 'Ataque estatístico usando criptograma embutido no backend.',
    href: '/tools/quebra-vigenere',
    icon: FiSearch,
    beginner: {
      what: 'Tenta descobrir a chave e o texto original de um criptograma fixo.',
      why: 'Mostra como padrões (como espaço) podem vazar informação quando a cifra é fraca.',
      how: 'Escolha um tamanho de chave e rode a quebra. O sistema mostra uma chave estimada e um texto “provável”.',
      note: 'Usa criptograma hardcoded do projeto original.',
    },
  },
  {
    short: 'Quebra OTP',
    title: 'Quebra OTP reutilizado (hardcoded)',
    description: 'Crib-dragging em criptogramas embutidos.',
    href: '/tools/quebra-otp',
    icon: FiTarget,
    beginner: {
      what: 'Mostra o problema grave de reutilizar a mesma OTP (one-time pad).',
      why: 'Quando a OTP é reutilizada, dá para cruzar criptogramas e “chutar” partes do texto.',
      how: 'Escolha 2 índices e um crib (um pedaço provável de texto). O sistema calcula XOR e uma dica do texto derivado.',
      note: 'Dados hardcoded (demo).',
    },
  },
  {
    short: 'Crack',
    title: 'Crack de Senhas (hardcoded)',
    description: 'Força bruta em hashes embutidos (use com limites).',
    href: '/tools/crack-de-senha',
    icon: FiUnlock,
    beginner: {
      what: 'Simula tentativa e erro para achar senhas que batem com hashes conhecidos.',
      why: 'Demonstra por que senhas fracas caem rapidamente em força bruta.',
      how: 'Escolha o modo e o limite. O sistema tenta candidatos e retorna os que combinam com a lista do demo.',
      note: 'Limites existem para manter o demo rápido/seguro.',
    },
  },
];
