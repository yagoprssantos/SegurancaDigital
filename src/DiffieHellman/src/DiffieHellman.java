import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigInteger;

public class DiffieHellman {
    // Valores públicos conhecidos por todos (ambos primos)
    private static BigInteger p = new BigInteger("102031405123416071809152453627382938465749676859789");
    private static BigInteger g = new BigInteger("1234567890123456789012345");

    public static void main(String[] args) {
        BufferedReader leitor = new BufferedReader(new InputStreamReader(System.in));

        // Minhas chaves
        BigInteger minhaChaveSecreta = null;
        BigInteger minhaChavePublica = null;

        // Chaves do Outro
        BigInteger outroChavePublica = null;
        BigInteger nossaChaveCompartilhada = null;

        try {
            // 1. Preenche minha chave secreta
            System.out.print("Eu, escolha a sua chave secreta: ");
            minhaChaveSecreta = new BigInteger(leitor.readLine());

            // 2. Calcula minha chave pública
            minhaChavePublica = g.modPow(minhaChaveSecreta, p);
            System.out.println("Sua chave pública é: " + minhaChavePublica);

            // 3. Solicita a chave pública do outro
            System.out.print("Outro, informe a sua chave pública: ");
            outroChavePublica = new BigInteger(leitor.readLine());

            // 4. Calcula chave secreta do outro
            nossaChaveCompartilhada = outroChavePublica.modPow(minhaChaveSecreta, p);
            System.out.println("Nossa chave compartilhada é: " + nossaChaveCompartilhada);
        } catch (Exception erro) {
            System.out.println(erro);
        }
    }
}
