import java.security.MessageDigest;
import java.util.HashMap;

public class CrackDeSenha {
    private static HashMap<String, String> arquivoDeSenhas = new HashMap<String, String>();

    private static void inicializar() {
        arquivoDeSenhas.put("fc5669b52ce4e283ad1d5d182de88ff9faec6672bace84ac2ce4c083f54fe2bc", "kali");
        arquivoDeSenhas.put("353b31cbc5fe9caf53063936395072f9369076a7d0c8ee534f834cb2693dd6e2", "junior");
        arquivoDeSenhas.put("8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", "mane");
        arquivoDeSenhas.put("d58d736c7a967fb5f307951932734f8b0594725faa5011dbb66a8c538e635fb6", "fulano");
        arquivoDeSenhas.put("b7e94be513e96e8c45cd23d162275e5a12ebde9100a425c4ebcdd7fa4dcd897c", "beltrano");
        arquivoDeSenhas.put("280d44ab1e9f79b5cce2dd4f58f5fe91f0fbacdac9f7447dffc318ceb79f2d02", "cicrano");
        arquivoDeSenhas.put("0c08a9536b5dd78713f440acb930872fd69f7a71ad0cf9cdedc9628ddf9ac3d7", "gabriel");
        arquivoDeSenhas.put("65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5", "joao");
        arquivoDeSenhas.put("26df939ee38cc162bb98f4eb5a111fdb270db6bd1dc645e98871ac2d8449bd6c", "humberto");
        arquivoDeSenhas.put("d04a0747e946c6233ab5a91ceb3a59624cdf14d7fd05e9386d22580ec980455e", "maria");
        arquivoDeSenhas.put("756356fbfa52ca1d11812575fcb9238edb0cecd44785f2c73d4604c56954d0af", "fernanda");
        arquivoDeSenhas.put("8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", "mario");
        arquivoDeSenhas.put("d75d2785d90cab90245dc9e22a82c1a048673c4a2c54fa1754e9085f4f01d687", "sunda");
        arquivoDeSenhas.put("e79c15d596b9b9c1334150622ce1ecb016c61e2bf05b7864296a29f9e62ed863", "zulu");
    }

    private static void procurar(String senha) throws Exception {
        String hash = calcularHash(senha);

        if (arquivoDeSenhas.containsKey(hash)) {
            System.out.println("Achei a senha de um trouxa !");
            System.out.println(arquivoDeSenhas.get(hash) + " " + senha);
        }
    }

    private static String calcularHash(String texto) throws Exception {
        MessageDigest objHash = MessageDigest.getInstance("SHA-256");
        byte[] temp = objHash.digest(texto.getBytes("UTF-8"));
        String retorno = "";
        for (int i = 0; i < temp.length; i++) {
            String caracter = Integer.toHexString(0xff & temp[i]);
            if (caracter.length() == 1)
                caracter = "0" + caracter;
            retorno += caracter;
        }
        return retorno;
    }

    public static void main(String[] args) {
        try {
            inicializar();

            // Procura de senhas numéricas
            for (int i = 0; i < 1000000; i++) {
                procurar("" + i);
            }

            // Procura de senhas 5 letras minúsculas
            for (int a = 97; a < 123; a++) {
                procurar("" + (char) a);
                for (int b = 97; b < 123; b++) {
                    procurar("" + ((char) a) +
                            ((char) b));
                    for (int c = 97; c < 123; c++) {
                        procurar("" + ((char) a) +
                                ((char) b) +
                                ((char) c));
                        for (int d = 97; d < 123; d++) {
                            procurar("" + ((char) a) +
                                    ((char) b) +
                                    ((char) c) +
                                    ((char) d));
                            for (int e = 97; e < 123; e++) {
                                procurar("" + ((char) a) +
                                        ((char) b) +
                                        ((char) c) +
                                        ((char) d) +
                                        ((char) e));
                            }
                        }
                    }
                }
            }

            // Procura de senhas 5 letras maiúsculas
            for (int a = 65; a < 91; a++) {
                procurar("" + (char) a);
                for (int b = 65; b < 91; b++) {
                    procurar("" + ((char) a) +
                            ((char) b));
                    for (int c = 65; c < 91; c++) {
                        procurar("" + ((char) a) +
                                ((char) b) +
                                ((char) c));
                        for (int d = 65; d < 91; d++) {
                            procurar("" + ((char) a) +
                                    ((char) b) +
                                    ((char) c) +
                                    ((char) d));
                            for (int e = 65; e < 91; e++) {
                                procurar("" + ((char) a) +
                                        ((char) b) +
                                        ((char) c) +
                                        ((char) d) +
                                        ((char) e));
                            }
                        }
                    }
                }
            }
            // Procura de senhas 5 letras alfabéticas
            for (int a = 65; a < 123; a++) {
                procurar("" + (char) a);
                for (int b = 65; b < 123; b++) {
                    procurar("" + ((char) a) +
                            ((char) b));
                    for (int c = 65; c < 123; c++) {
                        procurar("" + ((char) a) +
                                ((char) b) +
                                ((char) c));
                        for (int d = 65; d < 123; d++) {
                            procurar("" + ((char) a) +
                                    ((char) b) +
                                    ((char) c) +
                                    ((char) d));
                            for (int e = 65; e < 123; e++) {
                                procurar("" + ((char) a) +
                                        ((char) b) +
                                        ((char) c) +
                                        ((char) d) +
                                        ((char) e));
                            }
                        }
                    }
                }
            }
        } catch (Exception erro) {
        }
    }
}
