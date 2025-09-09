import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;

public class Visao extends JFrame {
  // Propriedades da classe
  private static final long serialVersionUID = 1L;

  private JTextArea txtTexto = new JTextArea();
  private JScrollPane jspTexto = new JScrollPane(txtTexto);

  private JTextField txtResumo = new JTextField();

  private JButton btnCalcular = new JButton("Calcular");

  // Método principal de execução da janela
  public static void main(String[] args) {
    new Visao().setVisible(true);
  }

  // Método construtor da classe
  public Visao() {
    setTitle("Cálculo do Resumo Unidirecional SHA-256");
    setSize(500, 400);
    setDefaultCloseOperation(EXIT_ON_CLOSE);
    setLocationRelativeTo(null);
    setLayout(null);

    // Adiciona os componentes na janela
    jspTexto.setBounds(10, 10, 465, 250);
    add(jspTexto);
    txtTexto.setLineWrap(true);

    // Configuração da caixa de resumo
    txtResumo.setBounds(10, 270, 465, 20);
    add(txtResumo);

    // Configuração do botão de cálculo
    btnCalcular.setBounds(200, 300, 100, 30);
    add(btnCalcular);
    // Ação do botão
    btnCalcular.addActionListener(new ActionListener() {
      public void actionPerformed(ActionEvent erro) {
        try {
          String texto = txtTexto.getText();
          String resumo = SHA256.calcular(texto);
          txtResumo.setText(resumo);
        } catch (Exception ex) {
          JOptionPane.showMessageDialog(null, erro);
        }
      }
    });
  }

}
