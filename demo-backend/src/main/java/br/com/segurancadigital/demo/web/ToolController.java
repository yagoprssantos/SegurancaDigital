package br.com.segurancadigital.demo.web;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class ToolController {

    private static final byte[] AES_IV = "Junior e Bonitao".getBytes(StandardCharsets.UTF_8);

    private static final BigInteger DH_P = new BigInteger("102031405123416071809152453627382938465749676859789");
    private static final BigInteger DH_G = new BigInteger("1234567890123456789012345");

    private static final String VIGENERE_BREAK_CIPHER_HEX = QuebraVigenereCipher.CIPHER_HEX;

    private static final String[] OTP_COLLECTION = QuebraOtpData.COLLECTION;

    private static final Map<String, String> PASSWORD_HASHES = CrackHashes.HASH_TO_LABEL;

    private static final int MAX_TEXT_LEN = 10_000;
    private static final int MAX_PASSWORD_LEN = 256;
    private static final int MAX_HEX_LEN = 40_000; // 20k bytes
    private static final int MAX_BASE64_LEN = 60_000;
    private static final int MAX_BIGINT_STR_LEN = 120;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true);
    }

    // AES
    public record AesEncryptRequest(String plaintext, String key) {}
    public record AesEncryptResponse(String ciphertextBase64) {}
    public record AesDecryptRequest(String ciphertextBase64, String key) {}
    public record AesDecryptResponse(String plaintext) {}

    @PostMapping("/aes/encrypt")
    public AesEncryptResponse aesEncrypt(@RequestBody AesEncryptRequest req) throws Exception {
        String key = requireKey16(req.key());
        String plaintext = requireMaxLen(Objects.requireNonNullElse(req.plaintext(), ""), "plaintext", MAX_TEXT_LEN);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(AES_IV));
        byte[] out = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
        return new AesEncryptResponse(Base64.getEncoder().encodeToString(out));
    }

    @PostMapping("/aes/decrypt")
    public AesDecryptResponse aesDecrypt(@RequestBody AesDecryptRequest req) throws Exception {
        String key = requireKey16(req.key());
        String ciphertextBase64 = requireMaxLen(Objects.requireNonNullElse(req.ciphertextBase64(), ""), "ciphertextBase64", MAX_BASE64_LEN);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(AES_IV));
        byte[] out = cipher.doFinal(Base64.getDecoder().decode(ciphertextBase64));
        return new AesDecryptResponse(new String(out, StandardCharsets.UTF_8));
    }

    // SHA-256
    public record ShaRequest(String text) {}
    public record ShaResponse(String hashHex) {}

    @PostMapping("/sha256")
    public ShaResponse sha256(@RequestBody ShaRequest req) throws Exception {
        String text = requireMaxLen(Objects.requireNonNullElse(req.text(), ""), "text", MAX_TEXT_LEN);
        return new ShaResponse(sha256Hex(text));
    }

    // Vigenere XOR
    public record VigenereEncryptRequest(String message, String password) {}
    public record VigenereEncryptResponse(String cipherHex) {}
    public record VigenereDecryptRequest(String cipherHex, String password) {}
    public record VigenereDecryptResponse(String message) {}

    @PostMapping("/vigenere/encrypt")
    public VigenereEncryptResponse vigenereEncrypt(@RequestBody VigenereEncryptRequest req) {
        String message = requireMaxLen(Objects.requireNonNullElse(req.message(), ""), "message", MAX_TEXT_LEN);
        String password = requireMaxLen(requireNonEmpty(req.password(), "password"), "password", MAX_PASSWORD_LEN);
        return new VigenereEncryptResponse(vigenereEncryptHex(message, password));
    }

    @PostMapping("/vigenere/decrypt")
    public VigenereDecryptResponse vigenereDecrypt(@RequestBody VigenereDecryptRequest req) {
        String cipherHex = requireHexMaxLen(requireNonEmpty(req.cipherHex(), "cipherHex"), "cipherHex", MAX_HEX_LEN);
        String password = requireMaxLen(requireNonEmpty(req.password(), "password"), "password", MAX_PASSWORD_LEN);
        return new VigenereDecryptResponse(vigenereDecryptHex(cipherHex, password));
    }

    // Diffie-Hellman
    public record DhPublicRequest(String privateKey) {}
    public record DhPublicResponse(String publicKey) {}
    public record DhSharedRequest(String privateKey, String otherPublicKey) {}
    public record DhSharedResponse(String sharedKey) {}

    @PostMapping("/diffie-hellman/public")
    public DhPublicResponse dhPublic(@RequestBody DhPublicRequest req) {
        BigInteger priv = parseDhPrivate(requireNonEmpty(req.privateKey(), "privateKey"));
        BigInteger pub = DH_G.modPow(priv, DH_P);
        return new DhPublicResponse(pub.toString());
    }

    @PostMapping("/diffie-hellman/shared")
    public DhSharedResponse dhShared(@RequestBody DhSharedRequest req) {
        BigInteger priv = parseDhPrivate(requireNonEmpty(req.privateKey(), "privateKey"));
        BigInteger otherPub = parseDhPublic(requireNonEmpty(req.otherPublicKey(), "otherPublicKey"));
        BigInteger shared = otherPub.modPow(priv, DH_P);
        return new DhSharedResponse(shared.toString());
    }

    // Quebra Vigenere (hardcoded)
    public record QuebraVigenereRequest(Integer keyLength) {}
    public record QuebraVigenereResponse(String key, String plaintextGuess, String cipherHex) {}

    @PostMapping("/quebra-vigenere/run")
    public QuebraVigenereResponse quebraVigenere(@RequestBody QuebraVigenereRequest req) {
        int length = req != null && req.keyLength() != null ? req.keyLength() : 9;
        if (length < 3 || length > 12) {
            throw new IllegalArgumentException("keyLength deve estar entre 3 e 12");
        }

        String key = guessVigenereKeyBySpaceFrequency(VIGENERE_BREAK_CIPHER_HEX, length);
        String plaintextGuess = vigenereDecryptHex(VIGENERE_BREAK_CIPHER_HEX, key);
        return new QuebraVigenereResponse(key, plaintextGuess, VIGENERE_BREAK_CIPHER_HEX);
    }

    // Quebra OTP (hardcoded)
    public record QuebraOtpRequest(Integer indexA, Integer indexB, String crib) {}
    public record QuebraOtpResponse(String xorHex, String cribHex, String hint) {}

    @PostMapping("/quebra-otp/run")
    public QuebraOtpResponse quebraOtp(@RequestBody QuebraOtpRequest req) {
        int indexA = req.indexA() == null ? 0 : req.indexA();
        int indexB = req.indexB() == null ? 1 : req.indexB();
        if (indexA < 0 || indexA >= OTP_COLLECTION.length || indexB < 0 || indexB >= OTP_COLLECTION.length) {
            throw new IllegalArgumentException("indexA/indexB fora do intervalo 0.." + (OTP_COLLECTION.length - 1));
        }
        String crib = Objects.requireNonNullElse(req.crib(), "");
        if (crib.isEmpty()) {
            throw new IllegalArgumentException("crib não pode ser vazio");
        }
        requireMaxLen(crib, "crib", 256);

        String c1 = OTP_COLLECTION[indexA];
        String c2 = OTP_COLLECTION[indexB];
        int maxBytes = Math.min(c1.length(), c2.length()) / 2;
        if (crib.length() > maxBytes) {
            throw new IllegalArgumentException("crib muito grande para os criptogramas escolhidos");
        }

        byte[] xor = new byte[crib.length()];
        byte[] cribBytes = crib.getBytes(StandardCharsets.UTF_8);
        byte[] derived = new byte[crib.length()];

        for (int i = 0; i < crib.length(); i++) {
            int b1 = Integer.parseInt(c1.substring(2 * i, 2 * (i + 1)), 16);
            int b2 = Integer.parseInt(c2.substring(2 * i, 2 * (i + 1)), 16);
            xor[i] = (byte) (b1 ^ b2);
            derived[i] = (byte) (cribBytes[i] ^ b1 ^ b2);
        }

        String xorHex = toHex(xor);
        String cribHex = toHex(cribBytes);
        String derivedText = new String(derived, StandardCharsets.ISO_8859_1);
        String hint = "Saída (char)(crib ^ c1 ^ c2): '" + derivedText + "'";
        return new QuebraOtpResponse(xorHex, cribHex, hint);
    }

    // Crack de senha (hardcoded)
    public record CrackRequest(String mode, Integer numericMax, Integer maxAlphaLen) {}
    public record CrackMatch(String hash, String password) {}
    public record CrackResponse(String mode, long tried, List<CrackMatch> matches, String note) {}

    @PostMapping("/crack-de-senha/run")
    public CrackResponse crack(@RequestBody CrackRequest req) throws Exception {
        String mode = Objects.requireNonNullElse(req.mode(), "numeric");
        if (!mode.equals("numeric") && !mode.equals("alpha")) {
            throw new IllegalArgumentException("mode deve ser 'numeric' ou 'alpha'");
        }

        List<CrackMatch> matches = new ArrayList<>();
        long tried = 0;

        if (mode.equals("numeric")) {
            int max = req.numericMax() == null ? 250000 : req.numericMax();
            max = Math.max(0, Math.min(max, 1_000_000));
            for (int i = 0; i <= max; i++) {
                String guess = String.valueOf(i);
                tried++;
                String hash = sha256Hex(guess);
                if (PASSWORD_HASHES.containsKey(hash)) {
                    matches.add(new CrackMatch(hash, guess));
                }
            }
            return new CrackResponse("numeric", tried, matches,
                    "Limite aplicado para demo/serverless (0.." + max + ")");
        }

        int maxLen = req.maxAlphaLen() == null ? 4 : req.maxAlphaLen();
        maxLen = Math.max(1, Math.min(maxLen, 5));
        String alphabet = "abcdefghijklmnopqrstuvwxyz";

        for (int len = 1; len <= maxLen; len++) {
            int[] idx = new int[len];
            while (true) {
                StringBuilder sb = new StringBuilder(len);
                for (int i = 0; i < len; i++) sb.append(alphabet.charAt(idx[i]));
                String guess = sb.toString();
                tried++;
                String hash = sha256Hex(guess);
                if (PASSWORD_HASHES.containsKey(hash)) {
                    matches.add(new CrackMatch(hash, guess));
                }

                int pos = len - 1;
                while (pos >= 0) {
                    idx[pos]++;
                    if (idx[pos] < alphabet.length()) break;
                    idx[pos] = 0;
                    pos--;
                }
                if (pos < 0) break;
            }
        }

        return new CrackResponse("alpha", tried, matches,
                "Demo: apenas minúsculas a..z (tamanho 1.." + maxLen + ")");
    }

    // Helpers
    private static String requireKey16(String key) {
        String k = requireNonEmpty(key, "key");
        if (k.length() != 16) {
            throw new IllegalArgumentException("key deve ter exatamente 16 caracteres");
        }
        return k;
    }

    private static String requireMaxLen(String value, String field, int max) {
        if (value == null) return "";
        if (value.length() > max) {
            throw new IllegalArgumentException(field + " muito grande (max " + max + ")");
        }
        return value;
    }

    private static String requireHexMaxLen(String hex, String field, int maxLen) {
        requireMaxLen(hex, field, maxLen);
        if ((hex.length() % 2) != 0) {
            throw new IllegalArgumentException(field + " deve ter tamanho par");
        }
        for (int i = 0; i < hex.length(); i++) {
            char c = hex.charAt(i);
            boolean ok = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
            if (!ok) throw new IllegalArgumentException(field + " deve ser hexadecimal");
        }
        return hex;
    }

    private static BigInteger parseDhPrivate(String raw) {
        String s = requireMaxLen(raw.trim(), "privateKey", MAX_BIGINT_STR_LEN);
        if (s.startsWith("+")) s = s.substring(1);
        if (!s.matches("\\d+")) throw new IllegalArgumentException("privateKey deve ser um inteiro positivo");
        BigInteger v = new BigInteger(s);
        if (v.signum() <= 0) throw new IllegalArgumentException("privateKey deve ser > 0");
        if (v.compareTo(DH_P) >= 0) throw new IllegalArgumentException("privateKey deve ser < p");
        return v;
    }

    private static BigInteger parseDhPublic(String raw) {
        String s = requireMaxLen(raw.trim(), "otherPublicKey", MAX_BIGINT_STR_LEN);
        if (s.startsWith("+")) s = s.substring(1);
        if (!s.matches("\\d+")) throw new IllegalArgumentException("otherPublicKey deve ser um inteiro positivo");
        BigInteger v = new BigInteger(s);
        if (v.signum() <= 0) throw new IllegalArgumentException("otherPublicKey deve ser > 0");
        if (v.compareTo(DH_P) >= 0) throw new IllegalArgumentException("otherPublicKey deve ser < p");
        return v;
    }

    private static String requireNonEmpty(String value, String field) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(field + " não pode ser vazio");
        }
        return value;
    }

    private static String sha256Hex(String text) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] out = digest.digest(text.getBytes(StandardCharsets.UTF_8));
        return toHex(out);
    }

    private static String toHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            String s = Integer.toHexString(0xff & b);
            if (s.length() == 1) sb.append('0');
            sb.append(s);
        }
        return sb.toString();
    }

    private static String vigenereEncryptHex(String message, String password) {
        StringBuilder out = new StringBuilder(message.length() * 2);
        for (int i = 0; i < message.length(); i++) {
            int m = message.charAt(i);
            int p = password.charAt(i % password.length());
            int c = (m ^ p);
            String temp = Integer.toHexString(0xff & c);
            if (temp.length() == 1) temp = "0" + temp;
            out.append(temp);
        }
        return out.toString();
    }

    private static String vigenereDecryptHex(String cipherHex, String password) {
        if ((cipherHex.length() % 2) != 0) {
            throw new IllegalArgumentException("cipherHex deve ter tamanho par");
        }
        StringBuilder out = new StringBuilder(cipherHex.length() / 2);
        for (int i = 0; i < cipherHex.length(); i += 2) {
            int c = Integer.parseInt(cipherHex.substring(i, i + 2), 16);
            int p = password.charAt((i / 2) % password.length());
            int m = (c ^ p);
            out.append((char) m);
        }
        return out.toString();
    }

    private static String guessVigenereKeyBySpaceFrequency(String cipherHex, int keyLength) {
        StringBuilder key = new StringBuilder(keyLength);

        for (int pos = 0; pos < keyLength; pos++) {
            int[] freq = new int[256];

            for (int i = 0; i < cipherHex.length(); i += 2) {
                int byteIndex = (i / 2);
                if ((byteIndex % keyLength) == pos) {
                    int b = Integer.parseInt(cipherHex.substring(i, i + 2), 16);
                    freq[b]++;
                }
            }

            int max = 0;
            int mostCommon = 0;
            for (int i = 0; i < 256; i++) {
                if (freq[i] > max) {
                    max = freq[i];
                    mostCommon = i;
                }
            }

            key.append((char) (mostCommon ^ 32));
        }

        return key.toString();
    }

    private static final class QuebraVigenereCipher {
        private static final String CIPHER_HEX = "07145a01314152052d5a5e16747e4e083214631db551520e68785f1f35125f006867431f22531b00264144103d5d4e4d685a4f0020531b152d46cd1279545e083a550a5b6500145961180a0221571b17295d0a122741520f294606533a57481529145b0635404f0065524f1a26531b497907054b7d1e1b1425550a1e3156520529145a013b445212bb46431274514908295a4e1c744756006858431d3c531b052d144901bd56521527144e1674601f417b040a113d5e53942d470a0335405a412d595a0131415a1268565812275b570421464b007442490422414e1a37535f003b145a16385348413a5149163a465e1268404b0b35d5ce043b14431e245d481529470a03315e541268715907355654126861441a305d484d68474511745d1b0627424f013a5d1b052d146e1c3a53570568605806394215410c4158123a465e412d5a5e01314452123c550a123b124b132753581239531ba868504b53175d521229180a17351269802c5d45531653550506515d007812771424550a162c4257082b5b5f5325475e41271445113e574f083e5b0a9a74534b0e2155585331414b042b5d4b1f395755152d145a1625475e0f29470a16394249043b555953314a4b0e3a404b173b405a126414491c395d1b113a5b4e06205d49043b144e16745449143c55595f745f5e0d68510a1c2146490e3b144b1f3d5f5e0f3c5b595f74434e046840c01e745f5e0f27460a1035425a0221504b1731125f0468464f003d414f8b265743127456520026404f5330571b03294658163d405a126857451e31405808295d595d74107a12685358123a565e12681c4f1e24405e1229470353245d48123d514753395352126844451731401b052d145816275b4815a25a491a351c1b2f215a4d06bd5f1b0721574b01b5125f043b55470335405a0527144e1a355c4f0468504b0074465a1929d3df1627125f0e68445816275b5f0426404f5300404e0c381a0a25355f541268575f1a305349412c5b595320405a0329584212305d49043b144e1627415a1268514703265748003b144f53244054023d464b01745d4e153a5b59533957490229504500761e1b002e5d581e3b47154107145a01314152052d5a5e16745652123b510a0221571b0068515b063d425e412c51461674574815a9144f1f35505413295a4e1c744756006858430020531b052d145a013b564e1527470a0221571b0026404f007457490025145c163a56520527470a123b411b241d750a1674434e04684445173140d80e68474f01745652132d57431c3a535f0e3b144b533b474f1327470a0335df48043b1a0a2031554e0f2c5b0a16385717412914431d3d5152003c5d5c12745748152946cb53225b55023d584b173512db412f515812b3d154412c510a16394249042f5b59533112db4129595a1f3d53dc8227144e12744249043b514494351259132947431f315b4900685a4553375d56883a57431c745b55152d464412375b540f295804531847570068404b1e36db56412c5159073551541468455f16745d1b0627424f013a5d1b17295d0a12305d4f003a145f1e74104b002c46c91c74565e412a46431435101b0f29146501335355083255cd903b1276142650431238125f0e6877451ebd4058082714023c1971124d68504f15315c5f042650455325475e412c5d590321465a126857451e31405808295d59532757510025145816275d571721504b00745c5441bb464d903b1c1b2e68445816275b5f0426404f5339575502215b441c21125a0826504b5335124b0e3b4743113d5e520529504f5330571b043b404b11315e5e022d460a01315152113a5b491a30535f04685a4b0074405e0d29d3df162712580e251445007477481529504500746755082c5b595f745b55022441591a22571b0227590a1e21565a0faf555953315f1b0227595a0135411b0627424f013a53560426404b1a27125e41215a49163a46521727144b1c7451540f3c51d0173b1255002b5d451d355e15410c5d5900311e1b00215a4e1278125e123851581226125e0f2b5b4407265349411c465f1e24124b003a550a0639531b02275a5c1626415a416a57451e3b125f0e21470a103c575d043b144e167477481529504553311258082c554e903b411b022142431f3d485a0527470853311249043e51461c21124f043a144f1d225b5a0527145f1e351258003a404b53325d490c29580a003b5e520221404b1d305d1b132d475a1c27465a412c5b0a143b445e13265b0a1d3b404f0465554716265b5800265b0653315c4a14295a5e1c74414e0068515b063d425e4125554407bd5f1b0521d5461c335d1b0227590a122146541321504b1731411b0527470a3601731b1129464b532057551529460a0131445e133c5158533b411b113a514006b948541266146b1fbd5f1b052d144b142153490529460a01314254123c550a1731124e0c2914450620405a412b55580735125e0f3e5d4b173512580e26424317355c5f0e6860580639421b1129464b533512782e18141943781249042958430935565a41265b0a3126534808241a";
    }

    private static final class QuebraOtpData {
        private static final String[] COLLECTION = {
                "315c4eeaa8b5f8aaf9174145bf43e1784b8fa00dc71d885a804e5ee9fa40b16349c146fb778cdf2d3aff021dfff5b403b510d0d0455468aeb98622b137dae857553ccd8883a7bc37520e06e515d22c954eba5025b8cc57ee59418ce7dc6bc41556bdb36bbca3e8774301fbcaa3b83b220809560987815f65286764703de0f3d524400a19b159610b11ef3e",
                "234c02ecbbfbafa3ed18510abd11fa724fcda2018a1a8342cf064bbde548b12b07df44ba7191d9606ef4081ffde5ad46a5069d9f7f543bedb9c861bf29c7e205132eda9382b0bc2c5c4b45f919cf3a9f1cb74151f6d551f4480c82b2cb24cc5b028aa76eb7b4ab24171ab3cdadb8356f",
                "32510ba9a7b2bba9b8005d43a304b5714cc0bb0c8a34884dd91304b8ad40b62b07df44ba6e9d8a2368e51d04e0e7b207b70b9b8261112bacb6c866a232dfe257527dc29398f5f3251a0d47e503c66e935de81230b59b7afb5f41afa8d661cb",
                "32510ba9aab2a8a4fd06414fb517b5605cc0aa0dc91a8908c2064ba8ad5ea06a029056f47a8ad3306ef5021eafe1ac01a81197847a5c68a1b78769a37bc8f4575432c198ccb4ef63590256e305cd3a9544ee4160ead45aef520489e7da7d835402bca670bda8eb775200b8dabbba246b130f040d8ec6447e2c767f3d30ed81ea2e4c1404e1315a1010e7229be6636aaa",
                "3f561ba9adb4b6ebec54424ba317b564418fac0dd35f8c08d31a1fe9e24fe56808c213f17c81d9607cee021dafe1e001b21ade877a5e68bea88d61b93ac5ee0d562e8e9582f5ef375f0a4ae20ed86e935de81230b59b73fb4302cd95d770c65b40aaa065f2a5e33a5a0bb5dcaba43722130f042f8ec85b7c2070",
                "32510bfbacfbb9befd54415da243e1695ecabd58c519cd4bd2061bbde24eb76a19d84aba34d8de287be84d07e7e9a30ee714979c7e1123a8bd9822a33ecaf512472e8e8f8db3f9635c1949e640c621854eba0d79eccf52ff111284b4cc61d11902aebc66f2b2e436434eacc0aba938220b084800c2ca4e693522643573b2c4ce35050b0cf774201f0fe52ac9f26d71b6cf61a711cc229f77ace7aa88a2f19983122b11be87a59c355d25f8e4",
                "32510bfbacfbb9befd54415da243e1695ecabd58c519cd4bd90f1fa6ea5ba47b01c909ba7696cf606ef40c04afe1ac0aa8148dd066592ded9f8774b529c7ea125d298e8883f5e9305f4b44f915cb2bd05af51373fd9b4af511039fa2d96f83414aaaf261bda2e97b170fb5cce2a53e675c154c0d9681596934777e2275b381ce2e40582afe67650b13e72287ff2270abcf73bb028932836fbdecfecee0a3b894473c1bbeb6b4913a536ce4f9b13f1efff71ea313c8661dd9a4ce",
                "315c4eeaa8b5f8bffd11155ea506b56041c6a00c8a08854dd21a4bbde54ce56801d943ba708b8a3574f40c00fff9e00fa1439fd0654327a3bfc860b92f89ee04132ecb9298f5fd2d5e4b45e40ecc3b9d59e9417df7c95bba410e9aa2ca24c5474da2f276baa3ac325918b2daada43d6712150441c2e04f6565517f317da9d3",
                "271946f9bbb2aeadec111841a81abc300ecaa01bd8069d5cc91005e9fe4aad6e04d513e96d99de2569bc5e50eeeca709b50a8a987f4264edb6896fb537d0a716132ddc938fb0f836480e06ed0fcd6e9759f40462f9cf57f4564186a2c1778f1543efa270bda5e933421cbe88a4a52222190f471e9bd15f652b653b7071aec59a2705081ffe72651d08f822c9ed6d76e48b63ab15d0208573a7eef027",
                "466d06ece998b7a2fb1d464fed2ced7641ddaa3cc31c9941cf110abbf409ed39598005b3399ccfafb61d0315fca0a314be138a9f32503bedac8067f03adbf3575c3b8edc9ba7f537530541ab0f9f3cd04ff50d66f1d559ba520e89a2cb2a83",
                "32510ba9babebbbefd001547a810e67149caee11d945cd7fc81a05e9f85aac650e9052ba6a8cd8257bf14d13e6f0a803b54fde9e77472dbff89d71b57bddef121336cb85ccb8f3315f4b52e301d16e9f52f904"
        };
    }

    private static final class CrackHashes {
        private static final Map<String, String> HASH_TO_LABEL;

        static {
            Map<String, String> m = new HashMap<>();
            m.put("fc5669b52ce4e283ad1d5d182de88ff9faec6672bace84ac2ce4c083f54fe2bc", "kali");
            m.put("353b31cbc5fe9caf53063936395072f9369076a7d0c8ee534f834cb2693dd6e2", "junior");
            m.put("8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", "mane");
            m.put("d58d736c7a967fb5f307951932734f8b0594725faa5011dbb66a8c538e635fb6", "fulano");
            m.put("b7e94be513e96e8c45cd23d162275e5a12ebde9100a425c4ebcdd7fa4dcd897c", "beltrano");
            m.put("280d44ab1e9f79b5cce2dd4f58f5fe91f0fbacdac9f7447dffc318ceb79f2d02", "cicrano");
            m.put("0c08a9536b5dd78713f440acb930872fd69f7a71ad0cf9cdedc9628ddf9ac3d7", "gabriel");
            m.put("65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5", "joao");
            m.put("26df939ee38cc162bb98f4eb5a111fdb270db6bd1dc645e98871ac2d8449bd6c", "humberto");
            m.put("d04a0747e946c6233ab5a91ceb3a59624cdf14d7fd05e9386d22580ec980455e", "maria");
            m.put("756356fbfa52ca1d11812575fcb9238edb0cecd44785f2c73d4604c56954d0af", "fernanda");
            m.put("8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", "mario");
            m.put("d75d2785d90cab90245dc9e22a82c1a048673c4a2c54fa1754e9085f4f01d687", "sunda");
            m.put("e79c15d596b9b9c1334150622ce1ecb016c61e2bf05b7864296a29f9e62ed863", "zulu");
            HASH_TO_LABEL = Collections.unmodifiableMap(m);
        }
    }
}
