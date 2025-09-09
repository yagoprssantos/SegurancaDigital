import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AES {
    private static String encriptar(String texto, String chave) throws Exception {
        String criptograma = "";

        Cipher objCifra = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKey objChave = new SecretKeySpec(chave.getBytes("UTF-8"), "AES");
        IvParameterSpec objIv = new IvParameterSpec("Junior e Bonitao".getBytes("UTF-8"));
        objCifra.init(Cipher.ENCRYPT_MODE, objChave, objIv);
        byte[] temp = objCifra.doFinal(texto.getBytes("UTF-8"));
        criptograma = Base64.getEncoder().encodeToString(temp);

        return criptograma;
    }

    private static String decriptar(String criptograma, String chave) throws Exception {
        Cipher objCifra = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKey objChave = new SecretKeySpec(chave.getBytes("UTF-8"), "AES");
        IvParameterSpec objIv = new IvParameterSpec("Junior e Bonitao".getBytes("UTF-8"));
        objCifra.init(Cipher.DECRYPT_MODE, objChave, objIv);
        byte[] temp = objCifra.doFinal(Base64.getDecoder().decode(criptograma));

        return new String(temp, "UTF-8");
    }

    public static void main(String[] args) {
        BufferedReader leitor = new BufferedReader(new InputStreamReader(System.in));
        String texto = "";
        String chave = "";
        String criptograma = "";

        try {
            System.out.print("Digite o texto: ");
            texto = leitor.readLine();

            System.out.print("Digite a chave: ");
            chave = leitor.readLine();

            criptograma = encriptar(texto, chave);
            System.out.println(criptograma);
            System.out.println(decriptar(criptograma, chave));
        } catch (Exception erro) {
            System.out.println(erro);
        }
    }
}