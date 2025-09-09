import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class CriptografiaVigenere {
    public static void main(String[] args) {
        // Declaração de Variáveis
        BufferedReader leitor = new BufferedReader(new InputStreamReader(System.in));
        String mensagem = "";
        String senha = "";
        String cifra = "";
        int opcao = 0;
        String continuar = "";

        // Entrada de Dados
        try {
            System.out.print("Digite a mensagem: ");
            mensagem = leitor.readLine();
            System.out.print("Escolha uma opção (1 - Criptografar, 2 - Descriptografar): ");
            opcao = Integer.parseInt(leitor.readLine());

            do {
                System.out.print("Digite a senha: ");
                senha = leitor.readLine();

                // Processamento
                if (opcao == 1) {
                    cifra = encriptar(mensagem, senha);
                } else if (opcao == 2) {
                    cifra = decriptar(mensagem, senha);
                }

                // Saída de Dados
                System.out.println("Resultado: " + cifra);

                System.out.print("Deseja testar com outra senha? (s/n): ");
                continuar = leitor.readLine();

            } while (continuar.equalsIgnoreCase("s"));

        } catch (IOException erro) {
            System.out.println(erro);
        }
    }

    public static String encriptar(String mensagem, String senha) {
        String cifra = "";

        for (int i = 0; i < mensagem.length(); i++) {
            int letraMensagem = mensagem.charAt(i);
            int letraSenha = senha.charAt(i % senha.length());
            int letraCifra = (letraMensagem ^ letraSenha);

            String temp = Integer.toHexString(0xff & letraCifra);
            if (temp.length() == 1)
                temp = "0" + temp;

            cifra += temp;
        }

        return cifra;
    }

    public static String decriptar(String cifra, String senha) {
        String mensagem = "";

        for (int i = 0; i < cifra.length(); i += 2) {
            int letraCifra = Integer.parseInt(cifra.substring(i, i + 2), 16);
            int letraSenha = senha.charAt(i / 2 % senha.length());
            int letraMensagem = (letraCifra ^ letraSenha);

            mensagem += ((char) letraMensagem);
        }

        return mensagem;
    }
}